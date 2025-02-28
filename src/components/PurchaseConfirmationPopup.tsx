'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface PurchaseConfirmationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  customerName?: string;
}

export default function PurchaseConfirmationPopup({ 
  isOpen, 
  onClose,
  customerName = "cher client"
}: PurchaseConfirmationPopupProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimating(false);    
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4">
      <div className={`bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden transition-all duration-300 ${isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
        <div className="relative h-40">
          <Image
            src="https://images.unsplash.com/photo-1586444248902-2f64eddc13df?q=80&w=1000"
            alt="Commande confirmée"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
            <div className="p-4 w-full flex justify-between items-center">
              <h2 className="text-white text-2xl font-serif font-bold">
                Merci pour votre commande !
              </h2>
              <div className="bg-green-500 text-white rounded-full p-1">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <p className="text-gray-700 mb-4">
            Merci, <span className="font-semibold">{customerName}</span>, pour votre confiance ! Votre commande a été confirmée et sera traitée dans les plus brefs délais.
          </p>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-green-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <p className="text-sm text-gray-600">
                  Vous recevrez un email de confirmation avec tous les détails de votre commande. Nous vous contacterons bientôt pour la livraison.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between gap-3">
            <Link
              href="/catalogue"
              className="flex-1 text-center py-2 px-4 border border-boulangerie-600 text-boulangerie-600 rounded-lg hover:bg-boulangerie-50 transition-colors"
            >
              Continuer les achats
            </Link>
            <button
              onClick={handleClose}
              className="flex-1 bg-boulangerie-600 text-white py-2 px-4 rounded-lg hover:bg-boulangerie-700 transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}