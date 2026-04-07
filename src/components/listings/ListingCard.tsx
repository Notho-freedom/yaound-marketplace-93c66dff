import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { Listing } from '@/types';
import { formatPrice, timeAgo } from '@/utils/format';
import { Heart, Eye, MapPin, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface Props {
  listing: Listing;
  viewMode?: 'grid' | 'list';
}

const ListingCard: React.FC<Props> = ({ listing, viewMode = 'grid' }) => {
  const { language } = useLanguage();

  if (viewMode === 'list') {
    return (
      <Link to={`/listing/${listing.id}`}>
        <Card className="flex overflow-hidden hover:shadow-md transition-shadow">
          <div className="relative h-40 w-48 flex-shrink-0">
            <img src={listing.images[0]} alt={listing.title} className="h-full w-full object-cover" />
            {listing.isPremium && <Badge className="absolute top-2 left-2 bg-secondary text-secondary-foreground text-[10px]">Premium</Badge>}
            {listing.isUrgent && <Badge className="absolute top-2 left-12 bg-accent text-accent-foreground text-[10px]">Urgent</Badge>}
          </div>
          <div className="flex-1 p-4 flex flex-col justify-between">
            <div>
              <h3 className="font-semibold line-clamp-1">{listing.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{listing.description}</p>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-lg font-bold text-primary">{formatPrice(listing.price)}</span>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{listing.city}</span>
                <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{listing.views}</span>
                <span>{timeAgo(listing.createdAt, language)}</span>
              </div>
            </div>
          </div>
          <button className="p-4 hover:text-accent self-start" onClick={(e) => { e.preventDefault(); }}>
            <Heart className="h-5 w-5" />
          </button>
        </Card>
      </Link>
    );
  }

  return (
    <Link to={`/listing/${listing.id}`}>
      <Card className="overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
        <div className="relative aspect-[4/3]">
          <img src={listing.images[0]} alt={listing.title} className="h-full w-full object-cover" />
          {listing.isPremium && <Badge className="absolute top-2 left-2 bg-secondary text-secondary-foreground text-[10px]">Premium</Badge>}
          {listing.isUrgent && <Badge className="absolute top-2 right-2 bg-accent text-accent-foreground text-[10px]">Urgent</Badge>}
          <button className="absolute bottom-2 right-2 rounded-full bg-background/80 p-1.5 hover:bg-background" onClick={(e) => { e.preventDefault(); }}>
            <Heart className="h-4 w-4" />
          </button>
        </div>
        <div className="p-3 flex-1 flex flex-col">
          <h3 className="font-semibold text-sm line-clamp-2">{listing.title}</h3>
          <span className="text-lg font-bold text-primary mt-1">{formatPrice(listing.price)}</span>
          <div className="mt-auto pt-2 flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{listing.city}</span>
            <span>{timeAgo(listing.createdAt, language)}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default ListingCard;
