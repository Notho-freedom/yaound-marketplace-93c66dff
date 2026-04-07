import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useLanguage } from '@/i18n/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, MessageCircle, CheckCircle } from 'lucide-react';

const HowItWorksPage: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-10 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">{t.home.howItWorks}</h1>
        <div className="space-y-6">
          {[
            { icon: Upload, title: t.home.step1, desc: t.home.step1desc },
            { icon: MessageCircle, title: t.home.step2, desc: t.home.step2desc },
            { icon: CheckCircle, title: t.home.step3, desc: t.home.step3desc },
          ].map(({ icon: Icon, title, desc }, i) => (
            <Card key={i}><CardContent className="p-6 flex items-start gap-4">
              <div className="rounded-full bg-primary/10 p-3"><Icon className="h-6 w-6 text-primary" /></div>
              <div><h2 className="font-semibold text-lg">{i + 1}. {title}</h2><p className="text-muted-foreground mt-1">{desc}</p></div>
            </CardContent></Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HowItWorksPage;
