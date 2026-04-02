import React from "react";
import { useNotification } from "../context/NotificationContext";

export default function NotificationBar() {
  const { notifications, removeNotification } = useNotification();

  if (notifications.length === 0) return null;

  return (
    <div className="notification-bar">
      {notifications.map((n) => (
        <div key={n.id} className={`notification-item notification-${n.type}`} onClick={() => removeNotification(n.id)}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {n.type === "danger" && <span style={{ fontSize: "1.4rem" }}>🚨</span>}
            {n.type === "warning" && <span style={{ fontSize: "1.4rem" }}>⚠️</span>}
            <span>{n.message}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
