import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { mockListings } from '@/data/mockListings';
import { categories } from '@/data/categories';
import { formatPrice, formatDate } from '@/utils/format';
import ListingCard from '@/components/listings/ListingCard';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Phone, MessageCircle, Heart, Flag, Share2, MapPin, Eye, Calendar,
  ChevronLeft, ChevronRight, User, Star, X
} from 'lucide-react';

const ListingDetailPage: React.FC = () => {
  const { id } = useParams();
  const { t, language } = useLanguage();
  const listing = mockListings.find((l) => l.id === id);
  const [currentImage, setCurrentImage] = useState(0);
  const [showPhone, setShowPhone] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (!listing) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-16 text-center">
          <p className="text-lg text-muted-foreground">Annonce introuvable</p>
          <Link to="/"><Button className="mt-4">{t.nav.home}</Button></Link>
        </main>
        <Footer />
      </div>
    );
  }

  const category = categories.find((c) => c.id === listing.categoryId);
  const subcategory = category?.subcategories.find((s) => s.id === listing.subcategoryId);
  const similarListings = mockListings.filter((l) => l.categoryId === listing.categoryId && l.id !== listing.id).slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4 flex-wrap">
          <Link to="/" className="hover:text-primary">{t.nav.home}</Link><span>/</span>
          {category && <Link to={`/listings?category=${category.id}`} className="hover:text-primary">{category.name[language]}</Link>}
          {subcategory && <><span>/</span><span>{subcategory.name[language]}</span></>}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left - images & details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image gallery */}
            <Card className="overflow-hidden">
              <div className="relative aspect-[16/10] bg-muted cursor-pointer" onClick={() => setLightboxOpen(true)}>
                <img src={listing.images[currentImage]} alt={listing.title} className="h-full w-full object-contain" />
                {listing.images.length > 1 && (
                  <>
                    <button className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2" onClick={(e) => { e.stopPropagation(); setCurrentImage((prev) => prev === 0 ? listing.images.length - 1 : prev - 1); }}>
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2" onClick={(e) => { e.stopPropagation(); setCurrentImage((prev) => (prev + 1) % listing.images.length); }}>
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}
                <div className="absolute top-3 left-3 flex gap-2">
                  {listing.isPremium && <Badge className="bg-secondary text-secondary-foreground">Premium</Badge>}
                  {listing.isUrgent && <Badge className="bg-accent text-accent-foreground">Urgent</Badge>}
                </div>
              </div>
            </Card>

            {/* Title & price */}
            <div>
              <h1 className="text-2xl font-bold">{listing.title}</h1>
              <p className="text-3xl font-bold text-primary mt-2">{formatPrice(listing.price)}</p>
              <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{listing.city}, {listing.region}</span>
                <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{formatDate(listing.createdAt, language)}</span>
                <span className="flex items-center gap-1"><Eye className="h-4 w-4" />{listing.views} {t.listing.views}</span>
              </div>
              {listing.condition && (
                <Badge variant="outline" className="mt-2">{listing.condition === 'new' ? t.listing.new : t.listing.used}</Badge>
              )}
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h2 className="text-lg font-semibold mb-3">{t.listing.description}</h2>
              <p className="text-sm leading-relaxed whitespace-pre-line">{listing.description}</p>
            </div>

            {/* Specs */}
            {listing.specs && Object.keys(listing.specs).length > 0 && (
              <>
                <Separator />
                <div>
                  <h2 className="text-lg font-semibold mb-3">{t.listing.specs}</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(listing.specs).map(([key, value]) => (
                      <div key={key} className="flex justify-between rounded-md bg-muted p-3">
                        <span className="text-sm text-muted-foreground capitalize">{key}</span>
                        <span className="text-sm font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Similar */}
            {similarListings.length > 0 && (
              <>
                <Separator />
                <div>
                  <h2 className="text-lg font-semibold mb-4">{t.listing.similarListings}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {similarListings.map((l) => <ListingCard key={l.id} listing={l} />)}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Right sidebar - seller & actions */}
          <div className="space-y-4">
            {/* Actions */}
            <Card className="p-4 space-y-3">
              <Button className="w-full" onClick={() => setShowPhone(!showPhone)}>
                <Phone className="h-4 w-4 mr-2" />
                {showPhone ? (listing.seller.phone || '+237 6XX XXX XXX') : t.listing.call}
              </Button>
              <Link to="/messages" className="block">
                <Button variant="outline" className="w-full">
                  <MessageCircle className="h-4 w-4 mr-2" />{t.listing.sendMessage}
                </Button>
              </Link>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1"><Heart className="h-4 w-4 mr-1" />{t.listing.addFavorite}</Button>
                <Button variant="outline" size="sm"><Share2 className="h-4 w-4" /></Button>
                <Button variant="outline" size="sm"><Flag className="h-4 w-4" /></Button>
              </div>
            </Card>

            {/* Seller */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3">{t.listing.sellerInfo}</h3>
              <Link to={`/seller/${listing.seller.id}`} className="flex items-center gap-3 hover:opacity-80">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                  <User className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">{listing.seller.name}</p>
                  <p className="text-xs text-muted-foreground">{t.listing.memberSince} {formatDate(listing.seller.joinedAt, language)}</p>
                  <p className="text-xs text-muted-foreground">{listing.seller.listingsCount} {t.listing.activeAds}</p>
                </div>
              </Link>
              {listing.seller.rating && (
                <div className="flex items-center gap-1 mt-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < Math.floor(listing.seller.rating!) ? 'fill-secondary text-secondary' : 'text-muted'}`} />
                  ))}
                  <span className="text-sm ml-1">{listing.seller.rating}</span>
                </div>
              )}
            </Card>

            {/* Location */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3">{t.listing.location}</h3>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-primary" />
                <span>{listing.city}, {listing.region}</span>
              </div>
              <div className="mt-3 aspect-[4/3] bg-muted rounded-md flex items-center justify-center text-xs text-muted-foreground">
                Carte
              </div>
            </Card>
          </div>
        </div>
      </main>
      <Footer />

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[100] bg-background/95 flex items-center justify-center" onClick={() => setLightboxOpen(false)}>
          <button className="absolute top-4 right-4 p-2" onClick={() => setLightboxOpen(false)}>
            <X className="h-6 w-6" />
          </button>
          <img src={listing.images[currentImage]} alt="" className="max-h-[90vh] max-w-[90vw] object-contain" />
        </div>
      )}
    </div>
  );
};

export default ListingDetailPage;
