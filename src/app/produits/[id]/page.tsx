'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { BoutonAjoutPanier } from '@/components/BoutonAjoutPanier';
import Link from 'next/link';
import { serviceProduit } from '@/services/api';
import { Produit } from '@/types';
import { toast } from 'react-hot-toast';

export default function PageProduit({ params }: { params: Promise<{ id: string }> }) {
  const [produit, setProduit] = useState<Produit | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageActive, setImageActive] = useState<string>('');
  const [quantite, setQuantite] = useState(1);
  const [zoomActive, setZoomActive] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  const unwrappedParams = React.use(params);

  useEffect(() => {
    const chargerProduit = async () => {
      try {
        const donnees = await serviceProduit.getParId(unwrappedParams.id);
        setProduit(donnees);
        if (donnees.images && donnees.images.length > 0) {
          setImageActive(donnees.images[0]);
        } else {
          setImageActive(donnees.image);
        }
      } catch (error) {
        console.error('Erreur lors du chargement du produit:', error);
        toast.error('Erreur lors du chargement du produit');
      } finally {
        setLoading(false);
      }
    };

    chargerProduit();
  }, [unwrappedParams.id]);

  const handleZoom = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!zoomActive) return;
    
    const element = e.currentTarget;
    const { left, top, width, height } = element.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    
    setZoomPosition({ x, y });
  };

  const incrementQuantite = () => {
    setQuantite(prev => prev + 1);
  };

  const decrementQuantite = () => {
    setQuantite(prev => (prev > 1 ? prev - 1 : 1));
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 pt-24 pb-16 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-boulangerie-600"></div>
      </div>
    );
  }

  if (!produit) {
    return (
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Produit non trouvé</h1>
          <p className="text-gray-600 mb-6">Le produit que vous recherchez n'existe pas ou a été supprimé.</p>
          <Link href="/catalogue" className="bg-boulangerie-500 text-white px-6 py-2 rounded-lg hover:bg-boulangerie-600 transition-colors">
            Retour au catalogue
          </Link>
        </div>
      </div>
    );
  }

  const prixAffiche = produit.enPromotion && produit.prixPromotion 
    ? produit.prixPromotion 
    : produit.prix;
  
  const pourcentageReduction = produit.enPromotion && produit.prixPromotion
    ? Math.round((1 - produit.prixPromotion / produit.prix) * 100)
    : 0;

  return (
    <div className="container mx-auto px-4 pt-24 pb-16">
      <div className="mb-6 flex items-center text-sm">
        <Link href="/" className="text-gray-500 hover:text-boulangerie-600 transition-colors">Accueil</Link>
        <span className="mx-2 text-gray-400">/</span>
        <Link href="/catalogue" className="text-gray-500 hover:text-boulangerie-600 transition-colors">Catalogue</Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-boulangerie-600 font-medium">{produit.nom}</span>
      </div>

      <div className="bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-6">
          <div className="flex flex-col">
            <div 
              className="relative h-96 md:h-[500px] overflow-hidden cursor-zoom-in"
              onMouseEnter={() => setZoomActive(true)}
              onMouseLeave={() => setZoomActive(false)}
              onMouseMove={handleZoom}
            >
              <Image
                src={imageActive}
                alt={produit.nom}
                fill
                className={`object-cover transition-transform duration-200 ${
                  zoomActive ? 'scale-150' : 'scale-100'
                }`}
                style={
                  zoomActive ? {
                    transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
                  } : {}
                }
              />              
              <div className="absolute top-4 left-4 bg-white bg-opacity-90 text-boulangerie-800 px-3 py-1 rounded-full text-sm font-medium">
                {produit.categorie}
              </div>
              
              {produit.enPromotion && produit.prixPromotion && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                  -{pourcentageReduction}%
                </div>
              )}
            </div>            
            {produit.images && produit.images.length > 1 && (
              <div className="flex p-4 gap-2 overflow-x-auto">
                {produit.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setImageActive(img)}
                    className={`relative w-20 h-20 border-2 rounded-md overflow-hidden flex-shrink-0 transition-all ${
                      imageActive === img 
                        ? 'border-boulangerie-500 shadow-md' 
                        : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${produit.nom} - vue ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <h1 className="text-3xl font-serif font-bold text-boulangerie-800">{produit.nom}</h1>
              
              {produit.enVedette && (
                <span className="bg-yellow-100 text-yellow-800 text-sm px-3 py-1 rounded-full flex items-center mt-2 md:mt-0">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  Produit Vedette
                </span>
              )}
            </div>
            
            <div className="mb-6">
              {produit.enPromotion && produit.prixPromotion ? (
                <div className="flex items-center">
                  <span className="text-3xl font-semibold text-red-600 mr-3">
                    {prixAffiche.toFixed(2)}€
                  </span>
                  <span className="text-lg text-gray-500 line-through">
                    {produit.prix.toFixed(2)}€
                  </span>
                </div>
              ) : (
                <span className="text-3xl font-semibold text-boulangerie-600">
                  {prixAffiche.toFixed(2)}€
                </span>
              )}

              <div className="mt-2">
                {produit.disponible ? (
                  <span className="inline-flex items-center text-green-600 text-sm font-medium">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    Préparé du jour • En stock
                  </span>
                ) : (
                  <span className="inline-flex items-center text-red-600 text-sm font-medium">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                    </svg>
                    Victime de son succès • Temporairement indisponible
                  </span>
                )}
              </div>
            </div>
            
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-gray-700 leading-relaxed">{produit.description}</p>
            </div>  
                      
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-2">Ingrédients</h2>
              <div className="flex flex-wrap gap-2">
                {produit.ingredients.map((ingredient, index) => (
                  <span key={index} className="bg-boulangerie-100 text-boulangerie-700 px-3 py-1 rounded-full text-sm">
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>

            {produit.disponible ? (
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="mr-4">
                    <span className="text-gray-700 mr-2">Quantité</span>
                  </div>
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                    <button 
                      onClick={decrementQuantite}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors flex-shrink-0"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={quantite}
                      onChange={(e) => setQuantite(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-12 text-center border-none focus:outline-none focus:ring-0"
                    />
                    <button 
                      onClick={incrementQuantite}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors flex-shrink-0"
                    >
                      +
                    </button>
                  </div>
                </div>

                <BoutonAjoutPanier produit={produit} quantite={quantite} />
              </div>
            ) : (
              <div>
                <button
                  disabled
                  className="w-full bg-gray-300 text-gray-500 py-3 px-6 rounded-lg cursor-not-allowed"
                >
                  Produit indisponible
                </button>
                
                <div className="mt-4 bg-blue-50 border border-blue-100 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    Ce produit est très demandé ! Vous pouvez être notifié de sa disponibilité par email.
                  </p>
                  <div className="mt-2 flex">
                    <input type="email" placeholder="Votre email" className="border border-blue-200 rounded-l-lg px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 flex-1" />
                    <button className="bg-blue-600 text-white rounded-r-lg px-3 py-1 text-sm hover:bg-blue-700 transition-colors">
                      M'alerter
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center text-gray-600 text-sm">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                Livraison possible
              </div>
              <div className="flex items-center text-gray-600 text-sm">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
                Paiement sécurisé
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}