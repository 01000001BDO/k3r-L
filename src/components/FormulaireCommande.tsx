'use client';

import { useState } from 'react';
import { usePanier } from '@/context/ContextePanier';
import { serviceCommande } from '@/services/api';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import PurchaseConfirmationPopup from './PurchaseConfirmationPopup';

export const FormulaireCommande = () => {
  const router = useRouter();
  const { etat, dispatch } = usePanier();
  const [loading, setLoading] = useState(false);
  const [infoClient, setInfoClient] = useState({
    nom: '',
    telephone: '',
    adresse: ''
  });
  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (etat.articles.length === 0) {
      toast.error('Votre panier est vide');
      return;
    }

    try {
      setLoading(true);
      await serviceCommande.creer({
        produits: etat.articles,
        prixTotal: etat.total,
        infoClient
      });
      setShowPopup(true);      
      dispatch({ type: 'VIDER_PANIER' });      
    } catch (error) {
      toast.error('Erreur lors de la commande');
      setLoading(false);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    router.push('/confirmation');
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-serif font-semibold mb-4">Informations de livraison</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom complet
            </label>
            <input
              type="text"
              required
              value={infoClient.nom}
              onChange={(e) => setInfoClient({ ...infoClient, nom: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-boulangerie-500 focus:border-transparent"
              placeholder="Votre nom et prénom"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Téléphone
            </label>
            <input
              type="tel"
              required
              value={infoClient.telephone}
              onChange={(e) => setInfoClient({ ...infoClient, telephone: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-boulangerie-500 focus:border-transparent"
              placeholder="Votre numéro de téléphone"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Adresse de livraison
            </label>
            <textarea
              required
              value={infoClient.adresse}
              onChange={(e) => setInfoClient({ ...infoClient, adresse: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-boulangerie-500 focus:border-transparent"
              rows={3}
              placeholder="Votre adresse complète"
            />
          </div>
          <button
            type="submit"
            disabled={loading || etat.articles.length === 0}
            className="w-full bg-boulangerie-600 text-white py-3 rounded-lg hover:bg-boulangerie-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Traitement...
              </>
            ) : (
              'Passer la commande'
            )}
          </button>
        </div>
      </form>

      <PurchaseConfirmationPopup 
        isOpen={showPopup} 
        onClose={handleClosePopup}
        customerName={infoClient.nom}
      />
    </>
  );
};