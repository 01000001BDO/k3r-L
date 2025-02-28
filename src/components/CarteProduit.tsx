import { Produit } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

interface CarteProduitProps {
  produit: Produit;
}

export const CarteProduit = ({ produit }: CarteProduitProps) => {
  const [imageActuelle, setImageActuelle] = useState<string>(produit.image);  
  const [hovered, setHovered] = useState(false);

  const aPlusieursImages = produit.images && produit.images.length > 1;
  const prixAffiche = produit.enPromotion && produit.prixPromotion ? produit.prixPromotion : produit.prix;  
  const pourcentageReduction = produit.enPromotion && produit.prixPromotion ? Math.round((1 - produit.prixPromotion / produit.prix) * 100) : 0;
  
  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative h-56">
        <Image
          src={imageActuelle}
          alt={produit.nom}
          fill
          className={`object-cover transition-transform duration-500 ${hovered ? 'scale-105' : 'scale-100'}`}
        />
        
        {/* Badge de catégorie */}
        <div className="absolute top-2 left-2 bg-white bg-opacity-90 text-boulangerie-800 px-2 py-1 rounded-md text-xs font-medium">
          {produit.categorie}
        </div>
        
        {/* Badge de prix */}
        <div className="absolute top-2 right-2">
          {produit.enPromotion && produit.prixPromotion ? (
            <div className="flex flex-col items-end">
              <span className="bg-red-500 text-white px-2 py-1 rounded-md font-semibold">
                {prixAffiche.toFixed(2)}€
              </span>
              <span className="mt-1 bg-white bg-opacity-90 text-red-500 px-1 py-0.5 rounded-md text-xs line-through">
                {produit.prix.toFixed(2)}€
              </span>
              <span className="mt-1 bg-red-500 text-white px-1 py-0.5 rounded-md text-xs">
                -{pourcentageReduction}%
              </span>
            </div>
          ) : (
            <span className="bg-boulangerie-500 text-white px-2 py-1 rounded-md font-semibold">
              {prixAffiche.toFixed(2)}€
            </span>
          )}
        </div>
        
        {/* Badge non disponible */}
        {!produit.disponible && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-gray-800 text-white px-3 py-1 rounded-md text-sm font-medium">
              Indisponible
            </span>
          </div>
        )}
        
        {/* Navigation des images */}
        {aPlusieursImages && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center">
            <div className="flex space-x-1 bg-black bg-opacity-30 rounded-full px-2 py-1">
              {produit.images.map((img, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    setImageActuelle(img);
                  }}
                  className={`w-2 h-2 rounded-full ${
                    imageActuelle === img ? 'bg-white' : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                  }`}
                  aria-label={`Image ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800">{produit.nom}</h3>
          {produit.enVedette && (
            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full flex items-center">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Vedette
            </span>
          )}
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2 h-10">{produit.description}</p>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {produit.ingredients.slice(0, 3).map((ingredient, index) => (
            <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
              {ingredient}
            </span>
          ))}
          {produit.ingredients.length > 3 && (
            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
              +{produit.ingredients.length - 3}
            </span>
          )}
        </div>
        
        <Link
          href={`/produits/${produit._id}`}
          className={`block text-center ${
            produit.disponible 
              ? 'bg-boulangerie-600 text-white hover:bg-boulangerie-700' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          } py-2 px-4 rounded-md transition-colors`}
        >
          {produit.disponible ? 'Voir détails' : 'Indisponible'}
        </Link>
      </div>
    </div>
  );
};