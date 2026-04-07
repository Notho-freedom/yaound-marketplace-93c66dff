import React, { useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

const ForgotPasswordPage: React.FC = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-12 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center"><CardTitle className="text-2xl">{t.auth.resetPassword}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>{t.auth.email}</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1" /></div>
            <Button className="w-full">{t.auth.resetPassword}</Button>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default ForgotPasswordPage;
