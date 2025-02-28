'use client';

import { useState } from 'react';
import { usePanier } from '@/context/ContextePanier';
import { serviceCommande } from '@/services/api';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import PurchaseConfirmationPopup from './PurchaseConfirmationPopup';
import { Commande, StatutCommande } from '@/types';
import { 
  Truck, 
  CreditCard, 
  ShieldCheck, 
  Clock, 
  User, 
  Phone, 
  MapPin,
  ArrowRight,
  CalendarClock,
  Store
} from 'lucide-react';

export const FormulaireCommande = () => {
  const router = useRouter();
  const { etat, dispatch } = usePanier();
  const [loading, setLoading] = useState(false);
  const [infoClient, setInfoClient] = useState({
    nom: '',
    telephone: '',
    adresse: ''
  });
  const [showPopup, setShowPopup] = useState(false);
  const [step, setStep] = useState(1);
  
  const [deliveryMode, setDeliveryMode] = useState('livraison');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (etat.articles.length === 0) {
      toast.error('Votre panier est vide');
      return;
    }

    try {
      setLoading(true);
      
      let deliveryInfo = deliveryMode === 'livraison' ? '(Livraison à domicile)' : '(Retrait en boutique)';
      
      const commandeData: Partial<Commande> = {
        produits: etat.articles,
        prixTotal: etat.total,
        infoClient: {
          ...infoClient,
          adresse: `${infoClient.adresse} ${deliveryInfo}`
        },
        _id: '',
        statut: 'en_attente' as StatutCommande,
        historique: []
      };
      
      await serviceCommande.creer(commandeData as Commande);
      setShowPopup(true);      
      dispatch({ type: 'VIDER_PANIER' });      
    } catch (error) {
      toast.error('Erreur lors de la commande');
      setLoading(false);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    router.push('/confirmation');
  };

  const nextStep = () => {
    if (!infoClient.nom || !infoClient.telephone || !infoClient.adresse) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }
    setStep(2);
  };

  const prevStep = () => {
    setStep(1);
  };

  const formatPrice = (price: number) => {
    return price.toFixed(2) + '€';
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-boulangerie-600 to-boulangerie-500 p-5 text-white">
          <h2 className="text-xl font-serif font-semibold">Finaliser votre commande</h2>
          <div className="text-sm mt-1 opacity-90">
            {etat.articles.reduce((total, item) => total + item.quantite, 0)} articles · {formatPrice(etat.total)}
          </div>
        </div>

        <div className="px-6 pt-4 pb-2">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === 1 ? 'bg-boulangerie-600 text-white' : 'bg-boulangerie-100 text-boulangerie-600'
              }`}>
                1
              </div>
              <span className={`text-xs mt-1 ${step === 1 ? 'text-boulangerie-600 font-medium' : 'text-gray-500'}`}>
                Informations
              </span>
            </div>
            
            <div className={`flex-grow mx-2 h-1 ${step === 2 ? 'bg-boulangerie-600' : 'bg-gray-200'}`}></div>
            
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === 2 ? 'bg-boulangerie-600 text-white' : 'bg-boulangerie-100 text-boulangerie-600'
              }`}>
                2
              </div>
              <span className={`text-xs mt-1 ${step === 2 ? 'text-boulangerie-600 font-medium' : 'text-gray-500'}`}>
                Livraison
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {step === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <User className="w-4 h-4 mr-1 text-boulangerie-500" />
                  Nom complet
                </label>
                <input
                  type="text"
                  required
                  value={infoClient.nom}
                  onChange={(e) => setInfoClient({ ...infoClient, nom: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-boulangerie-500 focus:border-transparent transition-all"
                  placeholder="Votre nom et prénom"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Phone className="w-4 h-4 mr-1 text-boulangerie-500" />
                  Téléphone
                </label>
                <input
                  type="tel"
                  required
                  value={infoClient.telephone}
                  onChange={(e) => setInfoClient({ ...infoClient, telephone: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-boulangerie-500 focus:border-transparent transition-all"
                  placeholder="Votre numéro de téléphone"
                />
                <p className="mt-1 text-xs text-gray-500">Nous vous contacterons uniquement pour la livraison</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <MapPin className="w-4 h-4 mr-1 text-boulangerie-500" />
                  Adresse
                </label>
                <textarea
                  required
                  value={infoClient.adresse}
                  onChange={(e) => setInfoClient({ ...infoClient, adresse: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-boulangerie-500 focus:border-transparent transition-all"
                  rows={3}
                  placeholder="Rue, numéro, code postal, ville..."
                />
              </div>
              
              <button
                type="button"
                onClick={nextStep}
                className="w-full bg-boulangerie-600 text-white py-3 rounded-lg hover:bg-boulangerie-700 transition-colors mt-4 flex items-center justify-center font-medium"
              >
                Continuer
                <ArrowRight className="ml-2 w-4 h-4" />
              </button>
            </div>
          )}
          
          {step === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h3 className="text-lg font-medium mb-3 flex items-center">
                  <Truck className="w-5 h-5 mr-2 text-boulangerie-500" />
                  Mode de récupération
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  <label 
                    className={`block border rounded-lg p-4 cursor-pointer transition-all ${
                      deliveryMode === 'livraison'
                        ? 'border-boulangerie-500 bg-boulangerie-50 ring-2 ring-boulangerie-500/20'
                        : 'border-gray-200 hover:border-boulangerie-300'
                    }`}
                  >
                    <div className="flex items-start">
                      <input
                        type="radio"
                        name="deliveryMode"
                        value="livraison"
                        checked={deliveryMode === 'livraison'}
                        onChange={() => setDeliveryMode('livraison')}
                        className="mt-1 h-4 w-4 text-boulangerie-600 focus:ring-boulangerie-500 border-gray-300"
                      />
                      <div className="ml-3">
                        <span className="block text-sm font-medium text-gray-800">Livraison à domicile</span>
                        <span className="block text-xs text-gray-500 mt-1">Nous livrons à votre adresse</span>
                      </div>
                    </div>
                  </label>
                  
                  <label 
                    className={`block border rounded-lg p-4 cursor-pointer transition-all ${
                      deliveryMode === 'retrait'
                        ? 'border-boulangerie-500 bg-boulangerie-50 ring-2 ring-boulangerie-500/20'
                        : 'border-gray-200 hover:border-boulangerie-300'
                    }`}
                  >
                    <div className="flex items-start">
                      <input
                        type="radio"
                        name="deliveryMode"
                        value="retrait"
                        checked={deliveryMode === 'retrait'}
                        onChange={() => setDeliveryMode('retrait')}
                        className="mt-1 h-4 w-4 text-boulangerie-600 focus:ring-boulangerie-500 border-gray-300"
                      />
                      <div className="ml-3">
                        <span className="block text-sm font-medium text-gray-800">Retrait en boutique</span>
                        <span className="block text-xs text-gray-500 mt-1">Venez récupérer votre commande</span>
                      </div>
                    </div>
                  </label>
                </div>
                
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium mb-4">Récapitulatif de la commande</h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Sous-total</span>
                    <span>{formatPrice(etat.sousTotal || etat.total)}</span>
                  </div>
                  
                  {etat.reduction > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">Réduction</span>
                      <span className="text-green-600">-{formatPrice(etat.reduction)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{deliveryMode === 'livraison' ? 'Livraison' : 'Retrait en boutique'}</span>
                    <span className="text-green-600">Gratuit</span>
                  </div>
                  
                  <div className="pt-2 mt-2 border-t border-gray-100">
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span className="text-boulangerie-700">
                        {formatPrice(etat.total)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={prevStep}
                  className="w-1/3 bg-gray-100 text-gray-800 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Retour
                </button>
                
                <button
                  type="submit"
                  disabled={loading || etat.articles.length === 0}
                  className="w-2/3 bg-boulangerie-600 text-white py-3 rounded-lg hover:bg-boulangerie-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center font-medium"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Traitement...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-5 w-5" />
                      Passer la commande
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>

        <div className="px-6 pb-6 pt-2">
          <div className="flex flex-wrap justify-center gap-4 text-gray-500 text-xs mt-4">
            <div className="flex items-center">
              <ShieldCheck className="w-4 h-4 mr-1" />
              <span>Paiement sécurisé</span>
            </div>
            <div className="flex items-center">
              <Truck className="w-4 h-4 mr-1" />
              <span>Livraison rapide</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>Commande préparée à la demande</span>
            </div>
          </div>
        </div>
      </div>

      <PurchaseConfirmationPopup 
        isOpen={showPopup} 
        onClose={handleClosePopup}
        customerName={infoClient.nom}
      />
    </>
  );
};