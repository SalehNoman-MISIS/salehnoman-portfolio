import type { Metadata } from "next";
import AdminApp from "@/components/admin/AdminApp";

export const metadata: Metadata = {
  title: "Content admin",
  robots: { index: false, follow: false },
};

// Always render fresh (auth state is per-request).
export const dynamic = "force-dynamic";

export default function AdminPage() {
  return <AdminApp />;
}
