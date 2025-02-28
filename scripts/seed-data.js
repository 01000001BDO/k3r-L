const mongoose = require('mongoose');
require('dotenv').config();

const produitSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  image: { type: String, required: true },
  images: [{ type: String }],
  prix: { type: Number, required: true },
  description: { type: String, required: true },
  ingredients: [{ type: String, required: true }],
  categorie: { type: String, required: true, default: 'Non classé' },
  enPromotion: { type: Boolean, default: false },
  prixPromotion: { type: Number },
  enVedette: { type: Boolean, default: false },
  disponible: { type: Boolean, default: true },
  dateDeMiseAJour: { type: Date, default: Date.now }
}, { timestamps: true });

const Produit = mongoose.model('Produit', produitSchema);

const categories = [
  'Pains', 
  'Viennoiseries', 
  'Pâtisseries',
  'Salés',
  'Spécialités'
];

const produitsTest = [
  {
    nom: "Pain de Campagne",
    image: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?q=80&w=1000",
    images: [
      "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?q=80&w=1000",
      "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?q=80&w=1000",
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1000"
    ],
    prix: 4.50,
    description: "Un pain rustique à la mie dense et au goût légèrement acidulé. Sa croûte épaisse et croustillante en fait un accompagnement parfait pour les plats en sauce.",
    ingredients: ["Farine T65", "Levain", "Sel de Guérande", "Eau"],
    categorie: "Pains",
    enPromotion: false,
    enVedette: true,
    disponible: true,
    dateDeMiseAJour: new Date()
  },
  {
    nom: "Baguette Tradition",
    image: "https://images.unsplash.com/photo-1597079910443-60c43fc5b7b3?q=80&w=1000",
    images: [
      "https://images.unsplash.com/photo-1597079910443-60c43fc5b7b3?q=80&w=1000",
      "https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=1000"
    ],
    prix: 1.20,
    description: "Notre baguette tradition est fabriquée selon les méthodes artisanales avec une longue fermentation qui lui confère son goût unique et sa mie alvéolée.",
    ingredients: ["Farine de blé", "Eau", "Sel", "Levure"],
    categorie: "Pains",
    enPromotion: false,
    enVedette: false,
    disponible: true,
    dateDeMiseAJour: new Date()
  },
  {
    nom: "Croissant au Beurre",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1000",
    images: [
      "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1000",
      "https://images.unsplash.com/photo-1592151821827-a6b5cecfd2dc?q=80&w=1000"
    ],
    prix: 1.80,
    description: "Un croissant pur beurre, feuilleté à la main et cuit jusqu'à obtenir une couleur dorée parfaite. Croustillant à l'extérieur et moelleux à l'intérieur.",
    ingredients: ["Farine", "Beurre AOP", "Sucre", "Levure", "Lait", "Œufs fermiers"],
    categorie: "Viennoiseries",
    enPromotion: true,
    prixPromotion: 1.50,
    enVedette: true,
    disponible: true,
    dateDeMiseAJour: new Date()
  },
  {
    nom: "Pain au Chocolat",
    image: "https://images.unsplash.com/photo-1623334044303-241021148842?q=80&w=1000",
    images: [
      "https://images.unsplash.com/photo-1623334044303-241021148842?q=80&w=1000",
      "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?q=80&w=1000"
    ],
    prix: 1.90,
    description: "Notre pain au chocolat est préparé avec une pâte feuilletée pur beurre et deux barres de chocolat noir de qualité supérieure.",
    ingredients: ["Farine", "Beurre", "Chocolat noir 70%", "Sucre", "Levure", "Lait", "Œufs"],
    categorie: "Viennoiseries",
    enPromotion: false,
    enVedette: false,
    disponible: true,
    dateDeMiseAJour: new Date()
  },
  {
    nom: "Tarte aux Pommes",
    image: "https://images.unsplash.com/photo-1562007908-17c67e878c88?q=80&w=1000",
    images: [
      "https://images.unsplash.com/photo-1562007908-17c67e878c88?q=80&w=1000",
      "https://images.unsplash.com/photo-1567341900266-5e1eaba2b4cf?q=80&w=1000",
      "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?q=80&w=1000"
    ],
    prix: 15.50,
    description: "Une délicieuse tarte aux pommes sur une base de pâte sablée, garnie de pommes fraîches caramélisées et d'une touche de cannelle.",
    ingredients: ["Farine", "Beurre", "Sucre", "Œufs", "Pommes Golden", "Cannelle", "Vanille"],
    categorie: "Pâtisseries",
    enPromotion: false,
    enVedette: false,
    disponible: true,
    dateDeMiseAJour: new Date()
  },
  {
    nom: "Éclair au Chocolat",
    image: "https://images.unsplash.com/photo-1626803775151-61d756612f97?q=80&w=1000",
    images: [
      "https://images.unsplash.com/photo-1626803775151-61d756612f97?q=80&w=1000",
      "https://images.unsplash.com/photo-1505476656656-bfd4c1c1d102?q=80&w=1000"
    ],
    prix: 3.80,
    description: "Un éclair garni d'une crème pâtissière au chocolat noir intense et recouvert d'un glaçage brillant au chocolat.",
    ingredients: ["Farine", "Beurre", "Œufs", "Chocolat noir", "Crème fraîche", "Sucre", "Lait"],
    categorie: "Pâtisseries",
    enPromotion: false,
    enVedette: false,
    disponible: true,
    dateDeMiseAJour: new Date()
  },
  {
    nom: "Fougasse aux Olives",
    image: "https://images.unsplash.com/photo-1596872158548-4dd4718d853e?q=80&w=1000",
    images: [
      "https://images.unsplash.com/photo-1596872158548-4dd4718d853e?q=80&w=1000",
      "https://images.unsplash.com/photo-1623057000049-e220f44dfc3a?q=80&w=1000"
    ],
    prix: 3.50,
    description: "Une spécialité du Sud, cette fougasse est garnie d'olives noires et d'herbes de Provence pour un goût méditerranéen.",
    ingredients: ["Farine", "Huile d'olive", "Olives noires", "Herbes de Provence", "Sel", "Levure"],
    categorie: "Salés",
    enPromotion: true,
    prixPromotion: 2.95,
    enVedette: true,
    disponible: true,
    dateDeMiseAJour: new Date()
  },
  {
    nom: "Paris-Brest",
    image: "https://images.unsplash.com/photo-1634118520179-0c78b72df69a?q=80&w=1000",
    images: [
      "https://images.unsplash.com/photo-1634118520179-0c78b72df69a?q=80&w=1000",
      "https://images.unsplash.com/photo-1587314168485-3236d6710123?q=80&w=1000"
    ],
    prix: 4.90,
    description: "Un grand classique de la pâtisserie française avec sa pâte à choux croustillante garnie d'une crème pralinée aux noisettes.",
    ingredients: ["Farine", "Beurre", "Œufs", "Noisettes", "Crème", "Sucre", "Praliné"],
    categorie: "Pâtisseries",
    enPromotion: false,
    enVedette: true,
    disponible: true,
    dateDeMiseAJour: new Date()
  },
  {
    nom: "Quiche Lorraine",
    image: "https://images.unsplash.com/photo-1629536633161-9837d10d7e04?q=80&w=1000",
    images: [
      "https://images.unsplash.com/photo-1629536633161-9837d10d7e04?q=80&w=1000",
      "https://images.unsplash.com/photo-1559717201-2879521b49f4?q=80&w=1000"
    ],
    prix: 4.20,
    description: "Une tarte salée traditionnelle avec une garniture crémeuse aux lardons et à la crème fraîche. Un classique de la cuisine française.",
    ingredients: ["Farine", "Beurre", "Œufs", "Lardons", "Crème fraîche", "Lait", "Muscade"],
    categorie: "Salés",
    enPromotion: false,
    enVedette: false,
    disponible: true,
    dateDeMiseAJour: new Date()
  },
  {
    nom: "Pain aux Céréales",
    image: "https://images.unsplash.com/photo-1530610476181-d83430b64dcd?q=80&w=1000",
    images: [
      "https://images.unsplash.com/photo-1530610476181-d83430b64dcd?q=80&w=1000",
      "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1000"
    ],
    prix: 3.90,
    description: "Un pain complet riche en fibres et en saveurs, garni de graines variées qui lui donnent un goût délicieusement rustique.",
    ingredients: ["Farine complète", "Graines de tournesol", "Graines de lin", "Graines de courge", "Levain", "Sel", "Eau"],
    categorie: "Pains",
    enPromotion: false,
    enVedette: false,
    disponible: true,
    dateDeMiseAJour: new Date()
  },
  {
    nom: "Tarte au Citron Meringuée",
    image: "https://images.unsplash.com/photo-1566121933407-3c7ccdd26763?q=80&w=1000",
    images: [
      "https://images.unsplash.com/photo-1566121933407-3c7ccdd26763?q=80&w=1000",
      "https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?q=80&w=1000"
    ],
    prix: 4.50,
    description: "Un équilibre parfait entre l'acidité du citron et la douceur de la meringue croustillante. Cette tarte légère est idéale en dessert.",
    ingredients: ["Farine", "Beurre", "Œufs", "Sucre", "Citrons", "Crème"],
    categorie: "Pâtisseries",
    enPromotion: true,
    prixPromotion: 3.80,
    enVedette: false,
    disponible: true,
    dateDeMiseAJour: new Date()
  },
  {
    nom: "Mille-feuille",
    image: "https://images.unsplash.com/photo-1624299831638-82c15175eef4?q=80&w=1000",
    images: [
      "https://images.unsplash.com/photo-1624299831638-82c15175eef4?q=80&w=1000",
      "https://images.unsplash.com/photo-1519915028121-7d3463d5b1ff?q=80&w=1000"
    ],
    prix: 4.70,
    description: "Ce dessert classique français se compose de trois couches de pâte feuilletée croustillante séparées par deux couches de crème pâtissière vanillée.",
    ingredients: ["Pâte feuilletée", "Lait", "Œufs", "Sucre", "Vanille", "Beurre", "Sucre glace"],
    categorie: "Pâtisseries",
    enPromotion: false,
    enVedette: false,
    disponible: true,
    dateDeMiseAJour: new Date()
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connexion à MongoDB réussie');
    await Produit.deleteMany({});
    console.log('Collection nettoyée');
    await Produit.insertMany(produitsTest);
    console.log('Données insérées avec succès');
    await mongoose.connection.close();
    console.log('Connexion fermée');
  } catch (error) {
    console.error('Erreur lors du peuplement de la base de données:', error);
  }
}

seedDatabase();