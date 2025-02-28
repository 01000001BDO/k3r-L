import mongoose from 'mongoose';

const schemaProduit = new mongoose.Schema({
  nom: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  images: [{
    type: String
  }],
  prix: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  ingredients: [{
    type: String,
    required: true
  }],
  categorie: {
    type: String,
    required: true,
    default: 'Non classé'
  },
  enPromotion: {
    type: Boolean,
    default: false
  },
  prixPromotion: {
    type: Number
  },
  enVedette: {
    type: Boolean, 
    default: false
  },
  disponible: {
    type: Boolean,
    default: true
  },
  dateDeMiseAJour: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export const ModeleProduit = mongoose.models.Produit || mongoose.model('Produit', schemaProduit);