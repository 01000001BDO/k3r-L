export interface Produit {
    _id: string;
    nom: string;
    image: string;
    prix: number;
    description: string;
    ingredients: string[];
}
  
export interface ArticlePanier extends Produit {
    quantite: number;
}
  
export interface Commande {
    produits: ArticlePanier[];
    prixTotal: number;
    infoClient: {
      nom: string;
      telephone: string;
      adresse: string;
    };
}
  
export interface PayloadNotification {
    commande: Commande;
    type: 'whatsapp' | 'email' | 'sms';
}