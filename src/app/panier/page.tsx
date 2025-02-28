'use client';

import { useEffect, useState } from 'react';
import { ListePanier } from '@/components/ListePanier';
import { FormulaireCommande } from '@/components/FormulaireCommande';
import { usePanier } from '@/context/ContextePanier';
import Link from 'next/link';
import { ShoppingCart, ArrowLeft, Heart, Clock, ShoppingBag, Trash2 } from 'lucide-react';
import { ArticlePanier, Produit } from '@/types';
import React from 'react';

interface SavedItem {
  _id: string;
  nom: string;
  image?: string;
  prix: number;
  categorie?: string;
}

const PagePanier: React.FC = () => {
  const { etat, dispatch } = usePanier();
  const [recentlyViewed, setRecentlyViewed] = useState<SavedItem[]>([]);
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    try {
      const viewed = localStorage.getItem('recentlyViewed');
      if (viewed) {
        const parsedViewed = JSON.parse(viewed);
        if (Array.isArray(parsedViewed)) {
          setRecentlyViewed(parsedViewed.slice(0, 4));
        }
      }

      const saved = localStorage.getItem('savedItems');
      if (saved) {
        const parsedSaved = JSON.parse(saved);
        if (Array.isArray(parsedSaved)) {
          setSavedItems(parsedSaved);
        }
      }
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
    }
  }, []);

  const moveToSaved = (item: ArticlePanier) => {
    const updatedSavedItems: SavedItem[] = [...savedItems, {
      _id: item._id,
      nom: item.nom,
      image: item.image,
      prix: item.prix,
      categorie: item.categorie
    }];
    
    localStorage.setItem('savedItems', JSON.stringify(updatedSavedItems));
    setSavedItems(updatedSavedItems);
    
    dispatch({ type: 'SUPPRIMER_ARTICLE', payload: { id: item._id } });
  };

  const moveToCart = (item: SavedItem, index: number) => {
    const produit: Produit = {
      _id: item._id,
      nom: item.nom,
      image: item.image || '',
      images: [],
      prix: item.prix,
      description: '',
      ingredients: [],
      categorie: item.categorie || '',
      enPromotion: false,
      enVedette: false,
      disponible: true,
      dateDeMiseAJour: new Date()
    };
    
    dispatch({ 
      type: 'AJOUTER_ARTICLE', 
      payload: produit
    });
    
    const updatedSavedItems: SavedItem[] = [...savedItems];
    updatedSavedItems.splice(index, 1);
    localStorage.setItem('savedItems', JSON.stringify(updatedSavedItems));
    setSavedItems(updatedSavedItems);
  };

  const clearCart = () => {
    dispatch({ type: 'VIDER_PANIER' });
    setShowClearConfirm(false);
  };

  const clearSavedItems = () => {
    setSavedItems([]);
    localStorage.removeItem('savedItems');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 pt-24 pb-16 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center py-4 border-b border-gray-200">
                  <div className="h-16 w-16 bg-gray-200 rounded-md mr-4"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 h-64"></div>
          </div>
        </div>
      </div>
    );
  }

  if (etat.articles.length === 0 && savedItems.length === 0) {
    return (
      <div className="container mx-auto px-4 pt-24 pb-16">
        <h1 className="text-3xl font-serif font-bold text-boulangerie-800 mb-6">Votre Panier</h1>
        
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-12 h-12 text-boulangerie-400" />
          </div>
          <h2 className="text-2xl font-semibold mb-4">Votre panier est vide</h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">Ajoutez des produits de notre délicieuse sélection pour commencer votre commande.</p>
          <Link href="/catalogue" className="bg-boulangerie-600 text-white px-6 py-3 rounded-lg hover:bg-boulangerie-700 transition-colors inline-flex items-center">
            <ShoppingBag className="mr-2 h-5 w-5" />
            Parcourir nos produits
          </Link>
        </div>
        
        {recentlyViewed.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-semibold text-boulangerie-800 mb-4 flex items-center">
              <Clock className="mr-2 h-5 w-5 text-boulangerie-600" />
              Produits consultés récemment
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {recentlyViewed.map((item, index) => (
                <Link href={`/produit/${item._id}`} key={index} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 group">
                  <div className="aspect-square relative mb-3 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.nom} 
                        className="object-cover w-full h-full rounded-md group-hover:scale-105 transition-transform duration-300" 
                      />
                    ) : (
                      <div className="text-boulangerie-300 text-lg">Image</div>
                    )}
                  </div>
                  <h3 className="font-medium text-gray-800 mb-1 truncate">{item.nom}</h3>
                  <p className="text-boulangerie-600 font-semibold">{item.prix.toFixed(2)}€</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-24 pb-16">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-serif font-bold text-boulangerie-800">Votre Panier</h1>
        <div className="flex items-center space-x-4">
          {etat.articles.length > 0 && (
            <button 
              onClick={() => setShowClearConfirm(true)}
              className="text-gray-500 hover:text-red-600 text-sm transition-colors"
            >
              <span className="hidden sm:inline">Vider le panier</span>
              <Trash2 className="w-4 h-4 inline sm:ml-1" />
            </button>
          )}
          <Link href="/catalogue" className="text-boulangerie-600 hover:text-boulangerie-700 inline-flex items-center">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Continuer vos achats
          </Link>
        </div>
      </div>
      
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-3">Vider le panier ?</h3>
            <p className="text-gray-600 mb-6">Êtes-vous sûr de vouloir supprimer tous les articles de votre panier ?</p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button 
                onClick={clearCart}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Vider le panier
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="mb-6 hidden md:block">
        <div className="w-full max-w-3xl mx-auto">
          <div className="flex items-center">
            <div className="flex-grow flex items-center">
              <div className="w-10 h-10 rounded-full bg-boulangerie-600 text-white flex items-center justify-center">
                1
              </div>
              <div className="flex-grow h-1 mx-3 bg-boulangerie-600"></div>
            </div>
            <div className="flex-grow flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center">
                2
              </div>
              <div className="flex-grow h-1 mx-3 bg-gray-300"></div>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center">
                3
              </div>
            </div>
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <div className="w-1/3 text-center text-boulangerie-600 font-medium">Panier</div>
            <div className="w-1/3 text-center">Informations</div>
            <div className="w-1/3 text-center">Confirmation</div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {etat.articles.length > 0 && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                <h2 className="font-medium text-lg">Articles dans votre panier ({etat.articles.reduce((acc, item) => acc + item.quantite, 0)})</h2>
                <div className="text-sm text-gray-500">
                  Prix total: <span className="font-semibold text-boulangerie-600">{etat.total.toFixed(2)}€</span>
                </div>
              </div>
              <ListePanier onSaveForLater={moveToSaved} />
            </div>
          )}
          
          {savedItems.length > 0 && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                <h2 className="font-medium text-lg flex items-center">
                  <Heart className="h-5 w-5 mr-2 text-boulangerie-500" />
                  Enregistré pour plus tard ({savedItems.length})
                </h2>
                <button 
                  onClick={clearSavedItems}
                  className="text-sm text-gray-500 hover:text-red-600"
                >
                  Tout supprimer
                </button>
              </div>
              <ul className="divide-y divide-gray-100">
                {savedItems.map((item, index) => (
                  <li key={index} className="p-4 hover:bg-gray-50 transition-colors flex items-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-md mr-4 flex-shrink-0 overflow-hidden">
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.nom} 
                          className="object-cover w-full h-full rounded-md" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <ShoppingBag className="h-6 w-6" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.nom}</h3>
                      {item.categorie && (
                        <p className="text-sm text-gray-500">{item.categorie}</p>
                      )}
                      <p className="text-boulangerie-600 font-semibold">{item.prix.toFixed(2)}€</p>
                    </div>
                    <button 
                      onClick={() => moveToCart(item, index)}
                      className="bg-boulangerie-100 hover:bg-boulangerie-200 text-boulangerie-800 px-3 py-1 rounded text-sm"
                    >
                      Ajouter au panier
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <div className="lg:sticky lg:top-24 self-start">
          {etat.articles.length > 0 && <FormulaireCommande />}
        </div>
      </div>
    </div>
  );
};

export default PagePanier;