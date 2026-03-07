"use client";

import { useEffect, useRef } from "react";
import * as signalR from "@microsoft/signalr";

export type InvitationNotification = {
  invited_user: string;
  project: string;
  inviter_user: string;
  message: string;
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
      .configureLogging(signalR.LogLevel.Trace)
      .build();

    connection.on("ReceiveInvitation", (payload: InvitationNotification) => {
      console.info(`${logPrefix} evento ReceiveInvitation`, payload);
      onInvitation(payload);
    });

    connection.onreconnecting(async (error) => {
      console.warn(`${logPrefix} reconectando...`, error);
      await refreshSession();
    });

    connection.onreconnected((connectionId) => {
      console.info(`${logPrefix} reconectado`, { connectionId });
    });

    connection.onclose(async (error) => {
      if (cancelled) return;
      console.warn(`${logPrefix} conexao fechada`, error);
      try {
        await refreshSession();
        console.info(`${logPrefix} tentando iniciar apos fechamento`);
        await connection.start();
        console.info(`${logPrefix} conexao iniciada apos fechamento`);
      } catch {
        console.error(`${logPrefix} falha ao iniciar apos fechamento`);
        // no-op: automatic reconnect will keep trying
      }
    });

    const start = async () => {
      try {
        console.info(`${logPrefix} iniciando conexao...`);
        await connection.start();
        connectionRef.current = connection;
        console.info(`${logPrefix} conexao iniciada`);
      } catch {
        console.warn(`${logPrefix} falha no start inicial; tentando refresh de sessao`);
        const refreshed = await refreshSession();
        if (!cancelled && refreshed) {
          try {
            await connection.start();
            connectionRef.current = connection;
            console.info(`${logPrefix} conexao iniciada apos refresh de sessao`);
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
        console.info(`${logPrefix} encerrando conexao no unmount`);
        void current.stop();
      }
    };
  }, [apiBaseUrl, getAccessToken, onInvitation, refreshSession]);

  return null;
}
