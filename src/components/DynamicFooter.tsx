'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const FooterLoading: React.FC = () => (
  <footer className="bg-boulangerie-800 text-white py-10 mt-auto">
    <div className="container mx-auto px-4 text-center">
      <p className="text-boulangerie-300 text-sm">Chargement...</p>
    </div>
  </footer>
);

const DynamicFooter = dynamic(() => import('./Footer'), {
  ssr: false,
  loading: () => <FooterLoading />
});

export default DynamicFooter;