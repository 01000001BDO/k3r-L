'use client';

import { Produit } from '@/types';
import { usePanier } from '@/context/ContextePanier';
import { toast } from 'react-hot-toast';
import { useState } from 'react';

interface BoutonAjoutPanierProps {
  produit: Produit;
  quantite?: number;
}

export const BoutonAjoutPanier = ({ produit, quantite: propQuantite }: BoutonAjoutPanierProps) => {
  const { dispatch } = usePanier();
  const [quantiteInterne, setQuantiteInterne] = useState(1);

  const quantite = propQuantite !== undefined ? propQuantite : quantiteInterne;

  const ajouterAuPanier = () => {
    if (!produit.disponible) {
      toast.error('Ce produit n\'est pas disponible actuellement');
      return;
    }
    
    for (let i = 0; i < quantite; i++) {
      dispatch({ type: 'AJOUTER_ARTICLE', payload: produit });
    }
   
    const message = quantite > 1
      ? `${quantite} ${produit.nom} ajoutés au panier`
      : `${produit.nom} ajouté au panier`;
     
    toast.success(message, {
      duration: 3000,
      icon: '🧺',
    });
  };

  const augmenterQuantite = () => {
    if (propQuantite === undefined) {
      setQuantiteInterne(prev => prev + 1);
    }
  };

  const diminuerQuantite = () => {
    if (propQuantite === undefined && quantiteInterne > 1) {
      setQuantiteInterne(prev => prev - 1);
    }
  };

  return (
    <div>
      {propQuantite === undefined && (
        <div className="flex items-center mb-4">
          <span className="text-gray-700 mr-4">Quantité</span>
          <div className="flex items-center border border-gray-300 rounded">
            <button
              onClick={diminuerQuantite}
              className="px-3 py-1 text-boulangerie-600 hover:bg-boulangerie-100 transition-colors"
              aria-label="Diminuer la quantité"
            >
              -
            </button>
            <span className="px-4 py-1 border-x border-gray-300">{quantiteInterne}</span>
            <button
              onClick={augmenterQuantite}
              className="px-3 py-1 text-boulangerie-600 hover:bg-boulangerie-100 transition-colors"
              aria-label="Augmenter la quantité"
            >
              +
            </button>
          </div>
        </div>
      )}
     
      <button
        onClick={ajouterAuPanier}
        disabled={!produit.disponible}
        className="w-full bg-boulangerie-600 hover:bg-boulangerie-700 text-white py-3 px-6 rounded-lg transition-all hover:shadow-md flex items-center justify-center disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
        </svg>
        Ajouter au panier
      </button>
     
      {produit.enPromotion && produit.prixPromotion && (
        <div className="mt-3 text-center text-sm text-red-600 font-medium">
          Économisez {(produit.prix - produit.prixPromotion).toFixed(2)}€ par article !
        </div>
      )}
    </div>
  );
};