'use client';

import { usePathname } from 'next/navigation';
import AdminGuard from '@/components/AdminGuard';
import { AdminNavigation } from '@/components/AdminNavigation';
import { FournisseurNotifications } from '@/context/ContexteNotifications';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  if (pathname === '/admin/connexion') {
    return <>{children}</>;
  }

  return (
    <AdminGuard>
      <FournisseurNotifications>
        <div className="min-h-screen bg-gray-100">
          <AdminNavigation />
          <div className="container mx-auto px-4 py-8">
            {children}
          </div>
        </div>
      </FournisseurNotifications>
    </AdminGuard>
  );
}