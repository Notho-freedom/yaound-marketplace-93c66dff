import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useLanguage } from '@/i18n/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, Phone, MapPin } from 'lucide-react';

const ContactPage: React.FC = () => {
  const { language } = useLanguage();
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-10 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Contact</h1>
        <div className="grid md:grid-cols-2 gap-6">
          <Card><CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3"><Mail className="h-5 w-5 text-primary" /><span className="text-sm">support@njoka.cm</span></div>
            <div className="flex items-center gap-3"><Phone className="h-5 w-5 text-primary" /><span className="text-sm">+237 6XX XXX XXX</span></div>
            <div className="flex items-center gap-3"><MapPin className="h-5 w-5 text-primary" /><span className="text-sm">Douala, Cameroun</span></div>
          </CardContent></Card>
          <Card><CardContent className="p-6 space-y-4">
            <div><Label>{language === 'fr' ? 'Nom' : 'Name'}</Label><Input className="mt-1" /></div>
            <div><Label>Email</Label><Input type="email" className="mt-1" /></div>
            <div><Label>Message</Label><Textarea rows={4} className="mt-1" /></div>
            <Button className="w-full">{language === 'fr' ? 'Envoyer' : 'Send'}</Button>
          </CardContent></Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
