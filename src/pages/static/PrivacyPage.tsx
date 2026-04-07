import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';

const PrivacyPage: React.FC = () => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <main className="flex-1 container py-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Politique de confidentialité</h1>
      <Card><CardContent className="p-6 prose prose-sm max-w-none">
        <p>Njoka s'engage à protéger la vie privée de ses utilisateurs. Cette politique décrit comment nous collectons, utilisons et protégeons vos données personnelles.</p>
        <h2>Données collectées</h2>
        <p>Nous collectons les informations que vous fournissez lors de l'inscription (nom, email, téléphone) ainsi que les données relatives à vos annonces.</p>
        <h2>Utilisation des données</h2>
        <p>Vos données sont utilisées pour : afficher vos annonces, faciliter la communication entre utilisateurs, améliorer nos services, et vous envoyer des notifications pertinentes.</p>
        <h2>Protection des données</h2>
        <p>Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles pour protéger vos données contre tout accès non autorisé.</p>
        <h2>Vos droits</h2>
        <p>Vous avez le droit d'accéder, modifier ou supprimer vos données personnelles à tout moment via votre espace personnel.</p>
      </CardContent></Card>
    </main>
    <Footer />
  </div>
);

export default PrivacyPage;
