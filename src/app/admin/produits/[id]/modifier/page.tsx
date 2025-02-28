'use client';

import { useState, useEffect } from 'react';
import { FormulaireProduit } from '@/components/FormulaireProduit';
import { serviceProduit } from '@/services/api';
import { Produit } from '@/types';
import { toast } from 'react-hot-toast';

export default function PageModifierProduit({ params }: { params: { id: string } }) {
  const [produit, setProduit] = useState<Produit | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const chargerProduit = async () => {
      try {
        const donnees = await serviceProduit.getParId(params.id);
        setProduit(donnees);
      } catch (error) {
        console.error('Erreur lors du chargement du produit:', error);
        toast.error('Erreur lors du chargement du produit');
      } finally {
        setLoading(false);
      }
    };

    chargerProduit();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-boulangerie-600"></div>
      </div>
    );
  }

  if (!produit) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 text-center">
        <h2 className="text-xl font-medium text-red-600 mb-2">Produit non trouvé</h2>
        <p className="text-gray-600 mb-4">Le produit que vous essayez de modifier n'existe pas.</p>
        <a 
          href="/admin" 
          className="text-boulangerie-600 hover:text-boulangerie-800"
        >
          Retour au tableau de bord
        </a>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-serif">Modifier un Produit</h1>
        <p className="text-gray-600">Modifiez les informations du produit</p>
      </div>
      <FormulaireProduit produitInitial={produit} />
    </div>
  );
}