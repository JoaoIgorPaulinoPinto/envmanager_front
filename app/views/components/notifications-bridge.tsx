"use client";

import { useEffect, useRef } from "react";
import * as signalR from "@microsoft/signalr";

export type InvitationNotification = {
  invited_user: string;
  project: string;
  inviter_user: string;
  message: string;
  token?: string;
  invitation_token?: string;
  invite_token?: string;
  invitationToken?: string;
  inviteToken?: string;
  data?: {
    token?: string;
    invitation_token?: string;
    invite_token?: string;
    invitationToken?: string;
    inviteToken?: string;
  };
};

type NotificationsBridgeProps = {
  apiBaseUrl: string;
  getAccessToken: () => Promise<string | null>;
  refreshSession: () => Promise<string | null>;
  onInvitation: (data: InvitationNotification) => void;
};

export default function NotificationsBridge({
  apiBaseUrl,
  getAccessToken,
  refreshSession,
  onInvitation,
}: NotificationsBridgeProps) {
  const connectionRef = useRef<signalR.HubConnection | null>(null);

  useEffect(() => {
    let cancelled = false;
    const logPrefix = "[SignalR][notificationHub]";

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${apiBaseUrl}/notificationHub`, {
        accessTokenFactory: async () => (await getAccessToken()) ?? "",
        withCredentials: true,
      })
      .withAutomaticReconnect([0, 1000, 3000, 5000])
      .configureLogging(signalR.LogLevel.Error)
      .build();

    connection.on("ReceiveInvitation", (payload: InvitationNotification) => {
      onInvitation(payload);
    });

    connection.onreconnecting(async (error) => {
      console.warn(`${logPrefix} reconectando...`, error);
      await refreshSession();
    });

    connection.onclose(async (error) => {
      if (cancelled) return;
      console.warn(`${logPrefix} conexao fechada`, error);
      try {
        await refreshSession();
        await connection.start();
      } catch {
        console.error(`${logPrefix} falha ao iniciar apos fechamento`);
        // no-op: automatic reconnect will keep trying
      }
    });

    const start = async () => {
      try {
        await connection.start();
        connectionRef.current = connection;
      } catch {
        console.warn(`${logPrefix} falha no start inicial; tentando refresh de sessao`);
        const refreshed = await refreshSession();
        if (!cancelled && refreshed) {
          try {
            await connection.start();
            connectionRef.current = connection;
          } catch {
            console.error(`${logPrefix} falha ao iniciar mesmo apos refresh`);
            // no-op: automatic reconnect will keep trying
          }
        }
      }
    };

    start();

    return () => {
      cancelled = true;
      const current = connectionRef.current;
      connectionRef.current = null;
      if (current) {
        void current.stop();
      }
    };
  }, [apiBaseUrl, getAccessToken, onInvitation, refreshSession]);

  return null;
}
