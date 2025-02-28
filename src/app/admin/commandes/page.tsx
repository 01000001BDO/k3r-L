'use client';

import { useState, useEffect } from 'react';
import { Commande, StatutCommande } from '@/types';
import { toast } from 'react-hot-toast';
import { useNotifications } from '@/context/ContexteNotifications';
import Image from 'next/image';
import Link from 'next/link';

interface HistoriqueEvent {
  statut: StatutCommande;
  date: string;
  commentaire?: string;
}

const defaultImageUrl = 'https://blackbuckmarketing.com/wp-content/uploads/2016/11/RED.jpg'; 

export default function CommandesPage() {
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [filtreStatus, setFiltreStatus] = useState<string>('tous');
  const [loading, setLoading] = useState(true);
  const { marquerCommandesVues } = useNotifications();
  const [commandeSelectionnee, setCommandeSelectionnee] = useState<Commande | null>(null);
  const [mettreAJourStatut, setMettreAJourStatut] = useState<StatutCommande | ''>('');
  const [commentaire, setCommentaire] = useState('');
  const [statutEnCours, setStatutEnCours] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(null);
  const [deleteInProgress, setDeleteInProgress] = useState(false);

  useEffect(() => {
    const chargerCommandes = async () => {
      try {
        const response = await fetch('/api/commandes');
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des commandes');
        }
        const data = await response.json();
        setCommandes(data);
      } catch (error) {
        console.error('Erreur:', error);
        toast.error('Impossible de charger les commandes');
      } finally {
        setLoading(false);
      }
    };

    chargerCommandes();
    marquerCommandesVues();
  }, [marquerCommandesVues]);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Date inconnue';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const calculerTotal = (commande: Commande) => {
    return commande.produits.reduce((total, item) => total + (item.prix * item.quantite), 0);
  };

  const getBadgeClass = (statut: StatutCommande | string = 'en_attente') => {
    switch (statut) {
      case 'en_attente':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmee':
        return 'bg-blue-100 text-blue-800';
      case 'annulee':
        return 'bg-red-100 text-red-800';
      case 'en_preparation':
        return 'bg-purple-100 text-purple-800';
      case 'prete':
        return 'bg-green-100 text-green-800';
      case 'livree':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatutLabel = (statut: StatutCommande | string = 'en_attente') => {
    switch (statut) {
      case 'en_attente':
        return 'En attente';
      case 'confirmee':
        return 'Confirmée';
      case 'annulee':
        return 'Annulée';
      case 'en_preparation':
        return 'En préparation';
      case 'prete':
        return 'Prête';
      case 'livree':
        return 'Livrée';
      default:
        return 'Inconnu';
    }
  };

  const filtrerCommandes = () => {
    if (filtreStatus === 'tous') {
      return commandes;
    }
    return commandes.filter(commande => commande.statut === filtreStatus);
  };

  const updateStatutCommande = async () => {
    if (!commandeSelectionnee || !mettreAJourStatut) return;
    
    setStatutEnCours(true);
    
    try {
      const response = await fetch(`/api/commandes/${commandeSelectionnee._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          statut: mettreAJourStatut,
          commentaire: commentaire || `Statut changé à "${getStatutLabel(mettreAJourStatut)}"`
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la mise à jour du statut');
      }

      const commandeMiseAJour = await response.json();
      
      setCommandes(prev => 
        prev.map(c => c._id === commandeMiseAJour._id ? commandeMiseAJour : c)
      );
      setCommandeSelectionnee(commandeMiseAJour);
      
      toast.success(`Statut mis à jour avec succès: ${getStatutLabel(mettreAJourStatut)}`);
      
      setMettreAJourStatut('');
      setCommentaire('');
    } catch (error) {
      console.error('Erreur:', error);
      toast.error(error instanceof Error ? error.message : 'Échec de la mise à jour du statut');
    } finally {
      setStatutEnCours(false);
    }
  };

  const deleteCommande = async (commandeId: string) => {
    setDeleteInProgress(true);
    
    try {
      const response = await fetch(`/api/commandes/${commandeId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la suppression de la commande');
      }

      setCommandes(prev => prev.filter(c => c._id !== commandeId));
      
      if (commandeSelectionnee && commandeSelectionnee._id === commandeId) {
        setCommandeSelectionnee(null);
      }
      
      toast.success('Commande supprimée avec succès');
    } catch (error) {
      console.error('Erreur:', error);
      toast.error(error instanceof Error ? error.message : 'Échec de la suppression de la commande');
    } finally {
      setDeleteInProgress(false);
      setDeleteConfirmation(null);
    }
  };

  const deleteAllCommandes = async () => {
    setDeleteInProgress(true);
    
    try {
      const response = await fetch('/api/commandes', {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la suppression des commandes');
      }

      setCommandes([]);
      setCommandeSelectionnee(null);
      
      toast.success('Toutes les commandes ont été supprimées');
    } catch (error) {
      console.error('Erreur:', error);
      toast.error(error instanceof Error ? error.message : 'Échec de la suppression des commandes');
    } finally {
      setDeleteInProgress(false);
      setDeleteConfirmation(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-boulangerie-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold font-serif mb-6">Gestion des Commandes</h1>
      
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div>
          <label htmlFor="filtreStatus" className="text-sm font-medium text-gray-700 mr-2">
            Filtrer par statut:
          </label>
          <select
            id="filtreStatus"
            value={filtreStatus}
            onChange={(e) => setFiltreStatus(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-boulangerie-500 focus:border-boulangerie-500"
          >
            <option value="tous">Tous les statuts</option>
            <option value="en_attente">En attente</option>
            <option value="confirmee">Confirmée</option>
            <option value="annulee">Annulée</option>
            <option value="en_preparation">En préparation</option>
            <option value="prete">Prête</option>
            <option value="livree">Livrée</option>
          </select>
        </div>
        
        <div className="flex-grow"></div>
        
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">
            {commandes.length} commande{commandes.length !== 1 ? 's' : ''} au total
          </div>
          
          {commandes.length > 0 && (
            <button
              onClick={() => setDeleteConfirmation('all')}
              className="bg-red-600 text-white py-1.5 px-3 rounded text-sm hover:bg-red-700 transition"
            >
              Supprimer tout
            </button>
          )}
        </div>
      </div>
      
      {deleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Confirmation de suppression</h3>
            <p>
              {deleteConfirmation === 'all' 
                ? 'Êtes-vous sûr de vouloir supprimer toutes les commandes ? Cette action est irréversible.' 
                : 'Êtes-vous sûr de vouloir supprimer cette commande ? Cette action est irréversible.'
              }
            </p>
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setDeleteConfirmation(null)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                disabled={deleteInProgress}
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  if (deleteConfirmation === 'all') {
                    deleteAllCommandes();
                  } else {
                    deleteCommande(deleteConfirmation);
                  }
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-red-400"
                disabled={deleteInProgress}
              >
                {deleteInProgress ? 'Suppression...' : 'Confirmer'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {commandes.length === 0 ? (
          <div className="p-6 text-center">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
            <p className="text-gray-500 mb-4">Aucune commande n'a été passée pour le moment.</p>
            <Link 
              href="/" 
              className="text-boulangerie-600 hover:text-boulangerie-800 underline"
              target="_blank"
            >
              Consulter le catalogue
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3">
            <div className="lg:col-span-1 border-r">
              <div className="p-4 bg-gray-50 border-b">
                <h2 className="font-semibold text-gray-700">Liste des commandes</h2>
              </div>
              <div className="divide-y max-h-[70vh] overflow-y-auto">
                {filtrerCommandes().map((commande) => (
                  <div 
                    key={commande._id}
                    className="relative"
                  >
                    <div
                      className={`p-4 cursor-pointer hover:bg-gray-50 ${commandeSelectionnee?._id === commande._id ? 'bg-gray-100' : ''}`}
                      onClick={() => setCommandeSelectionnee(commande)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{commande.infoClient.nom}</p>
                          <p className="text-sm text-gray-500">{formatDate(commande.createdAt || '')}</p>
                        </div>
                        <span className={`text-sm px-2 py-1 rounded-full ${getBadgeClass(commande.statut)}`}>
                          {getStatutLabel(commande.statut)}
                        </span>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          {commande.produits.length} {commande.produits.length > 1 ? 'articles' : 'article'}
                        </p>
                        <p className="font-semibold">{calculerTotal(commande).toFixed(2)}€</p>
                      </div>
                    </div>
                    <button
                      className="absolute top-2 right-2 text-gray-400 hover:text-red-600 p-1 rounded-full hover:bg-gray-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirmation(commande._id);
                      }}
                      title="Supprimer cette commande"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2">
              {commandeSelectionnee ? (
                <div>
                  <div className="p-6 bg-white border-b">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-semibold">
                          Commande #{commandeSelectionnee._id.substring(commandeSelectionnee._id.length - 6)}
                        </h2>
                        <p className="text-gray-500">
                          Passée le {formatDate(commandeSelectionnee.createdAt || '')}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getBadgeClass(commandeSelectionnee.statut)}`}>
                        {getStatutLabel(commandeSelectionnee.statut)}
                      </span>
                    </div>
                    
                    <div className="mt-6 p-4 border rounded-lg bg-gray-50">
                      <h3 className="font-medium mb-2">Mettre à jour le statut</h3>
                      <div className="flex flex-col space-y-3">
                        <select
                          value={mettreAJourStatut}
                          onChange={(e) => setMettreAJourStatut(e.target.value as StatutCommande)}
                          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-boulangerie-500 focus:border-boulangerie-500"
                        >
                          <option value="">Sélectionner un statut</option>
                          <option value="confirmee">Confirmer</option>
                          <option value="annulee">Annuler</option>
                          <option value="en_preparation">Marquer en préparation</option>
                          <option value="prete">Marquer comme prête</option>
                          <option value="livree">Marquer comme livrée</option>
                        </select>
                        
                        <textarea
                          placeholder="Commentaire (optionnel)"
                          value={commentaire}
                          onChange={(e) => setCommentaire(e.target.value)}
                          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-boulangerie-500 focus:border-boulangerie-500"
                          rows={2}
                        ></textarea>
                        
                        <button
                          onClick={updateStatutCommande}
                          disabled={!mettreAJourStatut || statutEnCours}
                          className="bg-boulangerie-600 text-white py-2 px-4 rounded hover:bg-boulangerie-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                          {statutEnCours ? 'Mise à jour...' : 'Mettre à jour le statut'}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="font-semibold mb-4">Articles commandés</h3>
                    <div className="space-y-4 mb-8">
                      {commandeSelectionnee.produits.map((item, index) => (
                        <div key={index} className="flex items-center gap-4 border-b pb-4">
                          <div className="relative w-16 h-16 flex-shrink-0">
*                            {item.image ? (
                              <Image
                                src={item.image}
                                alt={item.nom}
                                fill
                                className="object-cover rounded"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = defaultImageUrl;
                                }}
                              />
                            ) : (
                              <Image
                                src={defaultImageUrl}
                                alt={item.nom}
                                fill
                                className="object-cover rounded"
                              />
                            )}
                          </div>
                          <div className="flex-grow">
                            <h4 className="font-medium">{item.nom}</h4>
                            <p className="text-sm text-gray-500">
                              {item.quantite} x {item.prix.toFixed(2)}€
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{(item.prix * item.quantite).toFixed(2)}€</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between mb-2">
                        <span>Sous-total</span>
                        <span>{calculerTotal(commandeSelectionnee).toFixed(2)}€</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span>Frais de livraison</span>
                        <span>Gratuit</span>
                      </div>
                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between font-semibold">
                          <span>Total</span>
                          <span>{calculerTotal(commandeSelectionnee).toFixed(2)}€</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h3 className="font-semibold mb-4">Informations du client</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="mb-2">
                          <span className="font-medium">Nom:</span> {commandeSelectionnee.infoClient.nom}
                        </p>
                        <p className="mb-2">
                          <span className="font-medium">Téléphone:</span> {commandeSelectionnee.infoClient.telephone}
                        </p>
                        <p>
                          <span className="font-medium">Adresse:</span> {commandeSelectionnee.infoClient.adresse}
                        </p>
                      </div>
                    </div>

                    {/* Historique de la commande */}
                    {commandeSelectionnee.historique && commandeSelectionnee.historique.length > 0 && (
                      <div className="mt-6">
                        <h3 className="font-semibold mb-4">Historique</h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="border-l-2 border-gray-300 pl-4 space-y-4">
                            {commandeSelectionnee.historique.map((event: HistoriqueEvent, index: number) => (
                              <div key={index} className="relative">
                                <div className="absolute -left-6 mt-1 w-2 h-2 rounded-full bg-gray-400"></div>
                                <p className="text-sm font-medium">
                                  {getStatutLabel(event.statut)}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {formatDate(event.date)}
                                </p>
                                {event.commentaire && (
                                  <p className="text-sm text-gray-600 mt-1">
                                    {event.commentaire}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="mt-6 flex space-x-4">
                      <button 
                        onClick={() => window.print()}
                        className="bg-gray-200 text-gray-700 py-2 px-4 rounded hover:bg-gray-300 flex items-center"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
                        </svg>
                        Imprimer
                      </button>
                      
                      <button 
                        onClick={() => setDeleteConfirmation(commandeSelectionnee._id)}
                        className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 flex items-center"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center p-6 text-gray-500">
                  Sélectionnez une commande pour voir les détails
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}