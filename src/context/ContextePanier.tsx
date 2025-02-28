'use client';

import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { ArticlePanier, Produit } from '@/types';

interface EtatPanier {
  articles: ArticlePanier[];
  total: number;
  sousTotal: number;
  reduction: number;
  fraisLivraison: number;
}

type ActionPanier =
  | { type: 'AJOUTER_ARTICLE'; payload: Produit }
  | { type: 'SUPPRIMER_ARTICLE'; payload: { id: string } }
  | { type: 'MODIFIER_QUANTITE'; payload: { id: string; quantite: number } }
  | { type: 'APPLIQUER_REDUCTION'; payload: { reduction: number } }
  | { type: 'METTRE_A_JOUR_LIVRAISON'; payload: { fraisLivraison: number } }
  | { type: 'VIDER_PANIER' }
  | { type: 'INITIALISER_PANIER'; payload: { articles: ArticlePanier[] } };

const SEUIL_LIVRAISON_GRATUITE = 30;
const FRAIS_LIVRAISON_STANDARD = 3.5;

const initialState: EtatPanier = {
  articles: [],
  total: 0,
  sousTotal: 0,
  reduction: 0,
  fraisLivraison: 0
};

const calculerFraisLivraison = (sousTotal: number): number => {
  return sousTotal >= SEUIL_LIVRAISON_GRATUITE ? 0 : FRAIS_LIVRAISON_STANDARD;
};

const calculerTotal = (sousTotal: number, reduction: number, fraisLivraison: number): number => {
  return Math.max(0, sousTotal - reduction) + fraisLivraison;
};

const ContextePanier = createContext<{
  etat: EtatPanier;
  dispatch: React.Dispatch<ActionPanier>;
} | null>(null);

const reducteurPanier = (etat: EtatPanier, action: ActionPanier): EtatPanier => {
  switch (action.type) {
    case 'AJOUTER_ARTICLE': {
      const articleExistant = etat.articles.find(article => article._id === action.payload._id);
      const prix = action.payload.enPromotion && action.payload.prixPromotion 
        ? action.payload.prixPromotion 
        : action.payload.prix;
      
      let nouveauxArticles;
      let nouveauSousTotal;
      
      if (articleExistant) {
        nouveauxArticles = etat.articles.map(article =>
          article._id === action.payload._id
            ? { ...article, quantite: article.quantite + 1 }
            : article
        );
        nouveauSousTotal = etat.sousTotal + prix;
      } else {
        nouveauxArticles = [...etat.articles, { ...action.payload, quantite: 1 }];
        nouveauSousTotal = etat.sousTotal + prix;
      }
      
      const nouveauxFraisLivraison = calculerFraisLivraison(nouveauSousTotal);
      const nouveauTotal = calculerTotal(nouveauSousTotal, etat.reduction, nouveauxFraisLivraison);
      
      return {
        ...etat,
        articles: nouveauxArticles,
        sousTotal: nouveauSousTotal,
        fraisLivraison: nouveauxFraisLivraison,
        total: nouveauTotal
      };
    }
    
    case 'SUPPRIMER_ARTICLE': {
      const article = etat.articles.find(article => article._id === action.payload.id);
      if (!article) return etat;
      
      const prix = article.enPromotion && article.prixPromotion 
        ? article.prixPromotion 
        : article.prix;
      
      const nouveauxArticles = etat.articles.filter(article => article._id !== action.payload.id);
      const nouveauSousTotal = etat.sousTotal - (prix * article.quantite);
      const nouveauxFraisLivraison = calculerFraisLivraison(nouveauSousTotal);
      const nouveauTotal = calculerTotal(nouveauSousTotal, etat.reduction, nouveauxFraisLivraison);
      
      return {
        ...etat,
        articles: nouveauxArticles,
        sousTotal: nouveauSousTotal,
        fraisLivraison: nouveauxFraisLivraison,
        total: nouveauTotal
      };
    }
    
    case 'MODIFIER_QUANTITE': {
      const article = etat.articles.find(article => article._id === action.payload.id);
      if (!article) return etat;
      
      if (action.payload.quantite <= 0) {
        return reducteurPanier(etat, { 
          type: 'SUPPRIMER_ARTICLE', 
          payload: { id: action.payload.id } 
        });
      }
      
      const prix = article.enPromotion && article.prixPromotion
        ? article.prixPromotion
        : article.prix;
      
      const diffQuantite = action.payload.quantite - article.quantite;
      const nouveauxArticles = etat.articles.map(article =>
        article._id === action.payload.id
          ? { ...article, quantite: action.payload.quantite }
          : article
      );
      
      const nouveauSousTotal = etat.sousTotal + (prix * diffQuantite);
      const nouveauxFraisLivraison = calculerFraisLivraison(nouveauSousTotal);
      const nouveauTotal = calculerTotal(nouveauSousTotal, etat.reduction, nouveauxFraisLivraison);
      
      return {
        ...etat,
        articles: nouveauxArticles,
        sousTotal: nouveauSousTotal,
        fraisLivraison: nouveauxFraisLivraison,
        total: nouveauTotal
      };
    }
    
    case 'APPLIQUER_REDUCTION': {
      const nouvelleReduction = action.payload.reduction;
      const nouveauTotal = calculerTotal(etat.sousTotal, nouvelleReduction, etat.fraisLivraison);
      
      return {
        ...etat,
        reduction: nouvelleReduction,
        total: nouveauTotal
      };
    }
    
    case 'METTRE_A_JOUR_LIVRAISON': {
      const nouveauxFraisLivraison = action.payload.fraisLivraison;
      const nouveauTotal = calculerTotal(etat.sousTotal, etat.reduction, nouveauxFraisLivraison);
      
      return {
        ...etat,
        fraisLivraison: nouveauxFraisLivraison,
        total: nouveauTotal
      };
    }
    
    case 'VIDER_PANIER':
      return initialState;
    
    case 'INITIALISER_PANIER': {
      const articles = action.payload.articles;
      
      const sousTotal = articles.reduce((total, article) => {
        const prix = article.enPromotion && article.prixPromotion 
          ? article.prixPromotion 
          : article.prix;
        return total + (prix * article.quantite);
      }, 0);
      
      const fraisLivraison = calculerFraisLivraison(sousTotal);
      const total = calculerTotal(sousTotal, 0, fraisLivraison);
      
      return {
        articles,
        sousTotal,
        total,
        reduction: 0,
        fraisLivraison
      };
    }
    
    default:
      return etat;
  }
};

export const FournisseurPanier = ({ children }: { children: ReactNode }) => {
  const [etat, dispatch] = useReducer(reducteurPanier, initialState);
  
  useEffect(() => {
    const panierSauvegarde = localStorage.getItem('panier');
    
    if (panierSauvegarde) {
      try {
        const articles = JSON.parse(panierSauvegarde);
        if (Array.isArray(articles) && articles.length > 0) {
          dispatch({ type: 'INITIALISER_PANIER', payload: { articles } });
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du panier:', error);
      }
    }
  }, []);
  
  useEffect(() => {
    if (etat.articles.length > 0) {
      localStorage.setItem('panier', JSON.stringify(etat.articles));
    } else {
      localStorage.removeItem('panier');
    }
  }, [etat.articles]);
  
  return (
    <ContextePanier.Provider value={{ etat, dispatch }}>
      {children}
    </ContextePanier.Provider>
  );
};

export const usePanier = () => {
  const contexte = useContext(ContextePanier);
  if (!contexte) {
    throw new Error('usePanier doit être utilisé dans un FournisseurPanier');
  }
  return contexte;
};