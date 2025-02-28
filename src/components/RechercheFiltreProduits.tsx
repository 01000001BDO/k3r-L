'use client';

import { useState, useEffect } from 'react';
import { Produit, FiltresProduit, OrdreDeTri, FiltreCategorie } from '@/types';
import { CarteProduit } from '@/components/CarteProduit';

interface RechercheFiltreProduitProps {
  produits: Produit[];
}

export const RechercheFiltreProduits = ({ produits }: RechercheFiltreProduitProps) => {
  // Extraire toutes les catégories disponibles
  const categories = ['toutes', ...Array.from(new Set(produits.map(p => p.categorie)))];
  
  // Calculer les prix min et max pour les filtres
  const prixMinimum = Math.floor(Math.min(...produits.map(p => p.prix)));
  const prixMaximum = Math.ceil(Math.max(...produits.map(p => p.prix)));
  
  // État des filtres
  const [filtres, setFiltres] = useState<FiltresProduit>({
    recherche: '',
    categorie: 'toutes',
    prixMin: prixMinimum,
    prixMax: prixMaximum,
    ordre: 'alphabetique',
    promotion: false,
    disponible: true
  });
  
  const [produitsFiltrés, setProduitsFiltrés] = useState<Produit[]>(produits);
  const [filtrageActif, setFiltrageActif] = useState(false);
  const [panneauFiltresOuvert, setPanneauFiltresOuvert] = useState(false);
  
  useEffect(() => {
    // Vérifier si des filtres sont actifs
    const filtreActif = 
      filtres.recherche !== '' || 
      filtres.categorie !== 'toutes' || 
      filtres.prixMin !== prixMinimum || 
      filtres.prixMax !== prixMaximum || 
      filtres.ordre !== 'alphabetique' ||
      filtres.promotion ||
      !filtres.disponible;
    
    setFiltrageActif(filtreActif);
    
    // Appliquer les filtres
    let resultat = [...produits];
    
    // Filtre par recherche
    if (filtres.recherche.trim()) {
      const searchTerms = filtres.recherche.toLowerCase().split(' ').filter(Boolean);
      resultat = resultat.filter(produit => 
        searchTerms.some(term => 
          produit.nom.toLowerCase().includes(term) ||
          produit.description.toLowerCase().includes(term) ||
          produit.ingredients.some(ingredient => 
            ingredient.toLowerCase().includes(term)
          ) ||
          produit.categorie.toLowerCase().includes(term)
        )
      );
    }
    
    // Filtre par catégorie
    if (filtres.categorie !== 'toutes') {
      resultat = resultat.filter(produit => produit.categorie === filtres.categorie);
    }
    
    // Filtre par prix
    resultat = resultat.filter(produit => {
      const prix = produit.enPromotion && produit.prixPromotion 
        ? produit.prixPromotion 
        : produit.prix;
      return prix >= filtres.prixMin && prix <= filtres.prixMax;
    });
    
    // Filtre par promotion
    if (filtres.promotion) {
      resultat = resultat.filter(produit => produit.enPromotion);
    }
    
    // Filtre par disponibilité
    if (filtres.disponible) {
      resultat = resultat.filter(produit => produit.disponible);
    }
    
    // Tri des résultats
    switch (filtres.ordre) {
      case 'prixCroissant':
        resultat.sort((a, b) => {
          const prixA = a.enPromotion && a.prixPromotion ? a.prixPromotion : a.prix;
          const prixB = b.enPromotion && b.prixPromotion ? b.prixPromotion : b.prix;
          return prixA - prixB;
        });
        break;
      case 'prixDecroissant':
        resultat.sort((a, b) => {
          const prixA = a.enPromotion && a.prixPromotion ? a.prixPromotion : a.prix;
          const prixB = b.enPromotion && b.prixPromotion ? b.prixPromotion : b.prix;
          return prixB - prixA;
        });
        break;
      case 'alphabetique':
        resultat.sort((a, b) => a.nom.localeCompare(b.nom));
        break;
      case 'nouveautes':
        resultat.sort((a, b) => new Date(b.dateDeMiseAJour).getTime() - new Date(a.dateDeMiseAJour).getTime());
        break;
      case 'populaires':
        // Ici on pourrait ajouter une logique pour trier par popularité si on avait cette donnée
        // Pour l'instant, on affiche les produits en vedette en premier
        resultat.sort((a, b) => (b.enVedette ? 1 : 0) - (a.enVedette ? 1 : 0));
        break;
    }
    
    setProduitsFiltrés(resultat);
  }, [filtres, produits, prixMinimum, prixMaximum]);
  
  const changerOrdre = (ordre: OrdreDeTri) => {
    setFiltres({ ...filtres, ordre });
  };
  
  const changerCategorie = (categorie: FiltreCategorie) => {
    setFiltres({ ...filtres, categorie });
  };
  
  const reinitialiserFiltres = () => {
    setFiltres({
      recherche: '',
      categorie: 'toutes',
      prixMin: prixMinimum,
      prixMax: prixMaximum,
      ordre: 'alphabetique',
      promotion: false,
      disponible: true
    });
  };
  
  return (
    <div>
      {/* Barre de recherche principale */}
      <div className="mb-6">
        <div className="relative max-w-3xl mx-auto">
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={filtres.recherche}
            onChange={(e) => setFiltres({ ...filtres, recherche: e.target.value })}
            className="w-full py-3 pl-12 pr-4 text-gray-700 bg-white border rounded-lg focus:border-boulangerie-500 focus:outline-none focus:ring-1 focus:ring-boulangerie-500"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Filtres et tris */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
          <div>
            <button 
              onClick={() => setPanneauFiltresOuvert(!panneauFiltresOuvert)}
              className="flex items-center text-gray-700 hover:text-boulangerie-600 mb-4 lg:mb-0"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
              </svg>
              Filtres {filtrageActif && <span className="ml-2 bg-boulangerie-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">●</span>}
            </button>
          </div>
          
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-600">Trier par:</span>
            <select
              value={filtres.ordre}
              onChange={(e) => changerOrdre(e.target.value as OrdreDeTri)}
              className="border border-gray-300 rounded-md text-sm pl-3 pr-8 py-1.5 focus:outline-none focus:ring-1 focus:ring-boulangerie-500"
            >
              <option value="alphabetique">Alphabétique</option>
              <option value="prixCroissant">Prix croissant</option>
              <option value="prixDecroissant">Prix décroissant</option>
              <option value="nouveautes">Nouveautés</option>
              <option value="populaires">Populaires</option>
            </select>
            
            {filtrageActif && (
              <button 
                onClick={reinitialiserFiltres}
                className="text-sm text-boulangerie-600 hover:text-boulangerie-800"
              >
                Réinitialiser
              </button>
            )}
          </div>
        </div>
        
        {/* Panneau de filtres avancés */}
        {panneauFiltresOuvert && (
          <div className="mt-6 pt-6 border-t">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Filtre par catégorie */}
              <div>
                <h3 className="font-medium text-gray-700 mb-3">Catégories</h3>
                <div className="space-y-2">
                  {categories.map((categorie) => (
                    <label key={categorie} className="flex items-center">
                      <input
                        type="radio"
                        name="categorie"
                        checked={filtres.categorie === categorie}
                        onChange={() => changerCategorie(categorie)}
                        className="h-4 w-4 text-boulangerie-600 focus:ring-boulangerie-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {categorie === 'toutes' ? 'Toutes les catégories' : categorie}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Filtre par prix */}
              <div>
                <h3 className="font-medium text-gray-700 mb-3">Prix</h3>
                <div className="px-2">
                  <div className="mb-6 relative pt-5">
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div
                        className="absolute h-2 bg-boulangerie-500 rounded-full"
                        style={{
                          left: `${((filtres.prixMin - prixMinimum) / (prixMaximum - prixMinimum)) * 100}%`,
                          right: `${100 - ((filtres.prixMax - prixMinimum) / (prixMaximum - prixMinimum)) * 100}%`
                        }}
                      ></div>
                      <input
                        type="range"
                        min={prixMinimum}
                        max={prixMaximum}
                        step="0.5"
                        value={filtres.prixMin}
                        onChange={(e) => setFiltres({ ...filtres, prixMin: parseFloat(e.target.value) })}
                        className="absolute w-full h-2 opacity-0 cursor-pointer"
                      />
                      <input
                        type="range"
                        min={prixMinimum}
                        max={prixMaximum}
                        step="0.5"
                        value={filtres.prixMax}
                        onChange={(e) => setFiltres({ ...filtres, prixMax: parseFloat(e.target.value) })}
                        className="absolute w-full h-2 opacity-0 cursor-pointer"
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{filtres.prixMin.toFixed(2)}€</span>
                      <span className="text-sm text-gray-600">{filtres.prixMax.toFixed(2)}€</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Autres filtres */}
              <div>
                <h3 className="font-medium text-gray-700 mb-3">Autres filtres</h3>
                <div className="space-y-3">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={filtres.promotion}
                      onChange={(e) => setFiltres({ ...filtres, promotion: e.target.checked })}
                      className="h-4 w-4 text-boulangerie-600 focus:ring-boulangerie-500 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">En promotion</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={filtres.disponible}
                      onChange={(e) => setFiltres({ ...filtres, disponible: e.target.checked })}
                      className="h-4 w-4 text-boulangerie-600 focus:ring-boulangerie-500 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Disponible uniquement</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Résultats */}
      {produitsFiltrés.length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p className="text-gray-500 text-lg">Aucun produit ne correspond à votre recherche.</p>
          <button
            onClick={reinitialiserFiltres}
            className="mt-4 text-boulangerie-600 hover:text-boulangerie-800"
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div>
          <div className="mb-4 text-gray-600">
            {produitsFiltrés.length} produit{produitsFiltrés.length > 1 ? 's' : ''} trouvé{produitsFiltrés.length > 1 ? 's' : ''}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {produitsFiltrés.map((produit) => (
              <CarteProduit key={produit._id} produit={produit} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};