import Link from 'next/link';

export default function PageConfirmation() {
  return (
    <div className="container mx-auto px-4 py-24 text-center">
      <div className="bg-white p-10 rounded-lg shadow-lg max-w-md mx-auto">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        
        <h1 className="text-3xl font-serif font-bold text-boulangerie-800 mb-4">
          Commande Confirmée !
        </h1>
        
        <p className="text-gray-600 mb-8">
          Merci pour votre commande. Nous vous contacterons bientôt pour confirmer les détails de la livraison.
        </p>
        
        <div className="bg-boulangerie-50 border border-boulangerie-200 rounded-lg p-4 mb-8">
          <p className="text-sm text-boulangerie-700">
            Un récapitulatif de votre commande a été envoyé à votre adresse email.
          </p>
        </div>
        
        <Link
          href="/"
          className="inline-block bg-boulangerie-600 text-white px-6 py-3 rounded-lg hover:bg-boulangerie-700 transition-colors"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}