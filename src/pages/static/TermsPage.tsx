import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';

const TermsPage: React.FC = () => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <main className="flex-1 container py-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Conditions d'utilisation</h1>
      <Card><CardContent className="p-6 prose prose-sm max-w-none">
        <p>En utilisant Njoka, vous acceptez les présentes conditions d'utilisation. Veuillez les lire attentivement.</p>
        <h2>Inscription</h2>
        <p>Vous devez fournir des informations exactes lors de l'inscription. Un seul compte par personne est autorisé.</p>
        <h2>Publication d'annonces</h2>
        <p>Les annonces doivent être conformes aux lois camerounaises. Il est interdit de publier des contenus illégaux, trompeurs ou offensants. Les annonces pour adultes (18+) sont limitées aux catégories prévues à cet effet.</p>
        <h2>Responsabilité</h2>
        <p>Njoka est une plateforme de mise en relation. Nous ne sommes pas responsables des transactions entre utilisateurs. Nous vous recommandons de prendre les précautions nécessaires.</p>
        <h2>Modération</h2>
        <p>Njoka se réserve le droit de supprimer toute annonce ne respectant pas ces conditions sans préavis.</p>
      </CardContent></Card>
    </main>
    <Footer />
  </div>
);

export default TermsPage;
