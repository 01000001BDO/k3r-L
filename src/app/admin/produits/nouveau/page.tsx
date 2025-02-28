import { FormulaireProduit } from '@/components/FormulaireProduit';

export default function PageNouveauProduit() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-serif">Ajouter un Nouveau Produit</h1>
        <p className="text-gray-600">Créez un nouveau produit pour votre catalogue</p>
      </div>
      <FormulaireProduit />
    </div>
  );
}