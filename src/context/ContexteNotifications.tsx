'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Commande } from '@/types';
import { toast } from 'react-hot-toast';

interface ContexteNotificationsType {
  nouvellesCommandes: number;
  setNouvellesCommandes: (count: number) => void;
  marquerCommandesVues: () => void;
  ajouterNouvelleCommande: (commande: Commande) => void;
  derniereCommande: Commande | null;
  commandesRecentes: Commande[];
  supprimerCommande: (commandeId: string) => Promise<boolean>;
  supprimerToutesCommandes: () => Promise<boolean>;
}

const ContexteNotifications = createContext<ContexteNotificationsType | null>(null);

export const FournisseurNotifications = ({ children }: { children: ReactNode }) => {
  const [nouvellesCommandes, setNouvellesCommandes] = useState(0);
  const [derniereCommande, setDerniereCommande] = useState<Commande | null>(null);
  const [commandesRecentes, setCommandesRecentes] = useState<Commande[]>([]);
  const [userInteracted, setUserInteracted] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  useEffect(() => {
    const handleInteraction = () => {
      setUserInteracted(true);      
      if (!audioContext) {
        try {
          const context = new (window.AudioContext || (window as any).webkitAudioContext)();
          setAudioContext(context);
        } catch (e) {
          console.error('Erreur lors de la création de l\'AudioContext:', e);
        }
      }
    };
    
    window.addEventListener('click', handleInteraction);
    window.addEventListener('keydown', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);
    
    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };
  }, [audioContext]);

  useEffect(() => {
    const commandesNonLues = localStorage.getItem('commandesNonLues');
    if (commandesNonLues) {
      setNouvellesCommandes(parseInt(commandesNonLues, 10));
    }
    
    const storedCommandes = localStorage.getItem('commandesRecentes');
    if (storedCommandes) {
      try {
        setCommandesRecentes(JSON.parse(storedCommandes));
      } catch (e) {
        console.error('Erreur lors de la récupération des commandes récentes:', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('commandesNonLues', nouvellesCommandes.toString());
  }, [nouvellesCommandes]);

  useEffect(() => {
    localStorage.setItem('commandesRecentes', JSON.stringify(commandesRecentes));
  }, [commandesRecentes]);

  const playNotificationSound = () => {
    if (!audioContext || !userInteracted) return;
    
    try {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);      
      oscillator.type = 'sine'; 
      oscillator.frequency.setValueAtTime(830, audioContext.currentTime); 
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
      gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.5);
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
      console.error('Erreur lors de la lecture du son:', e);
    }
  };

  useEffect(() => {
    const verifierNouvellesCommandes = async () => {
      try {
        const response = await fetch('/api/commandes/nouvelles');
        if (response.ok) {
          const data = await response.json();
          
          if (data.nouvellesCommandes && data.nouvellesCommandes.length > 0) {
            setNouvellesCommandes(prev => prev + data.nouvellesCommandes.length);            
            data.nouvellesCommandes.forEach((commande: Commande) => {
              playNotificationSound();              
              toast.custom((t) => (
                <div
                  className={`${
                    t.visible ? 'animate-enter' : 'animate-leave'
                  } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex`}
                >
                  <div className="flex-1 p-4">
                    <div className="flex items-start">
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          Nouvelle commande reçue
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          {commande.infoClient.nom} a passé une commande de {commande.prixTotal?.toFixed(2)}€
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex border-l border-gray-200">
                    <button
                      onClick={() => toast.dismiss(t.id)}
                      className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none"
                    >
                      Fermer
                    </button>
                  </div>
                </div>
              ), {
                duration: 5000,
              });
            });
            
            if (data.nouvellesCommandes.length > 0) {
              setCommandesRecentes(prev => [...data.nouvellesCommandes, ...prev].slice(0, 10));
              setDerniereCommande(data.nouvellesCommandes[0]);
            }
          }
        }
      } catch (error) {
        console.error('Erreur lors de la vérification des nouvelles commandes:', error);
      }
    };

    verifierNouvellesCommandes();
    const interval = setInterval(verifierNouvellesCommandes, 30000);
    
    return () => clearInterval(interval);
  }, [userInteracted, audioContext]);

  const marquerCommandesVues = () => {
    setNouvellesCommandes(0);
  };

  const ajouterNouvelleCommande = (commande: Commande) => {
    setNouvellesCommandes(prev => prev + 1);
    setDerniereCommande(commande);
    setCommandesRecentes(prev => [commande, ...prev].slice(0, 10));
   
    playNotificationSound();
   
    toast.custom((t) => (
      <div
        className={`${
          t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex`}
      >
        <div className="flex-1 p-4">
          <div className="flex items-start">
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">
                Nouvelle commande reçue
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {commande.infoClient.nom} a passé une commande de {commande.prixTotal?.toFixed(2)}€
              </p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-gray-200">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none"
          >
            Fermer
          </button>
        </div>
      </div>
    ), {
      duration: 5000,
    });
  };

  const supprimerCommande = async (commandeId: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/commandes/${commandeId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de la commande');
      }

      setCommandesRecentes(prev => prev.filter(cmd => cmd._id !== commandeId));
      
      if (derniereCommande && derniereCommande._id === commandeId) {
        setDerniereCommande(null);
      }
      
      return true;
    } catch (error) {
      console.error('Erreur:', error);
      return false;
    }
  };

  const supprimerToutesCommandes = async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/commandes', {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression des commandes');
      }

      setCommandesRecentes([]);
      setDerniereCommande(null);
      setNouvellesCommandes(0);
      
      return true;
    } catch (error) {
      console.error('Erreur:', error);
      return false;
    }
  };

  return (
    <ContexteNotifications.Provider value={{
      nouvellesCommandes,
      setNouvellesCommandes,
      marquerCommandesVues,
      ajouterNouvelleCommande,
      derniereCommande,
      commandesRecentes,
      supprimerCommande,
      supprimerToutesCommandes
    }}>
      {children}
    </ContexteNotifications.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(ContexteNotifications);
  if (!context) {
    throw new Error('useNotifications doit être utilisé avec FournisseurNotifications');
  }
  return context;
};