import axios from 'axios';
import { Produit, Commande } from '@/types';

const isServer = typeof window === 'undefined';

const getCurrentHost = () => {
  if (isServer) return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';  
  const currentURL = window.location.origin;
  return `${currentURL}/api`;
};

const api = axios.create({
  baseURL: getCurrentHost(),
  headers: {
    'Content-Type': 'application/json',
  }
});

export const serviceProduit = {
  getTout: () => api.get<Produit[]>('/produits').then(res => res.data),
  getParId: (id: string) => api.get<Produit>(`/produits/${id}`).then(res => res.data),
  getParCategorie: (categorie: string) => api.get<Produit[]>(`/produits/categorie/${categorie}`).then(res => res.data),
  creer: (produit: Omit<Produit, '_id'>) => api.post<Produit>('/produits', produit).then(res => res.data),
  modifier: (id: string, produit: Partial<Produit>) => api.put<Produit>(`/produits/${id}`, produit).then(res => res.data),
  supprimer: (id: string) => api.delete(`/produits/${id}`).then(res => res.data)
};

export const serviceCommande = {
  getTout: () => api.get<Commande[]>('/commandes').then(res => res.data),
  getParId: (id: string) => api.get<Commande>(`/commandes/${id}`).then(res => res.data),
  creer: (commande: Commande) => api.post<Commande>('/commandes', commande).then(res => res.data),
  mettreAJourStatut: (id: string, statut: string, commentaire?: string) => 
    api.put<Commande>(`/commandes/${id}`, { statut, commentaire }).then(res => res.data),
  supprimer: (id: string) => api.delete(`/commandes/${id}`).then(res => res.data)
};