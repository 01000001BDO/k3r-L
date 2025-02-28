'use client';

import { Produit } from '@/types';
import { serviceProduit } from '@/services/api';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

interface ListeProduitAdminProps {
  produits: Produit[];
}

export const ListeProduitAdmin = ({ produits: produitInitiaux }: ListeProduitAdminProps) => {
  const [produits, setProduits] = useState(produitInitiaux);

  const supprimerProduit = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      return;
    }

    try {
      await serviceProduit.supprimer(id);
      setProduits(produits.filter(p => p._id !== id));
      toast.success('Produit supprimé avec succès');
    } catch (error) {
      toast.error('Erreur lors de la suppression du produit');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Image
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nom
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Prix
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {produits.map((produit) => (
            <tr key={produit._id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="relative w-16 h-16">
                  <Image
                    src={produit.image}
                    alt={produit.nom}
                    fill
                    className="object-cover rounded"
                  />
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {produit.nom}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {produit.prix.toFixed(2)}€
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <Link
                  href={`/admin/produits/${produit._id}/modifier`}
                  className="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                  Modifier
                </Link>
                <button
                  onClick={() => supprimerProduit(produit._id)}
                  className="text-red-600 hover:text-red-900"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};