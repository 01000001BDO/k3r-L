'use client';

import Link from 'next/link';
import { usePanier } from '@/context/ContextePanier';
import { useEffect, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export const Navigation = () => {
  const { etat } = usePanier();
  const [adminConnecte, setAdminConnecte] = useState(false);
  const [menuOuvert, setMenuOuvert] = useState(false);
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [navVisible, setNavVisible] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const estConnecte = sessionStorage.getItem('adminConnecte') === 'true';
    setAdminConnecte(estConnecte);

    const handleScroll = () => {
      const currentScrollTop = window.scrollY;
      setScrolled(currentScrollTop > 10);      
      if (currentScrollTop > lastScrollTop && currentScrollTop > 100) {
        setNavVisible(false);
      } else {
        setNavVisible(true);
      }
      
      setLastScrollTop(currentScrollTop);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollTop]);

  useEffect(() => {
    setMenuOuvert(false);
  }, [pathname]);

  const nbTotalArticles = useCallback(() => {
    return etat.articles.reduce((total, article) => total + article.quantite, 0);
  }, [etat.articles]);

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  if (!mounted) {
    return null;
  }

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      } ${navVisible ? 'transform translate-y-0' : 'transform -translate-y-full'}`}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center group">
              <span className="font-serif text-2xl font-bold text-boulangerie-700">
                Boulangerie <span className="text-boulangerie-500">Artisanale</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className={`font-semibold relative ${
                pathname === '/' ? 'text-boulangerie-600' : 'text-gray-700 hover:text-boulangerie-500'
              } transition-colors group`}>
                Accueil
                <span className={`absolute bottom-0 left-0 w-0 h-0.5 bg-boulangerie-400 transition-all duration-300 ${
                  pathname === '/' ? 'w-full' : 'group-hover:w-full'
                }`}></span>
              </Link>
              <Link href="/catalogue" className={`font-semibold relative ${
                pathname === '/catalogue' ? 'text-boulangerie-600' : 'text-gray-700 hover:text-boulangerie-500'
              } transition-colors group`}>
                Nos Produits
                <span className={`absolute bottom-0 left-0 w-0 h-0.5 bg-boulangerie-400 transition-all duration-300 ${
                  pathname === '/catalogue' ? 'w-full' : 'group-hover:w-full'
                }`}></span>
              </Link>
              <Link href="/panier" className="relative font-semibold text-gray-700 hover:text-boulangerie-500 transition-colors flex items-center group">
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                Panier
                <span className={`absolute bottom-0 left-0 w-0 h-0.5 bg-boulangerie-400 transition-all duration-300 ${
                  pathname === '/panier' ? 'w-full' : 'group-hover:w-full'
                }`}></span>
                {etat.articles.length > 0 && (
                  <span className="absolute -top-2 right-0 bg-boulangerie-500 text-white w-5 h-5 flex items-center justify-center rounded-full text-xs animate-pulse">
                    {nbTotalArticles()}
                  </span>
                )}
              </Link>
              {adminConnecte && (
                <Link href="/admin" className="relative font-semibold text-gray-700 hover:text-boulangerie-500 transition-colors group">
                  <svg className="w-5 h-5 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  Admin
                  <span className={`absolute bottom-0 left-0 w-0 h-0.5 bg-boulangerie-400 transition-all duration-300 group-hover:w-full`}></span>
                </Link>
              )}
            </div>

            <button 
              className="md:hidden text-gray-700 focus:outline-none p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setMenuOuvert(!menuOuvert)}
              aria-label={menuOuvert ? "Fermer le menu" : "Ouvrir le menu"}
            >
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                {menuOuvert ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                )}
              </svg>
            </button>
          </div>

          <div className={`md:hidden mt-4 py-4 bg-white rounded-lg shadow-xl transition-all duration-300 ${
            menuOuvert ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 invisible overflow-hidden'
          }`}>
            <div className="flex flex-col space-y-4 px-4">
              <Link 
                href="/" 
                className={`font-semibold ${pathname === '/' ? 'text-boulangerie-600' : 'text-gray-700'} flex items-center p-2 rounded-lg hover:bg-boulangerie-50 transition-colors`}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>
                Accueil
              </Link>
              <Link 
                href="/catalogue" 
                className={`font-semibold ${pathname === '/catalogue' ? 'text-boulangerie-600' : 'text-gray-700'} flex items-center p-2 rounded-lg hover:bg-boulangerie-50 transition-colors`}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                </svg>
                Nos Produits
              </Link>
              <Link 
                href="/panier" 
                className={`font-semibold ${pathname === '/panier' ? 'text-boulangerie-600' : 'text-gray-700'} flex items-center p-2 rounded-lg hover:bg-boulangerie-50 transition-colors`}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                Panier
                {etat.articles.length > 0 && (
                  <span className="ml-2 bg-boulangerie-500 text-white px-2 py-0.5 rounded-full text-xs">
                    {nbTotalArticles()}
                  </span>
                )}
              </Link>
              {adminConnecte && (
                <Link 
                  href="/admin" 
                  className={`font-semibold text-gray-700 flex items-center p-2 rounded-lg hover:bg-boulangerie-50 transition-colors`}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  Admin
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
      <div className={`h-16 ${scrolled ? 'md:h-14' : 'md:h-20'}`}></div>
    </>
  );
};