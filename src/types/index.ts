export interface Produit {
    _id: string;
    nom: string;
    image: string;
    images: string[];
    prix: number;
    description: string;
    ingredients: string[];
    categorie: string;
    enPromotion: boolean;
    prixPromotion?: number;
    enVedette: boolean;
    disponible: boolean;
    dateDeMiseAJour: Date;
}
 
export interface ArticlePanier extends Produit {
    quantite: number;
}

export type StatutCommande = 'en_attente' | 'confirmee' | 'annulee' | 'en_preparation' | 'prete' | 'livree';

export interface HistoriqueEvent {
    statut: StatutCommande;
    date: string;
    commentaire?: string;
}

export interface Commande {
    _id: string;
    produits: ArticlePanier[];
    prixTotal: number;
    infoClient: {
      nom: string;
      telephone: string;
      adresse: string;
    };
    statut: StatutCommande;
    notes?: string;
    createdAt?: string;
    updatedAt?: string;
    historique: HistoriqueEvent[];
}
 
export interface PayloadNotification {
    commande: Commande;
    type: 'whatsapp' | 'email' | 'sms';
}
 
export type FiltreCategorie = 'toutes' | string;
export type OrdreDeTri = 'prixCroissant' | 'prixDecroissant' | 'alphabetique' | 'nouveautes' | 'populaires';
 
export interface FiltresProduit {
    recherche: string;
    categorie: FiltreCategorie;
    prixMin: number;
    prixMax: number;
    ordre: OrdreDeTri;
    promotion: boolean;
    disponible: boolean;
}