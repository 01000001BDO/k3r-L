'use client';

import { usePanier } from '@/context/ContextePanier';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { 
  ShoppingBag, 
  Trash2, 
  MinusCircle, 
  PlusCircle, 
  AlertCircle, 
  Info,
  Tag,
  Check
} from 'lucide-react';


export const ListePanier: React.FC = () => {
  const { etat, dispatch } = usePanier();
  const [animatedItemId, setAnimatedItemId] = useState<string | null>(null);
  const [showQuantityAlert, setShowQuantityAlert] = useState<boolean>(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

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

  return (
    <div className="overflow-hidden">
      <div className="p-6">
        {showQuantityAlert && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center text-amber-800 animate-pulse">
            <AlertCircle className="w-5 h-5 mr-2 text-amber-500 flex-shrink-0" />
            <span className="text-sm">Quantité limitée en stock</span>
          </div>
        )}

        {showSuccessMessage && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center text-green-800 animate-pulse">
            <Check className="w-5 h-5 mr-2 text-green-500 flex-shrink-0" />
            <span className="text-sm">{successMessage}</span>
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
                className={`py-4 transition-all duration-300 ${
                  animatedItemId === article._id ? 'opacity-0 transform -translate-x-full' : 'opacity-100'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 shadow-sm">
                    {article.image ? (
                      <Image
                        src={article.image}
                        alt={article.nom}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <ShoppingBag className="w-8 h-8" />
                      </div>
                    )}
                    {isEnPromotion && (
                      <div className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1.5 py-0.5 font-medium">
                        <Tag className="w-3 h-3 inline mr-0.5" />
                        Promo
                      </div>
                    )}
                  </div>                  
                  <div className="flex-grow">
                    <div className="flex flex-col sm:flex-row justify-between mb-1">
                      <div>
                        <Link
                          href={`/produits/${article._id}`}
                          className="font-medium text-gray-800 hover:text-boulangerie-600 transition-colors text-lg"
                        >
                          {article.nom}
                        </Link>
                        
                        {article.categorie && (
                          <p className="text-sm text-gray-500">{article.categorie}</p>
                        )}
                      </div>
                      <div className="text-lg font-semibold text-boulangerie-700 sm:text-right mt-1 sm:mt-0">
                        {sousTotal.toFixed(2)}€
                      </div>
                    </div>
                    
                    <div className="flex items-center mt-2 mb-3">
                      {isEnPromotion && article.prixPromotion !== undefined ? (
                        <>
                          <span className="text-boulangerie-600 font-semibold">{article.prixPromotion.toFixed(2)}€</span>
                          <span className="text-gray-500 line-through text-sm ml-2">{article.prix.toFixed(2)}€</span>
                          <span className="bg-boulangerie-50 text-boulangerie-800 text-xs px-2 py-1 rounded-full ml-2">
                            Économie: {((article.prix - article.prixPromotion) * article.quantite).toFixed(2)}€
                          </span>
                        </>
                      ) : (
                        <span className="text-gray-600 font-medium">{article.prix.toFixed(2)}€</span>
                      )}
                    </div>                    
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center bg-gray-100 rounded-full overflow-hidden">
                        <button
                          onClick={() => modifierQuantite(article._id, article.quantite - 1)}
                          className="p-2 text-gray-500 hover:text-boulangerie-600 hover:bg-gray-200 transition-colors focus:outline-none"
                          aria-label="Diminuer la quantité"
                        >
                          <MinusCircle className="w-5 h-5" />
                        </button>
                        <span className="px-3 py-1 min-w-8 text-center font-medium">{article.quantite}</span>
                        <button
                          onClick={() => modifierQuantite(article._id, article.quantite + 1)}
                          className="p-2 text-gray-500 hover:text-boulangerie-600 hover:bg-gray-200 transition-colors focus:outline-none"
                          aria-label="Augmenter la quantité"
                        >
                          <PlusCircle className="w-5 h-5" />
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => supprimerArticle(article._id)}
                          className="flex items-center text-gray-500 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-lg"
                          aria-label="Supprimer l'article"
                        >
                          <Trash2 className="w-5 h-5 mr-1" />
                          <span className="text-sm hidden sm:inline">Supprimer</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
     
      <div className="bg-gray-50 p-6 rounded-b-lg">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Sous-total</span>
            <span className="font-medium">
              {typeof etat.sousTotal === 'number' 
                ? etat.sousTotal.toFixed(2) 
                : etat.total.toFixed(2)}€
            </span>
          </div>
          
          {etat.reduction && etat.reduction > 0 && (
            <div className="flex justify-between items-center text-green-600">
              <span className="flex items-center">
                <Tag className="w-4 h-4 mr-1" />
                Réduction
              </span>
              <span>-{etat.reduction.toFixed(2)}€</span>
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <div className="flex items-center text-gray-600 group relative">
              Livraison
              <div className="ml-1 text-gray-400 cursor-help">
                <Info className="w-4 h-4" />
                <div className="absolute left-0 bottom-6 hidden group-hover:block bg-black text-white text-xs p-2 rounded pointer-events-none whitespace-nowrap">
                  Livraison gratuite pour les commandes supérieures à 30€
                </div>
              </div>
            </div>
            {etat.fraisLivraison > 0 ? (
              <span className="font-medium">{etat.fraisLivraison.toFixed(2)}€</span>
            ) : (
              <span className="font-medium text-green-600">Gratuite</span>
            )}
          </div>
        </div>
        
        {etat.fraisLivraison > 0 && etat.sousTotal && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
            <p className="text-sm text-blue-800 mb-2">
              Plus que <span className="font-semibold">{(30 - etat.sousTotal).toFixed(2)}€</span> d'achats pour bénéficier de la livraison gratuite
            </p>
            <div className="w-full h-2 bg-blue-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-500" 
                style={{ width: `${Math.min(100, (etat.sousTotal / 30) * 100)}%` }}
              ></div>
            </div>
          </div>
        )}
        
        <div className="border-t border-gray-200 pt-4 mt-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-xl font-bold text-boulangerie-700">{etat.total.toFixed(2)}€</span>
          </div>
          {etat.reduction > 0 && (
            <div className="text-green-600 text-sm text-right mt-1 flex items-center justify-end">
              <Check className="w-4 h-4 mr-1" />
              Vous économisez: {etat.reduction.toFixed(2)}€
            </div>
          )}
        </div>
      </div>
    </div>
  );
};