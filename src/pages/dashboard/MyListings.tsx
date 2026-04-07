import React from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { mockListings } from '@/data/mockListings';
import { formatPrice, timeAgo } from '@/utils/format';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, RefreshCw, Star, Eye } from 'lucide-react';

const MyListings: React.FC = () => {
  const { t, language } = useLanguage();
  const listings = mockListings.slice(0, 5); // Mock user's listings

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">{t.dashboard.myListings}</h2>
      {listings.map((listing) => (
        <Card key={listing.id} className="p-4">
          <div className="flex gap-4">
            <img src={listing.images[0]} alt="" className="h-20 w-20 rounded-md object-cover flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm truncate">{listing.title}</h3>
              <p className="text-lg font-bold text-primary">{formatPrice(listing.price)}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-[10px]">{t.dashboard.status.active}</Badge>
                <span className="text-xs text-muted-foreground flex items-center gap-1"><Eye className="h-3 w-3" />{listing.views}</span>
                <span className="text-xs text-muted-foreground">{timeAgo(listing.createdAt, language)}</span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <Button variant="outline" size="sm"><Edit className="h-3 w-3 mr-1" />{t.dashboard.actions.edit}</Button>
              <Button variant="outline" size="sm"><RefreshCw className="h-3 w-3 mr-1" />{t.dashboard.actions.renew}</Button>
              <Button variant="outline" size="sm" className="text-destructive"><Trash2 className="h-3 w-3 mr-1" />{t.dashboard.actions.delete}</Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default MyListings;
