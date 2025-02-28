'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [autorise, setAutorise] = useState(false);
  const [verification, setVerification] = useState(true);

  useEffect(() => {
    const adminConnecte = sessionStorage.getItem('adminConnecte');
    
    if (!adminConnecte) {
      toast.error('Accès non autorisé. Veuillez vous connecter.');
      router.push('/admin/connexion');
    } else {
      setAutorise(true);
    }
    
    setVerification(false);
  }, [router]);

  if (verification) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-boulangerie-600"></div>
          <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
            <div className="h-6 w-6 bg-gray-100 rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return autorise ? <>{children}</> : null;
}