import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

const RegisterPage: React.FC = () => {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-12 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center"><CardTitle className="text-2xl">{t.auth.register}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>{t.auth.name}</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1" /></div>
            <div><Label>{t.auth.email}</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1" /></div>
            <div><Label>{t.auth.phone}</Label><Input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-1" placeholder="+237" /></div>
            <div><Label>{t.auth.password}</Label><Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="mt-1" /></div>
            <div><Label>{t.auth.confirmPassword}</Label><Input type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} className="mt-1" /></div>
            <Button className="w-full">{t.auth.register}</Button>
            <Separator />
            <p className="text-center text-sm text-muted-foreground">
              {t.auth.hasAccount}{' '}
              <Link to="/login" className="text-primary hover:underline">{t.auth.login}</Link>
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default RegisterPage;
