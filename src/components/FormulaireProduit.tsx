'use client';

import { Produit } from '@/types';
import { serviceProduit } from '@/services/api';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

interface FormulaireProduitProps {
  produitInitial?: Produit;
}

export const FormulaireProduit = ({ produitInitial }: FormulaireProduitProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [produit, setProduit] = useState<Omit<Produit, '_id'>>({
    nom: produitInitial?.nom || '',
    image: produitInitial?.image || '',
    images: produitInitial?.images || [],
    prix: produitInitial?.prix || 0,
    description: produitInitial?.description || '',
    ingredients: produitInitial?.ingredients || [''],
    categorie: produitInitial?.categorie || 'Non classé',
    enPromotion: produitInitial?.enPromotion || false,
    prixPromotion: produitInitial?.prixPromotion || 0,
    enVedette: produitInitial?.enVedette || false,
    disponible: produitInitial?.disponible || true,
    dateDeMiseAJour: produitInitial?.dateDeMiseAJour || new Date()
  });

  const categories = [
    'Pains', 
    'Viennoiseries', 
    'Pâtisseries',
    'Salés',
    'Spécialités',
    'Non classé'
  ];

  const ajouterIngredient = () => {
    setProduit({
      ...produit,
      ingredients: [...produit.ingredients, '']
    });
  };

  const supprimerIngredient = (index: number) => {
    setProduit({
      ...produit,
      ingredients: produit.ingredients.filter((_, i) => i !== index)
    });
  };

  const modifierIngredient = (index: number, valeur: string) => {
    setProduit({
      ...produit,
      ingredients: produit.ingredients.map((ing, i) => i === index ? valeur : ing)
    });
  };

  const ajouterImage = () => {
    if (produit.image && !produit.images.includes(produit.image)) {
      setProduit({
        ...produit,
        images: [...produit.images, produit.image, '']
      });
    } else {
      setProduit({
        ...produit,
        images: [...produit.images, '']
      });
    }
  };

  const supprimerImage = (index: number) => {
    const imageASupprimer = produit.images[index];
    const nouvellesImages = produit.images.filter((_, i) => i !== index);
    
    setProduit({
      ...produit,
      images: nouvellesImages,
      image: imageASupprimer === produit.image && nouvellesImages.length > 0 ? nouvellesImages[0] : produit.image
    });
  };

  const modifierImage = (index: number, valeur: string) => {
    const nouvellesImages = [...produit.images];
    nouvellesImages[index] = valeur;
    
    const imageActuelle = produit.images[index];
    const image = imageActuelle === produit.image ? valeur : produit.image;
    
    setProduit({
      ...produit,
      images: nouvellesImages,
      image: image || (nouvellesImages.length > 0 ? nouvellesImages[0] : '')
    });
  };

  const definirImagePrincipale = (imageUrl: string) => {
    setProduit({
      ...produit,
      image: imageUrl
    });
  };

  const togglePromotion = () => {
    setProduit({
      ...produit,
      enPromotion: !produit.enPromotion,
      prixPromotion: !produit.enPromotion ? (produit.prix * 0.9) : produit.prixPromotion
    });
  };

  const isValidImageUrl = (url: string) => {
    if (!url || url.trim() === '') return false;
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (produit.nom.trim() === '') {
      toast.error('Le nom du produit est requis');
      return;
    }
    
    if (produit.image.trim() === '') {
      toast.error('L\'URL de l\'image est requise');
      return;
    }
    
    if (produit.prix <= 0) {
      toast.error('Le prix doit être supérieur à 0');
      return;
    }
    
    if (produit.description.trim() === '') {
      toast.error('La description est requise');
      return;
    }
    
    if (produit.ingredients.some(ing => ing.trim() === '')) {
      toast.error('Tous les ingrédients doivent être remplis');
      return;
    }
    
    if (produit.enPromotion && (!produit.prixPromotion || produit.prixPromotion >= produit.prix)) {
      toast.error('Le prix en promotion doit être inférieur au prix normal');
      return;
    }

    const imagesUniques = Array.from(new Set(produit.images.filter(img => img.trim() !== '')));
    if (imagesUniques.length === 0) {
      toast.error('Au moins une image est requise');
      return;
    }
    
    if (!imagesUniques.includes(produit.image)) {
      imagesUniques.unshift(produit.image);
    }

    const produitAEnvoyer = {
      ...produit,
      images: imagesUniques,
      dateDeMiseAJour: new Date()
    };

    setLoading(true);

    try {
      if (produitInitial) {
        await serviceProduit.modifier(produitInitial._id, produitAEnvoyer);
        toast.success('Produit modifié avec succès');
      } else {
        await serviceProduit.creer(produitAEnvoyer);
        toast.success('Produit créé avec succès');
      }
      router.push('/admin');
    } catch (error) {
      toast.error('Erreur lors de l\'enregistrement du produit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b">
        <h2 className="text-lg font-medium text-gray-900">
          {produitInitial ? 'Modifier le produit' : 'Ajouter un nouveau produit'}
        </h2>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div>
              <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">
                Nom du produit*
              </label>
              <input
                id="nom"
                type="text"
                required
                value={produit.nom}
                onChange={(e) => setProduit({ ...produit, nom: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-boulangerie-500 focus:border-boulangerie-500"
                placeholder="Ex: Pain au Chocolat"
              />
            </div>

            <div>
              <label htmlFor="categorie" className="block text-sm font-medium text-gray-700 mb-1">
                Catégorie*
              </label>
              <select
                id="categorie"
                value={produit.categorie}
                onChange={(e) => setProduit({ ...produit, categorie: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-boulangerie-500 focus:border-boulangerie-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="prix" className="block text-sm font-medium text-gray-700 mb-1">
                  Prix (€)*
                </label>
                <input
                  id="prix"
                  type="number"
                  required
                  min="0.01"
                  step="0.01"
                  value={produit.prix}
                  onChange={(e) => setProduit({ ...produit, prix: parseFloat(e.target.value) })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-boulangerie-500 focus:border-boulangerie-500"
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="prixPromotion" className="block text-sm font-medium text-gray-700">
                    Prix en promotion (€)
                  </label>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={produit.enPromotion}
                      onChange={togglePromotion}
                      className="h-4 w-4 text-boulangerie-600 focus:ring-boulangerie-500 rounded"
                    />
                    <span className="ml-2 text-xs text-gray-700">En promotion</span>
                  </label>
                </div>
                <input
                  id="prixPromotion"
                  type="number"
                  min="0.01"
                  step="0.01"
                  disabled={!produit.enPromotion}
                  value={produit.prixPromotion}
                  onChange={(e) => setProduit({ ...produit, prixPromotion: parseFloat(e.target.value) })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-boulangerie-500 focus:border-boulangerie-500 disabled:bg-gray-100 disabled:text-gray-500"
                  placeholder="0.00"
                />
              </div>
            </div>
            
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={produit.enVedette}
                  onChange={(e) => setProduit({ ...produit, enVedette: e.target.checked })}
                  className="h-4 w-4 text-boulangerie-600 focus:ring-boulangerie-500 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Produit en vedette</span>
              </label>
              
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={produit.disponible}
                  onChange={(e) => setProduit({ ...produit, disponible: e.target.checked })}
                  className="h-4 w-4 text-boulangerie-600 focus:ring-boulangerie-500 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Disponible</span>
              </label>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description*
              </label>
              <textarea
                id="description"
                required
                value={produit.description}
                onChange={(e) => setProduit({ ...produit, description: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-boulangerie-500 focus:border-boulangerie-500"
                rows={4}
                placeholder="Décrivez votre produit..."
              />
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Images du produit*
              </label>
              <div className="space-y-3">
                {produit.images.map((imageUrl, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => modifierImage(index, e.target.value)}
                      className="flex-grow border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-boulangerie-500 focus:border-boulangerie-500"
                      placeholder="https://example.com/image.jpg"
                    />
                    <button
                      type="button"
                      onClick={() => definirImagePrincipale(imageUrl)}
                      disabled={imageUrl === produit.image || imageUrl.trim() === ''}
                      className={`px-2 py-2 rounded-md ${
                        imageUrl === produit.image
                          ? 'bg-boulangerie-200 text-boulangerie-800'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                      title="Définir comme image principale"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => supprimerImage(index)}
                      disabled={produit.images.length <= 1}
                      className="px-2 py-2 text-red-600 hover:text-red-800 disabled:text-gray-400"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                    
                    {imageUrl && isValidImageUrl(imageUrl) && (
                      <div className="relative w-10 h-10 border rounded overflow-hidden flex-shrink-0">
                        <Image
                          src={imageUrl}
                          alt="Aperçu"
                          fill
                          className="object-cover"
                          onError={() => toast.error(`Impossible de charger l'image ${index + 1}`)}
                        />
                      </div>
                    )}
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={ajouterImage}
                  className="text-boulangerie-600 hover:text-boulangerie-800 inline-flex items-center"
                >
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  Ajouter une image
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ingrédients*
              </label>
              <div className="space-y-2">
                {produit.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={ingredient}
                      onChange={(e) => modifierIngredient(index, e.target.value)}
                      className="flex-grow border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-boulangerie-500 focus:border-boulangerie-500"
                      placeholder={`Ingrédient ${index + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => supprimerIngredient(index)}
                      disabled={produit.ingredients.length <= 1}
                      className="px-3 py-2 text-red-600 hover:text-red-800 disabled:text-gray-400"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={ajouterIngredient}
                  className="text-boulangerie-600 hover:text-boulangerie-800 inline-flex items-center"
                >
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  Ajouter un ingrédient
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-boulangerie-600 text-white rounded-md hover:bg-boulangerie-700 disabled:bg-gray-400 flex items-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enregistrement...
              </>
            ) : (
              'Enregistrer'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};