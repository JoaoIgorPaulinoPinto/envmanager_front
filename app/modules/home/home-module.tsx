"use client";

import { useCallback, useState } from "react";
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

export default function HomeModule({ projectId }: HomeModuleProps) {
  const [notifications, setNotifications] = useState<UINotification[]>([]);
  const apiBaseUrl = getApiBaseUrl();

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
      setNotifications((current) =>
        current.filter((item) => item.id !== notificationId),
      );
    }, 25000);
  }, []);

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
          </article>
        ))}
      </div>
    </>
  );
}
