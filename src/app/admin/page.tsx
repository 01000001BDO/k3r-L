'use client';

import { useState, useEffect } from 'react';
import { serviceProduit } from '@/services/api';
import { toast } from 'react-hot-toast';
import { Produit } from '@/types';
import Image from 'next/image';
import Link from 'next/link';

export default function TableauDeBordAdmin() {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [loading, setLoading] = useState(true);
  const [recherche, setRecherche] = useState('');
  const [totalProduits, setTotalProduits] = useState(0);

  useEffect(() => {
    const chargerProduits = async () => {
      try {
        const donnees = await serviceProduit.getTout();
        setProduits(donnees);
        setTotalProduits(donnees.length);
      } catch (error) {
        console.error('Erreur lors du chargement des produits:', error);
        toast.error('Erreur lors du chargement des produits');
      } finally {
        setLoading(false);
      }
    };

    chargerProduits();
  }, []);

  const supprimerProduit = async (id: string, nom: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer "${nom}" ?`)) {
      return;
    }

    try {
      await serviceProduit.supprimer(id);
      setProduits(produits.filter(p => p._id !== id));
      setTotalProduits(prevTotal => prevTotal - 1);
      toast.success(`${nom} supprimé avec succès`);
    } catch (error) {
      toast.error('Erreur lors de la suppression du produit');
    }
  };
  
  const produitsFiltres = recherche
    ? produits.filter(p => 
        p.nom.toLowerCase().includes(recherche.toLowerCase()) || 
        p.description.toLowerCase().includes(recherche.toLowerCase())
      )
    : produits;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-boulangerie-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold font-serif mb-2">Tableau de Bord</h1>
          <p className="text-gray-600">Gérez vos produits</p>
        </div>
        <Link 
          href="/admin/produits/nouveau" 
          className="mt-4 md:mt-0 bg-boulangerie-600 hover:bg-boulangerie-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Ajouter un produit
        </Link>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-boulangerie-100 text-boulangerie-600">
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"></path>
            </svg>
          </div>
          <div className="ml-5">
            <p className="text-gray-500 text-sm font-medium uppercase">Total des produits</p>
            <p className="text-gray-900 text-xl font-semibold">{totalProduits}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-medium mb-4 md:mb-0">Liste des Produits</h2>
          
          <div className="w-full md:w-64">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-boulangerie-500"
              />
              <svg className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prix
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ingrédients
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {produitsFiltres.map(produit => (
                <tr key={produit._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 relative">
                        <Image
                          src={produit.image}
                          alt={produit.nom}
                          fill
                          className="rounded-md object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{produit.nom}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{produit.description.substring(0, 50)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {produit.enPromotion && produit.prixPromotion ? (
                      <div>
                        <span className="text-sm text-red-600 font-medium">{produit.prixPromotion.toFixed(2)}€</span>
                        <span className="text-xs text-gray-500 line-through ml-2">{produit.prix.toFixed(2)}€</span>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-900">{produit.prix.toFixed(2)}€</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-1">
                      {produit.disponible ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Disponible
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Indisponible
                        </span>
                      )}
                      {produit.enVedette && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          En vedette
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {produit.ingredients.slice(0, 3).map((ingredient, index) => (
                        <span key={index} className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                          {ingredient}
                        </span>
                      ))}
                      {produit.ingredients.length > 3 && (
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                          +{produit.ingredients.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link 
                      href={`/produits/${produit._id}`} 
                      target="_blank"
                      className="text-gray-500 hover:text-gray-700 mr-4"
                    >
                      <svg className="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                    </Link>
                    <Link 
                      href={`/admin/produits/${produit._id}/modifier`} 
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      <svg className="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                    </Link>
                    <button
                      onClick={() => supprimerProduit(produit._id, produit.nom)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <svg className="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {produitsFiltres.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            {recherche ? (
              <>
                <p>Aucun produit ne correspond à votre recherche.</p>
                <button 
                  onClick={() => setRecherche('')}
                  className="mt-2 text-boulangerie-600 hover:text-boulangerie-800"
                >
                  Réinitialiser la recherche
                </button>
              </>
            ) : (
              <>
                Aucun produit trouvé. <Link href="/admin/produits/nouveau" className="text-boulangerie-600 hover:text-boulangerie-800">Ajoutez-en un</Link>.
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}