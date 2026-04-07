import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useLanguage } from '@/i18n/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const faqsFr = [
  { q: 'Comment publier une annonce ?', a: 'Cliquez sur "Publier une annonce", choisissez la catégorie, remplissez les détails et ajoutez des photos. C\'est gratuit !' },
  { q: 'Est-ce que Njoka est gratuit ?', a: 'Oui, la publication d\'annonces est entièrement gratuite. Nous proposons des options premium payantes pour plus de visibilité.' },
  { q: 'Comment contacter un vendeur ?', a: 'Sur la page de l\'annonce, utilisez le bouton "Appeler" ou "Envoyer un message" pour contacter directement le vendeur.' },
  { q: 'Dans quelles régions Njoka est-il disponible ?', a: 'Njoka couvre l\'ensemble des 10 régions du Cameroun.' },
  { q: 'Comment signaler une annonce frauduleuse ?', a: 'Cliquez sur le bouton "Signaler" présent sur chaque annonce. Notre équipe examinera le signalement rapidement.' },
];

const faqsEn = [
  { q: 'How do I post an ad?', a: 'Click "Post an Ad", choose a category, fill in the details, and add photos. It\'s free!' },
  { q: 'Is Njoka free?', a: 'Yes, posting ads is completely free. We offer paid premium options for more visibility.' },
  { q: 'How do I contact a seller?', a: 'On the ad page, use the "Call" or "Send Message" button to contact the seller directly.' },
  { q: 'In which regions is Njoka available?', a: 'Njoka covers all 10 regions of Cameroon.' },
  { q: 'How do I report a fraudulent ad?', a: 'Click the "Report" button on any ad. Our team will review the report promptly.' },
];

const FAQPage: React.FC = () => {
  const { language } = useLanguage();
  const faqs = language === 'fr' ? faqsFr : faqsEn;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-10 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">FAQ</h1>
        <Card><CardContent className="p-6">
          <Accordion type="single" collapsible>
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger>{faq.q}</AccordionTrigger>
                <AccordionContent>{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent></Card>
      </main>
      <Footer />
    </div>
  );
};

export default FAQPage;
