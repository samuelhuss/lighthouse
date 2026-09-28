import { NotificationRulesView } from "@/components/admin/NotificationRulesView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notificações - Admin Lighthouse",
};

export default function AdminNotificacoesPage() {
  return <NotificationRulesView />;
}
