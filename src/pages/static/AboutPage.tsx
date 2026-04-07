import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useLanguage } from '@/i18n/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';

const AboutPage: React.FC = () => {
  const { language } = useLanguage();
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-10 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">{language === 'fr' ? 'À propos de Njoka' : 'About Njoka'}</h1>
        <Card><CardContent className="p-6 prose prose-sm max-w-none">
          <p>{language === 'fr'
            ? "Njoka est la première plateforme de petites annonces dédiée au Cameroun. Notre mission est de connecter les acheteurs et vendeurs camerounais dans un espace sûr, simple et efficace."
            : "Njoka is Cameroon's premier classifieds platform. Our mission is to connect Cameroonian buyers and sellers in a safe, simple, and efficient space."}</p>
          <h2>{language === 'fr' ? 'Notre vision' : 'Our Vision'}</h2>
          <p>{language === 'fr'
            ? "Faciliter le commerce local au Cameroun en offrant une plateforme moderne, accessible à tous, que vous soyez à Douala, Yaoundé, Bafoussam ou dans n'importe quelle ville du pays."
            : "To facilitate local commerce in Cameroon by offering a modern platform accessible to everyone, whether you're in Douala, Yaoundé, Bafoussam, or any city in the country."}</p>
          <h2>{language === 'fr' ? 'Pourquoi Njoka ?' : 'Why Njoka?'}</h2>
          <ul>
            <li>{language === 'fr' ? 'Publication gratuite d\'annonces' : 'Free ad posting'}</li>
            <li>{language === 'fr' ? 'Couverture de toutes les 10 régions du Cameroun' : 'Coverage of all 10 regions of Cameroon'}</li>
            <li>{language === 'fr' ? 'Messagerie intégrée entre acheteurs et vendeurs' : 'Built-in messaging between buyers and sellers'}</li>
            <li>{language === 'fr' ? 'Interface bilingue (Français & Anglais)' : 'Bilingual interface (French & English)'}</li>
          </ul>
        </CardContent></Card>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
