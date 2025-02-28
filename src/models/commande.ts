import mongoose, { Document } from 'mongoose';
import { StatutCommande } from '@/types';

interface IHistorique {
  statut: StatutCommande;
  date: Date;
  commentaire?: string;
}

interface IProduitCommande {
  _id: mongoose.Types.ObjectId;
  nom: string;
  image?: string; 
  prix: number;
  quantite: number;
}

interface IInfoClient {
  nom: string;
  telephone: string;
  adresse: string;
}

interface ICommande extends Document {
  produits: IProduitCommande[];
  prixTotal: number;
  infoClient: IInfoClient;
  statut: StatutCommande;
  notes?: string;
  historique: IHistorique[];
  createdAt?: Date;
  updatedAt?: Date;
}

const schemaCommande = new mongoose.Schema({
  produits: [{
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Produit',
      required: true
    },
    nom: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: false 
    },
    prix: {
      type: Number,
      required: true
    },
    quantite: {
      type: Number,
      required: true,
      min: 1
    }
  }],
  prixTotal: {
    type: Number,
    required: true
  },
  infoClient: {
    nom: {
      type: String,
      required: true
    },
    telephone: {
      type: String,
      required: true
    },
    adresse: {
      type: String,
      required: true
    }
  },
  statut: {
    type: String,
    enum: ['en_attente', 'confirmee', 'annulee', 'en_preparation', 'prete', 'livree'],
    default: 'en_attente'
  },
  notes: {
    type: String,
    default: ''
  },
  historique: [{
    statut: {
      type: String,
      enum: ['en_attente', 'confirmee', 'annulee', 'en_preparation', 'prete', 'livree'],
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    commentaire: {
      type: String
    }
  }]
}, {
  timestamps: true
});

schemaCommande.pre<ICommande>('save', function(next) {
  if (!this.historique) {
    this.historique = [];
  }

  if (this.isNew || this.isModified('statut')) {
    this.historique.push({
      statut: this.statut,
      date: new Date(),
      commentaire: this.isNew ? 'Commande créée' : 'Statut mis à jour'
    });
  }

  next();
});

export const ModeleCommande = mongoose.models.Commande || mongoose.model<ICommande>('Commande', schemaCommande);