'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function WelcomePopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeenPopup = sessionStorage.getItem('hasSeenWelcomePopup');
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem('hasSeenWelcomePopup', 'true');
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const closePopup = () => {
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden animate-fadeIn">
        <div className="relative h-40">
          <Image
            src="https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1000"
            alt="Boulangerie artisanale"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
            <h2 className="text-white text-2xl font-serif font-bold p-4">
              Bienvenue à notre Boulangerie Artisanale
            </h2>
          </div>
        </div>
        
        <div className="p-6">
          <p className="text-gray-700 mb-4">
            Découvrez nos produits artisanaux, fabriqués chaque jour avec passion et des ingrédients soigneusement sélectionnés.
          </p>
          
          <div className="flex flex-col space-y-3">
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-5 h-5 text-boulangerie-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>Livraison gratuite pour les commandes de plus de 25€</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-5 h-5 text-boulangerie-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>Produits frais, cuisinés chaque jour</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-5 h-5 text-boulangerie-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>10% de réduction sur votre première commande</span>
            </div>
          </div>
          
          <button
            onClick={closePopup}
            className="mt-6 w-full bg-boulangerie-600 text-white py-2 px-4 rounded-lg hover:bg-boulangerie-700 transition-colors"
          >
            Découvrir nos produits
          </button>
        </div>
      </div>
    </div>
  );
}