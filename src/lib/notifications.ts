import { PayloadNotification } from '@/types';

export async function envoyerNotification(payload: PayloadNotification) {
  const messageTexte = formaterCommande(payload.commande);

  try {
    console.log('Nouvelle commande reçue:');
    console.log(messageTexte);    
    return {
      success: true,
      message: 'Notification enregistrée'
    };
  } catch (error) {
    console.error(`Erreur lors de l'envoi de la notification:`, error);
    throw error;
  }
}

const formaterCommande = (commande: PayloadNotification['commande']) => {
  const detailsProduits = commande.produits
    .map(p => `${p.quantite}x ${p.nom} (${p.prix * p.quantite}€)`)
    .join('\n');

  return `
Nouvelle commande !

Produits:
${detailsProduits}

Total: ${commande.prixTotal}€

Client:
${commande.infoClient.nom}
${commande.infoClient.telephone}
${commande.infoClient.adresse}
`;
};