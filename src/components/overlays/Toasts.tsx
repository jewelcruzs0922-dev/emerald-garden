"use client";

import Link from "next/link";
import { IconCheck } from "@/components/icons";
import { useStore } from "@/lib/store";

export default function Toasts() {
  const { toasts, dismissToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-stack">
      {toasts.map((toast) => (
        <div className="toast is-in" key={toast.id} role="status">
          <IconCheck />
          <span>{toast.message}</span>
          {toast.action ? (
            <Link href={toast.action.href} onClick={() => dismissToast(toast.id)}>
              {toast.action.label}
            </Link>
          ) : null}
        </div>
      ))}
    </div>
  );
}
