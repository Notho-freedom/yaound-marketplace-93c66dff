import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';

const RulesPage: React.FC = () => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <main className="flex-1 container py-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Règles de publication</h1>
      <Card><CardContent className="p-6 prose prose-sm max-w-none">
        <h2>Règles générales</h2>
        <ul>
          <li>Publiez uniquement des annonces réelles avec des informations exactes</li>
          <li>Utilisez des photos authentiques de vos produits</li>
          <li>Indiquez un prix réaliste en FCFA</li>
          <li>Choisissez la bonne catégorie et sous-catégorie</li>
          <li>Rédigez un titre clair et descriptif</li>
        </ul>
        <h2>Contenu interdit</h2>
        <ul>
          <li>Produits illégaux ou contrefaits</li>
          <li>Armes et munitions</li>
          <li>Drogues et substances illicites</li>
          <li>Annonces discriminatoires</li>
          <li>Spam et annonces en double</li>
        </ul>
        <h2>Catégories adultes (18+)</h2>
        <p>Les annonces de services et produits pour adultes doivent être publiées exclusivement dans les sous-catégories prévues à cet effet dans "Santé & Beauté".</p>
      </CardContent></Card>
    </main>
    <Footer />
  </div>
);

export default RulesPage;
