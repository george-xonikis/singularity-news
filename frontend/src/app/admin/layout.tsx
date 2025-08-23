import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Notifications } from '@/components/admin/Notifications';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />
      <main className="ml-64 p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {children}
        </div>
      </main>
      <Notifications />
    </div>
  );
}