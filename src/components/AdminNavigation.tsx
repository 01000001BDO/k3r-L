'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useNotifications } from '@/context/ContexteNotifications';

export const AdminNavigation = () => {
  const pathname = usePathname();
  const { nouvellesCommandes, marquerCommandesVues, commandesRecentes } = useNotifications();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (pathname?.includes('/admin/commandes') && nouvellesCommandes > 0) {
      marquerCommandesVues();
    }
  }, [pathname, nouvellesCommandes, marquerCommandesVues]);

  const handleNotificationsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setNotificationsOpen(!notificationsOpen);
    if (!notificationsOpen && nouvellesCommandes > 0) {
      marquerCommandesVues();
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Date inconnue';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <nav className="bg-boulangerie-800 text-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/admin" className="text-xl font-serif">
              Administration
            </Link>
            <div className="ml-10 flex space-x-6">
              <Link
                href="/admin"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === '/admin'
                    ? 'bg-boulangerie-700 text-white'
                    : 'text-gray-300 hover:bg-boulangerie-700 hover:text-white'
                }`}
              >
                Tableau de bord
              </Link>
              
              <div className="relative" ref={notificationsRef}>
                <Link
                  href="/admin/commandes"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname?.includes('/admin/commandes')
                      ? 'bg-boulangerie-700 text-white'
                      : 'text-gray-300 hover:bg-boulangerie-700 hover:text-white'
                  } relative`}
                >
                  Commandes
                  {nouvellesCommandes > 0 && (
                    <button 
                      onClick={handleNotificationsClick}
                      className="absolute -top-1 -right-1 bg-red-500 text-white w-5 h-5 flex items-center justify-center rounded-full text-xs animate-pulse"
                    >
                      {nouvellesCommandes}
                    </button>
                  )}
                </Link>
                
                {/* Dropdown des notifications */}
                {notificationsOpen && (
                  <div className="absolute left-0 mt-2 w-72 bg-white rounded-md shadow-lg z-50 text-gray-800">
                    <div className="py-2 px-4 bg-gray-50 border-b border-gray-200">
                      <h3 className="text-sm font-medium text-gray-700">Nouvelles commandes</h3>
                    </div>
                    <div className="py-1 max-h-96 overflow-y-auto">
                      {commandesRecentes && commandesRecentes.length > 0 ? (
                        commandesRecentes.map((commande, index) => (
                          <Link 
                            key={commande._id || index}
                            href={`/admin/commandes?id=${commande._id}`}
                            className="block px-4 py-3 hover:bg-gray-50 transition border-b border-gray-100"
                            onClick={() => setNotificationsOpen(false)}
                          >
                            <div className="flex justify-between">
                              <p className="text-sm font-medium text-gray-900">
                                Commande #{commande._id?.substring(commande._id.length - 6)}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatDate(commande.createdAt || '')}
                              </p>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                              {commande.infoClient?.nom} - {commande.prixTotal?.toFixed(2)}€
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {commande.produits?.length || 0} article(s)
                            </p>
                          </Link>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-sm text-gray-500">
                          Aucune nouvelle commande
                        </div>
                      )}
                    </div>
                    <div className="py-1 bg-gray-50 border-t border-gray-200">
                      <Link
                        href="/admin/commandes"
                        className="block px-4 py-2 text-center text-sm text-boulangerie-600 font-medium hover:bg-gray-100"
                        onClick={() => setNotificationsOpen(false)}
                      >
                        Voir toutes les commandes
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              
              <Link
                href="/admin/produits/nouveau"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === '/admin/produits/nouveau'
                    ? 'bg-boulangerie-700 text-white'
                    : 'text-gray-300 hover:bg-boulangerie-700 hover:text-white'
                }`}
              >
                Ajouter un produit
              </Link>
              <Link
                href="/"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-boulangerie-700 hover:text-white"
                target="_blank"
              >
                Voir le site
              </Link>
            </div>
          </div>
          <Link
            href="/admin/profil"
            className="flex items-center text-gray-300 hover:text-white"
          >
            <span className="mr-2">Admin</span>
            <div className="w-8 h-8 rounded-full bg-boulangerie-600 flex items-center justify-center text-sm font-semibold">
              A
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
};