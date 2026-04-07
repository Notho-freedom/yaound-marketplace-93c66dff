import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { categories } from '@/data/categories';
import { mockListings } from '@/data/mockListings';
import ListingCard from '@/components/listings/ListingCard';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Home, Building2, Car, Briefcase, Smartphone, Baby, Shirt, Monitor,
  Tv, Sofa, Dumbbell, PawPrint, Heart, Wrench, Store, Gift, ArrowRight,
  Upload, MessageCircle, CheckCircle
} from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  Home: <Home className="h-6 w-6" />, Building2: <Building2 className="h-6 w-6" />,
  Car: <Car className="h-6 w-6" />, Briefcase: <Briefcase className="h-6 w-6" />,
  Smartphone: <Smartphone className="h-6 w-6" />, Baby: <Baby className="h-6 w-6" />,
  Shirt: <Shirt className="h-6 w-6" />, Monitor: <Monitor className="h-6 w-6" />,
  Tv: <Tv className="h-6 w-6" />, Sofa: <Sofa className="h-6 w-6" />,
  Dumbbell: <Dumbbell className="h-6 w-6" />, PawPrint: <PawPrint className="h-6 w-6" />,
  Heart: <Heart className="h-6 w-6" />, Wrench: <Wrench className="h-6 w-6" />,
  Store: <Store className="h-6 w-6" />, Gift: <Gift className="h-6 w-6" />,
};

const HomePage: React.FC = () => {
  const { t, language } = useLanguage();
  const premiumListings = mockListings.filter((l) => l.isPremium);
  const recentListings = mockListings.slice(0, 8);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-primary text-primary-foreground py-10">
          <div className="container text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">{t.site.name}</h2>
            <p className="text-lg opacity-90">{t.site.slogan}</p>
            <p className="mt-2 opacity-75">{t.site.description}</p>
          </div>
        </section>

        {/* Categories grid */}
        <section className="container py-8">
          <h2 className="text-xl font-bold mb-6">{t.home.browseCategories}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3">
            {categories.map((cat) => (
              <Link key={cat.id} to={`/listings?category=${cat.id}`}>
                <Card className="flex flex-col items-center justify-center p-4 hover:shadow-md transition-shadow cursor-pointer text-center h-full">
                  <div className={`rounded-full p-3 mb-2 ${cat.color}`}>
                    {iconMap[cat.icon] || <Store className="h-6 w-6" />}
                  </div>
                  <span className="text-xs font-medium leading-tight">
                    {cat.name[language]}
                  </span>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Premium listings */}
        <section className="container py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">{t.home.premiumAds}</h2>
            <Link to="/listings?premium=true">
              <Button variant="link" className="gap-1">{t.home.seeAll}<ArrowRight className="h-4 w-4" /></Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {premiumListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </section>

        {/* Recent listings */}
        <section className="container py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">{t.home.recentListings}</h2>
            <Link to="/listings">
              <Button variant="link" className="gap-1">{t.home.seeAll}<ArrowRight className="h-4 w-4" /></Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {recentListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="bg-muted/50 py-12">
          <div className="container">
            <h2 className="text-xl font-bold text-center mb-8">{t.home.howItWorks}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Upload className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-2">{t.home.step1}</h3>
                <p className="text-sm text-muted-foreground">{t.home.step1desc}</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-2">{t.home.step2}</h3>
                <p className="text-sm text-muted-foreground">{t.home.step2desc}</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-2">{t.home.step3}</h3>
                <p className="text-sm text-muted-foreground">{t.home.step3desc}</p>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
