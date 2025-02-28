'use client';

import { useEffect, useState } from 'react';
import { ListePanier } from '@/components/ListePanier';
import { FormulaireCommande } from '@/components/FormulaireCommande';
import { usePanier } from '@/context/ContextePanier';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { 
  ShoppingCart, 
  ArrowLeft, 
  Heart, 
  Clock, 
  ShoppingBag, 
  Trash2, 
  ChevronRight, 
  Plus,
  X
} from 'lucide-react';
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
  const [animatedItemId, setAnimatedItemId] = useState<string | null>(null);

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
    setAnimatedItemId(item._id);
    
    setTimeout(() => {
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
      setAnimatedItemId(null);
      
      toast.success(`${item.nom} enregistré pour plus tard`);
    }, 300);
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
    
    toast.success(`${item.nom} ajouté au panier`);
  };

  const clearCart = () => {
    dispatch({ type: 'VIDER_PANIER' });
    setShowClearConfirm(false);
    toast.success('Panier vidé avec succès');
  };

  const clearSavedItems = () => {
    setSavedItems([]);
    localStorage.removeItem('savedItems');
    toast.success('Articles sauvegardés supprimés');
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
        
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="bg-boulangerie-50 rounded-full w-28 h-28 flex items-center justify-center mx-auto mb-8">
            <ShoppingCart className="w-14 h-14 text-boulangerie-500" />
          </div>
          <h2 className="text-2xl font-semibold mb-4">Votre panier est vide</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">Ajoutez des produits de notre délicieuse sélection pour commencer votre commande.</p>
          <Link 
            href="/catalogue" 
            className="bg-boulangerie-600 text-white px-6 py-3 rounded-lg hover:bg-boulangerie-700 transition-colors inline-flex items-center font-medium"
          >
            <ShoppingBag className="mr-2 h-5 w-5" />
            Parcourir nos produits
          </Link>
        </div>
        
        {recentlyViewed.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-semibold text-boulangerie-800 mb-6 flex items-center">
              <Clock className="mr-2 h-5 w-5 text-boulangerie-600" />
              Produits consultés récemment
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {recentlyViewed.map((item, index) => (
                <Link href={`/produits/${item._id}`} key={index} className="bg-white rounded-xl shadow hover:shadow-md transition-all p-4 group">
                  <div className="aspect-square relative mb-3 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.nom} 
                        className="object-cover w-full h-full rounded-lg group-hover:scale-105 transition-transform duration-500" 
                      />
                    ) : (
                      <div className="text-boulangerie-300 text-lg">Image</div>
                    )}
                  </div>
                  <h3 className="font-medium text-gray-800 mb-1 truncate">{item.nom}</h3>
                  <div className="flex justify-between items-center">
                    <p className="text-boulangerie-600 font-semibold">{item.prix.toFixed(2)}€</p>
                    <button className="text-gray-400 hover:text-boulangerie-600 transition-colors p-1 rounded-full hover:bg-boulangerie-50">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
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
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h1 className="text-3xl font-serif font-bold text-boulangerie-800">Votre Panier</h1>
        <div className="flex items-center gap-4">
          {etat.articles.length > 0 && (
            <button 
              onClick={() => setShowClearConfirm(true)}
              className="text-gray-500 hover:text-red-600 transition-colors border border-gray-200 hover:border-red-200 rounded-lg px-4 py-2 flex items-center"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Vider le panier</span>
            </button>
          )}
          <Link 
            href="/catalogue" 
            className="text-boulangerie-600 hover:text-boulangerie-700 border border-boulangerie-200 hover:border-boulangerie-300 rounded-lg px-4 py-2 flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continuer vos achats
          </Link>
        </div>
      </div>
      
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">Vider le panier ?</h3>
              <button 
                onClick={() => setShowClearConfirm(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">Êtes-vous sûr de vouloir supprimer tous les articles de votre panier ?</p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button 
                onClick={clearCart}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Vider le panier
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-boulangerie-50 rounded-xl px-6 py-3 mb-8 hidden md:flex items-center justify-between">
        <div className="flex items-center">
          <ShoppingCart className="h-5 w-5 text-boulangerie-600 mr-2" />
          <span className="text-boulangerie-800 font-medium">Total: {etat.articles.reduce((total, item) => total + item.quantite, 0)} articles</span>
        </div>
        <span className="text-boulangerie-800 font-semibold">{etat.total.toFixed(2)}€</span>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {etat.articles.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
              <div className="p-4 bg-gradient-to-r from-boulangerie-600 to-boulangerie-500 text-white flex justify-between items-center">
                <h2 className="font-medium text-lg flex items-center">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Articles dans votre panier ({etat.articles.reduce((acc, item) => acc + item.quantite, 0)})
                </h2>
                <div className="text-sm">
                  Total: <span className="font-semibold">{etat.total.toFixed(2)}€</span>
                </div>
              </div>
              <ListePanier onSaveForLater={moveToSaved} />
            </div>
          )}
          
          {savedItems.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-4 bg-gradient-to-r from-boulangerie-100 to-white border-b border-boulangerie-200 flex justify-between items-center">
                <h2 className="font-medium text-lg flex items-center text-boulangerie-800">
                  <Heart className="h-5 w-5 mr-2 text-boulangerie-500" />
                  Enregistré pour plus tard ({savedItems.length})
                </h2>
                <button 
                  onClick={clearSavedItems}
                  className="text-sm text-gray-500 hover:text-red-600 transition-colors flex items-center"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Tout supprimer
                </button>
              </div>
              <ul className="divide-y divide-gray-100">
                {savedItems.map((item, index) => (
                  <li key={index} className="p-4 hover:bg-gray-50 transition-colors flex items-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg mr-4 flex-shrink-0 overflow-hidden">
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.nom} 
                          className="object-cover w-full h-full rounded-lg" 
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
                      className="bg-boulangerie-50 text-boulangerie-600 hover:bg-boulangerie-100 transition-colors px-4 py-2 rounded-lg text-sm font-medium flex items-center"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Ajouter
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