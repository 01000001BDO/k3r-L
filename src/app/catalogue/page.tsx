import { connecterDB } from '@/lib/db';
import { ModeleProduit } from '@/models/produit';
import { RechercheFiltreProduits } from '@/components/RechercheFiltreProduits';

export default async function Catalogue() {
  await connecterDB();
  const produits = await ModeleProduit.find({});

  return (
    <div className="container mx-auto px-4 pt-24 pb-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-display font-bold text-boulangerie-700 mb-4">
          Nos Délices Artisanaux
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Découvrez notre sélection de produits frais, préparés chaque jour avec amour et savoir-faire.
        </p>
      </div>

      <RechercheFiltreProduits produits={JSON.parse(JSON.stringify(produits))} />
    </div>
  );
}