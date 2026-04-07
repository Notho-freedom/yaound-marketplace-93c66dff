import React from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { mockListings } from '@/data/mockListings';
import ListingCard from '@/components/listings/ListingCard';

const FavoritesPage: React.FC = () => {
  const { t } = useLanguage();
  const favorites = mockListings.slice(0, 4);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">{t.dashboard.favorites}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {favorites.map((l) => <ListingCard key={l.id} listing={l} />)}
      </div>
    </div>
  );
};

export default FavoritesPage;
