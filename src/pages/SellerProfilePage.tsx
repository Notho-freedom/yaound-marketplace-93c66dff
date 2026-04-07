import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { mockListings } from '@/data/mockListings';
import { formatDate } from '@/utils/format';
import ListingCard from '@/components/listings/ListingCard';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card } from '@/components/ui/card';
import { User, Star, Calendar, List } from 'lucide-react';

const SellerProfilePage: React.FC = () => {
  const { id } = useParams();
  const { t, language } = useLanguage();
  const sellerListings = mockListings.filter((l) => l.seller.id === id);
  const seller = sellerListings[0]?.seller;

  if (!seller) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-16 text-center text-muted-foreground">Vendeur introuvable</main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-6">
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
              <User className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">{seller.name}</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{t.listing.memberSince} {formatDate(seller.joinedAt, language)}</span>
                <span className="flex items-center gap-1"><List className="h-4 w-4" />{seller.listingsCount} {t.listing.activeAds}</span>
              </div>
              {seller.rating && (
                <div className="flex items-center gap-1 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < Math.floor(seller.rating!) ? 'fill-secondary text-secondary' : 'text-muted'}`} />
                  ))}
                  <span className="text-sm ml-1">{seller.rating}</span>
                </div>
              )}
            </div>
          </div>
        </Card>
        <h2 className="text-lg font-semibold mb-4">{language === 'fr' ? 'Annonces de ce vendeur' : 'Seller\'s listings'}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {sellerListings.map((l) => <ListingCard key={l.id} listing={l} />)}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SellerProfilePage;
