import { AdminRouteLayout } from "@/components/admin/AdminRouteLayout";

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return <AdminRouteLayout>{children}</AdminRouteLayout>;
}