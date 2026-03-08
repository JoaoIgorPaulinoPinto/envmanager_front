"use client";

import { useCallback, useState } from "react";
import InviteService from "../../services/InviteService";
import { getApiBaseUrl } from "../../services/api-base-url";
import { getAccessToken, refreshSession } from "../../services/client-session";
import NotificationsBridge, {
  InvitationNotification,
} from "../../views/components/notifications-bridge";
import HomeView from "../../views/home/home-view";
import styles from "./home-module.module.css";

type HomeModuleProps = {
  projectId?: string;
};

type UINotification = InvitationNotification & {
  id: string;
};

const inviteService = new InviteService();

const getInvitationToken = (notification: InvitationNotification): string | null => {
  return (
    notification.token ??
    notification.invitation_token ??
    notification.invite_token ??
    notification.invitationToken ??
    notification.inviteToken ??
    notification.data?.token ??
    notification.data?.invitation_token ??
    notification.data?.invite_token ??
    notification.data?.invitationToken ??
    notification.data?.inviteToken ??
    null
  );
};

export default function HomeModule({ projectId }: HomeModuleProps) {
  const [notifications, setNotifications] = useState<UINotification[]>([]);
  const [notificationErrors, setNotificationErrors] = useState<
    Record<string, string>
  >({});
  const [notificationStatus, setNotificationStatus] = useState<
    Record<string, string>
  >({});
  const [pendingNotifications, setPendingNotifications] = useState<
    Record<string, "accept" | "decline" | null>
  >({});
  const apiBaseUrl = getApiBaseUrl();

  const removeNotification = useCallback((notificationId: string) => {
    setNotifications((current) =>
      current.filter((item) => item.id !== notificationId),
    );
    setNotificationErrors((current) => {
      const next = { ...current };
      delete next[notificationId];
      return next;
    });
    setNotificationStatus((current) => {
      const next = { ...current };
      delete next[notificationId];
      return next;
    });
    setPendingNotifications((current) => {
      const next = { ...current };
      delete next[notificationId];
      return next;
    });
  }, []);

  const handleInvitation = useCallback((payload: InvitationNotification) => {
    const notificationId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setNotifications((current) => {
      const nextItem: UINotification = {
        ...payload,
        id: notificationId,
      };
      return [nextItem, ...current].slice(0, 5);
    });

    window.setTimeout(() => {
      removeNotification(notificationId);
    }, 25000);
  }, [removeNotification]);

  const resolveInvite = useCallback(
    async (notificationId: string, accepted: boolean) => {
      const notification = notifications.find((item) => item.id === notificationId);
      if (!notification) return;

      const token = getInvitationToken(notification);

      if (!token) {
        setNotificationErrors((current) => ({
          ...current,
          [notificationId]: "Invitation token not found.",
        }));
        return;
      }

      setPendingNotifications((current) => ({
        ...current,
        [notificationId]: accepted ? "accept" : "decline",
      }));
      setNotificationErrors((current) => ({ ...current, [notificationId]: "" }));
      setNotificationStatus((current) => ({ ...current, [notificationId]: "" }));

      try {
        await inviteService.answerInvite({ token, accepted });
        setNotificationStatus((current) => ({
          ...current,
          [notificationId]: accepted ? "Invitation accepted." : "Invitation declined.",
        }));
        window.setTimeout(() => {
          removeNotification(notificationId);
        }, 1200);
      } catch (error: unknown) {
        setNotificationErrors((current) => ({
          ...current,
          [notificationId]:
            error instanceof Error ? error.message : "Failed to answer invitation.",
        }));
      } finally {
        setPendingNotifications((current) => ({
          ...current,
          [notificationId]: null,
        }));
      }
    },
    [notifications, removeNotification],
  );

  const handleAccept = useCallback(
    (notificationId: string) => {
      void resolveInvite(notificationId, true);
    },
    [resolveInvite],
  );
  const handleDecline = useCallback(
    (notificationId: string) => {
      void resolveInvite(notificationId, false);
    },
    [resolveInvite],
  );

  return (
    <>
      <NotificationsBridge
        apiBaseUrl={apiBaseUrl}
        getAccessToken={getAccessToken}
        refreshSession={refreshSession}
        onInvitation={handleInvitation}
      />
      <HomeView projectId={projectId} />
      <div className={styles.notificationsStack}>
        {notifications.map((item) => (
          <article key={item.id} className={styles.notificationCard}>
            <strong>Invitation received</strong>
            <p>{item.message || "You were invited to a project."}</p>
            <span>Project: {item.project}</span>
            <span>From: {item.inviter_user}</span>
            {notificationStatus[item.id] && (
              <p className={styles.notificationStatus}>{notificationStatus[item.id]}</p>
            )}
            {notificationErrors[item.id] && (
              <p className={styles.notificationError}>{notificationErrors[item.id]}</p>
            )}
            <div className={styles.notificationActions}>
              <button
                type="button"
                className={styles.acceptButton}
                onClick={() => handleAccept(item.id)}
                disabled={Boolean(pendingNotifications[item.id])}
              >
                {pendingNotifications[item.id] === "accept"
                  ? "Accepting..."
                  : "Accept"}
              </button>
              <button
                type="button"
                className={styles.declineButton}
                onClick={() => handleDecline(item.id)}
                disabled={Boolean(pendingNotifications[item.id])}
              >
                {pendingNotifications[item.id] === "decline"
                  ? "Declining..."
                  : "Decline"}
              </button>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
