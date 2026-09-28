import { AdminShell } from "@/components/admin/AdminShell";
import { NotificationRulesView } from "@/components/admin/NotificationRulesView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notificações - Admin Lighthouse",
};

export default function AdminNotificacoesPage() {
  return (
    <AdminShell>
      <NotificationRulesView />
    </AdminShell>
  );
}
