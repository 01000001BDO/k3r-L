import { connecterDB } from '@/lib/db';
import { ModeleProduit } from '@/models/produit';
import { Produit } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import WelcomePopup from '@/components/WelcomePopup';

export default async function Accueil() {
  await connecterDB();
  const produitsMisEnAvant = await ModeleProduit.find({}).limit(4);
  const produitsFormatted = JSON.parse(JSON.stringify(produitsMisEnAvant));

  return (
    <>
      <WelcomePopup />
      
      <section className="relative h-screen">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1568254183919-78a4f43a2877?q=80&w=1600&auto=format&fit=crop" 
            alt="Boulangerie artisanale" 
            fill 
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30"></div>
        </div>
        
        <div className="absolute inset-0 flex flex-col justify-center items-start px-8 md:px-16 lg:px-24 pt-16 max-w-6xl">
          <div className="bg-boulangerie-600/10 backdrop-blur-sm px-6 py-2 rounded-full text-white text-sm font-medium mb-4 animate-fadeIn">
            Fait à la main, avec amour, chaque jour
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white leading-tight mb-6 animate-slideUp">
            Savourez l'Authenticité<br />de Notre Boulangerie
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mb-10 animate-slideUp animation-delay-300">
            Des créations artisanales cuites au feu de bois, préparées avec passion et savoir-faire depuis 1986.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 animate-slideUp animation-delay-600">
            <Link 
              href="/catalogue" 
              className="bg-boulangerie-500 hover:bg-boulangerie-600 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-all transform hover:translate-y-[-2px] hover:shadow-lg"
            >
              Découvrir nos produits
            </Link>
            <Link 
              href="#specialites" 
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/30 px-8 py-3 rounded-lg font-semibold text-lg transition-all"
            >
              Nos spécialités
            </Link>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-0 right-0 flex justify-center animate-bounce">
          <a href="#specialites" className="text-white/80 hover:text-white">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </a>
        </div>
      </section>
      
      <section id="specialites" className="py-20 md:py-28 px-4 bg-gradient-to-b from-white to-boulangerie-50">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <div>
              <div className="w-16 h-1 bg-boulangerie-500 mb-4"></div>
              <h2 className="text-3xl md:text-4xl font-display font-bold">
                Nos <span className="text-boulangerie-600">Spécialités</span>
              </h2>
              <p className="text-gray-600 mt-4 max-w-2xl">
                Découvrez nos créations les plus populaires, préparées chaque jour avec des ingrédients frais et de saison.
              </p>
            </div>
            <Link 
              href="/catalogue" 
              className="mt-6 md:mt-0 inline-flex items-center text-boulangerie-600 font-semibold group"
            >
              Voir tout le catalogue
              <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {produitsFormatted.length > 0 ? (
              produitsFormatted.map((produit: Produit) => (
                <div key={produit._id} className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300">
                  <div className="relative h-64 overflow-hidden">
                    <Image 
                      src={produit.image} 
                      alt={produit.nom} 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    {produit.enPromotion && produit.prixPromotion && (
                      <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Promo
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                      <div className="p-6 w-full">
                        <Link 
                          href={`/produits/${produit._id}`}
                          className="w-full text-center block text-white font-medium py-2 rounded-lg border border-white/30 backdrop-blur-sm hover:bg-white/20 transition-colors"
                        >
                          Voir le produit
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-serif font-semibold">{produit.nom}</h3>
                      <div className="flex flex-col items-end">
                        {produit.enPromotion && produit.prixPromotion ? (
                          <>
                            <span className="text-red-600 font-semibold">{produit.prixPromotion.toFixed(2)}€</span>
                            <span className="text-gray-500 line-through text-sm">{produit.prix.toFixed(2)}€</span>
                          </>
                        ) : (
                          <span className="text-boulangerie-600 font-semibold">{produit.prix.toFixed(2)}€</span>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-600 mt-3 line-clamp-2">{produit.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-4 text-center py-10">
                <p className="text-gray-500 mb-4">Aucun produit n'est disponible pour le moment.</p>
                <Link 
                  href="/catalogue" 
                  className="inline-block bg-boulangerie-500 text-white px-6 py-2 rounded-lg hover:bg-boulangerie-600 transition-colors"
                >
                  Voir le catalogue complet
                </Link>
              </div>
            )}
          </div>
          
          <div className="text-center mt-16">
            <Link 
              href="/catalogue" 
              className="inline-block border-2 border-boulangerie-500 text-boulangerie-600 hover:bg-boulangerie-500 hover:text-white px-8 py-3 rounded-lg font-semibold transition-all transform hover:translate-y-[-2px] hover:shadow-lg"
            >
              Voir tous nos produits
            </Link>
          </div>
        </div>
      </section>
      
      <section className="py-20 bg-boulangerie-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <div className="w-16 h-1 bg-boulangerie-500 mb-4"></div>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">Notre <span className="text-boulangerie-600">Philosophie</span></h2>
              <p className="text-lg leading-relaxed text-gray-700 mb-6">
                Depuis trois générations, notre boulangerie s'engage à utiliser des ingrédients de première qualité, des méthodes traditionnelles et un savoir-faire transmis de père en fils.
              </p>
              <p className="text-lg leading-relaxed text-gray-700 mb-8">
                Chaque produit qui sort de notre four est le résultat d'un travail minutieux et d'une passion inébranlable pour l'art de la boulangerie.
              </p>
              <Link 
                href="/a-propos" 
                className="inline-flex items-center text-boulangerie-700 font-semibold group"
              >
                En savoir plus sur notre histoire
                <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </Link>
            </div>
            <div className="lg:w-1/2 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md transform hover:translate-y-[-5px] transition-transform hover:shadow-lg">
                <div className="w-16 h-16 bg-boulangerie-500 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Qualité</h3>
                <p className="text-gray-600">Des ingrédients frais et naturels sélectionnés avec soin.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md transform hover:translate-y-[-5px] transition-transform hover:shadow-lg">
                <div className="w-16 h-16 bg-boulangerie-500 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Tradition</h3>
                <p className="text-gray-600">Des recettes traditionnelles transmises de génération en génération.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md transform hover:translate-y-[-5px] transition-transform hover:shadow-lg">
                <div className="w-16 h-16 bg-boulangerie-500 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Passion</h3>
                <p className="text-gray-600">L'amour du métier et le souci du détail dans chaque création.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="w-16 h-1 bg-boulangerie-500 mx-auto mb-4"></div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-16">Ce que disent <span className="text-boulangerie-600">nos clients</span></h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="text-boulangerie-500">
                  <svg className="w-5 h-5 inline-block" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                  <svg className="w-5 h-5 inline-block" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                  <svg className="w-5 h-5 inline-block" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                  <svg className="w-5 h-5 inline-block" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                  <svg className="w-5 h-5 inline-block" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                </div>
              </div>
              <p className="text-gray-700 italic mb-6">"Le meilleur pain que j'ai jamais goûté ! La croûte croustillante et la mie aérée sont simplement parfaites. C'est devenu mon rendez-vous quotidien."</p>
              <div className="flex items-center">
                <div className="font-medium">Marie D.</div>
                <span className="mx-2 text-gray-400">•</span>
                <div className="text-gray-500 text-sm">Cliente fidèle</div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="text-boulangerie-500">
                  <svg className="w-5 h-5 inline-block" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                  <svg className="w-5 h-5 inline-block" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                  <svg className="w-5 h-5 inline-block" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                  <svg className="w-5 h-5 inline-block" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                  <svg className="w-5 h-5 inline-block" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                </div>
              </div>
              <p className="text-gray-700 italic mb-6">"Leurs viennoiseries sont incomparables ! Les croissants sont dignes des meilleures boulangeries parisiennes. Service impeccable et souriant."</p>
              <div className="flex items-center">
                <div className="font-medium">Thomas L.</div>
                <span className="mx-2 text-gray-400">•</span>
                <div className="text-gray-500 text-sm">Critique culinaire</div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="text-boulangerie-500">
                  <svg className="w-5 h-5 inline-block" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                  <svg className="w-5 h-5 inline-block" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                  <svg className="w-5 h-5 inline-block" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                  <svg className="w-5 h-5 inline-block" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                  <svg className="w-5 h-5 inline-block" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                </div>
              </div>
              <p className="text-gray-700 italic mb-6">"J'ai commandé un gâteau d'anniversaire et il était non seulement magnifique mais aussi délicieux. Toute la famille a adoré. Merci pour ce moment mémorable !"</p>
              <div className="flex items-center">
                <div className="font-medium">Sophie B.</div>
                <span className="mx-2 text-gray-400">•</span>
                <div className="text-gray-500 text-sm">Cliente satisfaite</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-boulangerie-600 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold mb-2">Restez informé de nos nouveautés</h2>
              <p className="text-white/80">Recevez nos offres spéciales et nos dernières créations</p>
            </div>
            <div className="mt-6 md:mt-0">
              <div className="flex flex-col sm:flex-row gap-3">
                <input type="email" placeholder="Votre adresse email" className="px-4 py-3 rounded-lg focus:outline-none text-gray-800 min-w-[250px]" />
                <button className="bg-white text-boulangerie-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  S'inscrire
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}