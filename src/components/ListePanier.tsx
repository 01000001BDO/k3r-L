'use client';

import { usePanier } from '@/context/ContextePanier';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ShoppingBag, Trash2, Heart, MinusCircle, PlusCircle, AlertCircle, Info } from 'lucide-react';
import { ArticlePanier } from '@/types';

interface ListePanierProps {
  onSaveForLater?: (article: ArticlePanier) => void;
}

export const ListePanier: React.FC<ListePanierProps> = ({ onSaveForLater }) => {
  const { etat, dispatch } = usePanier();
  const [animatedItemId, setAnimatedItemId] = useState<string | null>(null);
  const [showQuantityAlert, setShowQuantityAlert] = useState<boolean>(false);

  const modifierQuantite = (id: string, quantite: number, maxStock?: number) => {
    if (quantite < 1) return;    
    if (maxStock !== undefined && quantite > maxStock) {
      setShowQuantityAlert(true);
      setTimeout(() => setShowQuantityAlert(false), 3000);
      return;
    }
    
    dispatch({ type: 'MODIFIER_QUANTITE', payload: { id, quantite } });
  };

  const supprimerArticle = (id: string) => {
    setAnimatedItemId(id);    
    setTimeout(() => {
      dispatch({ type: 'SUPPRIMER_ARTICLE', payload: { id } });
      setAnimatedItemId(null);
    }, 300);
  };

  if (etat.articles.length === 0) {
    return null;
  }

  const totalItems = etat.articles.reduce((total, item) => total + item.quantite, 0);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-serif font-semibold mb-4 flex items-center">
          <ShoppingBag className="w-5 h-5 mr-2 text-boulangerie-600" />
          Articles ({totalItems})
        </h2>
        
        {showQuantityAlert && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md flex items-center text-amber-800">
            <AlertCircle className="w-5 h-5 mr-2 text-amber-500" />
            <span className="text-sm">Quantité limitée en stock</span>
          </div>
        )}

        <div className="divide-y">
          {etat.articles.map((article) => {
            const isEnPromotion = article.enPromotion && article.prixPromotion !== undefined;
            const prixAffiche = isEnPromotion && article.prixPromotion !== undefined ? article.prixPromotion : article.prix;
            const sousTotal = prixAffiche * article.quantite;
            
            return (
              <div 
                key={article._id} 
                className={`py-4 flex flex-col sm:flex-row sm:items-center transition-all duration-300 ${
                  animatedItemId === article._id ? 'opacity-0 transform -translate-x-full' : 'opacity-100'
                }`}
              >
                <div className="flex-shrink-0 mb-3 sm:mb-0">
                  <div className="relative w-20 h-20 bg-gray-100 rounded overflow-hidden">
                    {article.image ? (
                      <Image
                        src={article.image}
                        alt={article.nom}
                        fill
                        sizes="80px"
                        className="object-cover rounded"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <ShoppingBag className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                </div>
               
                <div className="sm:ml-4 flex-grow">
                  <Link
                    href={`/produits/${article._id}`}
                    className="font-medium text-boulangerie-800 hover:text-boulangerie-600 inline-block mb-1"
                  >
                    {article.nom}
                  </Link>
                  
                  {article.categorie && (
                    <p className="text-sm text-gray-500 mb-1">Catégorie: {article.categorie}</p>
                  )}
                  
                  <div className="flex items-center mb-2">
                    {isEnPromotion && article.prixPromotion !== undefined ? (
                      <>
                        <span className="text-boulangerie-600 font-semibold">{article.prixPromotion.toFixed(2)}€</span>
                        <span className="text-gray-500 line-through text-sm ml-2">{article.prix.toFixed(2)}€</span>
                        <span className="bg-boulangerie-100 text-boulangerie-800 text-xs px-2 py-1 rounded ml-2">
                          Économie: {((article.prix - article.prixPromotion) * article.quantite).toFixed(2)}€
                        </span>
                      </>
                    ) : (
                      <span className="text-boulangerie-600 font-semibold">{article.prix.toFixed(2)}€</span>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center border border-gray-200 rounded-full overflow-hidden bg-white">
                      <button
                        onClick={() => modifierQuantite(article._id, article.quantite - 1)}
                        className="p-1 text-gray-500 hover:text-boulangerie-600 hover:bg-gray-50 transition-colors focus:outline-none"
                        aria-label="Diminuer la quantité"
                      >
                        <MinusCircle className="w-5 h-5" />
                      </button>
                      <span className="px-3 py-1 min-w-8 text-center">{article.quantite}</span>
                      <button
                        onClick={() => modifierQuantite(article._id, article.quantite + 1)}
                        className="p-1 text-gray-500 hover:text-boulangerie-600 hover:bg-gray-50 transition-colors focus:outline-none"
                        aria-label="Augmenter la quantité"
                      >
                        <PlusCircle className="w-5 h-5" />
                      </button>
                    </div>
                   
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => supprimerArticle(article._id)}
                        className="text-gray-400 hover:text-red-600 transition-colors p-1 hover:bg-gray-50 rounded-full"
                        aria-label="Supprimer l'article"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      
                      {onSaveForLater && (
                        <button
                          onClick={() => onSaveForLater(article)}
                          className="text-gray-400 hover:text-boulangerie-600 transition-colors p-1 hover:bg-gray-50 rounded-full"
                          aria-label="Enregistrer pour plus tard"
                        >
                          <Heart className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
               
                <div className="mt-3 sm:mt-0 sm:ml-4 text-right">
                  <div className="font-semibold text-boulangerie-800">{sousTotal.toFixed(2)}€</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
     
      <div className="bg-gray-50 p-6">
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Sous-total</span>
          <span className="font-medium">{etat.sousTotal?.toFixed(2) || etat.total.toFixed(2)}€</span>
        </div>
        
        {etat.reduction && etat.reduction > 0 && (
          <div className="flex justify-between mb-2 text-green-600">
            <span>Réduction</span>
            <span>-{etat.reduction.toFixed(2)}€</span>
          </div>
        )}
        
        <div className="flex justify-between mb-2">
          <span className="text-gray-600 flex items-center">
            Livraison
            <span className="ml-1 text-gray-400 cursor-help">
              <Info className="w-4 h-4" aria-label="Livraison gratuite pour les commandes supérieures à 30€" />
            </span>
          </span>
          {etat.fraisLivraison && etat.fraisLivraison > 0 ? (
            <span className="font-medium">{etat.fraisLivraison.toFixed(2)}€</span>
          ) : (
            <span className="font-medium text-green-600">Gratuite</span>
          )}
        </div>
        
        {etat.fraisLivraison && etat.fraisLivraison > 0 && etat.sousTotal && (
          <div className="mt-2 mb-3 text-sm text-gray-500">
            Plus que <span className="font-semibold text-boulangerie-600">{(30 - etat.sousTotal).toFixed(2)}€</span> d'achats pour bénéficier de la livraison gratuite
            <div className="mt-1 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-boulangerie-500" 
                style={{ width: `${Math.min(100, (etat.sousTotal / 30) * 100)}%` }}
              ></div>
            </div>
          </div>
        )}
        
        <div className="border-t pt-3 mt-3">
          <div className="flex justify-between">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-lg font-bold text-boulangerie-700">{etat.total.toFixed(2)}€</span>
          </div>
          {etat.reduction && etat.reduction > 0 && (
            <div className="text-green-600 text-sm text-right mt-1">
              Vous économisez: {etat.reduction.toFixed(2)}€
            </div>
          )}
        </div>
      </div>
    </div>
  );
};