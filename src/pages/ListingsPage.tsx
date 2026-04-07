import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { categories } from '@/data/categories';
import { regions } from '@/data/regions';
import { mockListings } from '@/data/mockListings';
import ListingCard from '@/components/listings/ListingCard';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ViewMode, SortOption } from '@/types';
import { LayoutGrid, List, SlidersHorizontal, X } from 'lucide-react';

const ListingsPage: React.FC = () => {
  const { t, language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showFilters, setShowFilters] = useState(true);

  const categoryId = searchParams.get('category') || '';
  const subcategoryId = searchParams.get('subcategory') || '';
  const query = searchParams.get('q') || '';
  const regionFilter = searchParams.get('region') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const sort = (searchParams.get('sort') as SortOption) || 'newest';
  const conditionFilter = searchParams.get('condition') || '';

  const selectedCategory = categories.find((c) => c.id === categoryId);

  const filteredListings = useMemo(() => {
    let results = [...mockListings];
    if (categoryId) results = results.filter((l) => l.categoryId === categoryId);
    if (subcategoryId) results = results.filter((l) => l.subcategoryId === subcategoryId);
    if (query) results = results.filter((l) => l.title.toLowerCase().includes(query.toLowerCase()) || l.description.toLowerCase().includes(query.toLowerCase()));
    if (regionFilter) results = results.filter((l) => l.region === regionFilter);
    if (minPrice) results = results.filter((l) => l.price >= Number(minPrice));
    if (maxPrice) results = results.filter((l) => l.price <= Number(maxPrice));
    if (conditionFilter) results = results.filter((l) => l.condition === conditionFilter);

    switch (sort) {
      case 'oldest': results.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()); break;
      case 'price_asc': results.sort((a, b) => a.price - b.price); break;
      case 'price_desc': results.sort((a, b) => b.price - a.price); break;
      default: results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return results;
  }, [categoryId, subcategoryId, query, regionFilter, minPrice, maxPrice, sort, conditionFilter]);

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    setSearchParams(params);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link to="/" className="hover:text-primary">{t.nav.home}</Link>
          <span>/</span>
          {selectedCategory ? (
            <span className="text-foreground">{selectedCategory.name[language]}</span>
          ) : (
            <span className="text-foreground">{t.nav.allCategories}</span>
          )}
        </div>

        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">
            {selectedCategory ? selectedCategory.name[language] : t.nav.allCategories}
            <span className="text-sm font-normal text-muted-foreground ml-2">
              ({filteredListings.length} {t.listing.results})
            </span>
          </h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="md:hidden" onClick={() => setShowFilters(!showFilters)}>
              <SlidersHorizontal className="h-4 w-4 mr-1" />{t.listing.filters}
            </Button>
            <Button variant={viewMode === 'grid' ? 'default' : 'outline'} size="icon" className="h-8 w-8" onClick={() => setViewMode('grid')}>
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button variant={viewMode === 'list' ? 'default' : 'outline'} size="icon" className="h-8 w-8" onClick={() => setViewMode('list')}>
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Filters sidebar */}
          {showFilters && (
            <aside className="w-full md:w-64 flex-shrink-0 space-y-4">
              <div className="rounded-lg border p-4 space-y-4">
                <h3 className="font-semibold text-sm">{t.listing.filters}</h3>

                {/* Category */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">{t.post.step1}</label>
                  <Select value={categoryId} onValueChange={(v) => updateParam('category', v)}>
                    <SelectTrigger><SelectValue placeholder={t.nav.allCategories} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t.nav.allCategories}</SelectItem>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.name[language]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Subcategory */}
                {selectedCategory && (
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">{t.post.selectSubcategory}</label>
                    <Select value={subcategoryId} onValueChange={(v) => updateParam('subcategory', v)}>
                      <SelectTrigger><SelectValue placeholder={t.common.all} /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t.common.all}</SelectItem>
                        {selectedCategory.subcategories.map((s) => (
                          <SelectItem key={s.id} value={s.id}>{s.name[language]}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Price range */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">{t.listing.priceRange}</label>
                  <div className="flex gap-2">
                    <Input type="number" placeholder={t.listing.minPrice} value={minPrice} onChange={(e) => updateParam('minPrice', e.target.value)} className="text-xs" />
                    <Input type="number" placeholder={t.listing.maxPrice} value={maxPrice} onChange={(e) => updateParam('maxPrice', e.target.value)} className="text-xs" />
                  </div>
                </div>

                {/* Region */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">{t.listing.region}</label>
                  <Select value={regionFilter} onValueChange={(v) => updateParam('region', v)}>
                    <SelectTrigger><SelectValue placeholder={t.nav.allRegions} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t.nav.allRegions}</SelectItem>
                      {regions.map((r) => (
                        <SelectItem key={r.id} value={r.name}>{r.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Condition */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">{t.listing.condition}</label>
                  <Select value={conditionFilter} onValueChange={(v) => updateParam('condition', v)}>
                    <SelectTrigger><SelectValue placeholder={t.common.all} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t.common.all}</SelectItem>
                      <SelectItem value="new">{t.listing.new}</SelectItem>
                      <SelectItem value="used">{t.listing.used}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">{t.listing.sortBy}</label>
                  <Select value={sort} onValueChange={(v) => updateParam('sort', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">{t.listing.newest}</SelectItem>
                      <SelectItem value="oldest">{t.listing.oldest}</SelectItem>
                      <SelectItem value="price_asc">{t.listing.priceLowHigh}</SelectItem>
                      <SelectItem value="price_desc">{t.listing.priceHighLow}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </aside>
          )}

          {/* Results */}
          <div className="flex-1">
            {filteredListings.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <p className="text-lg">{t.listing.noResults}</p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredListings.map((l) => <ListingCard key={l.id} listing={l} viewMode="grid" />)}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredListings.map((l) => <ListingCard key={l.id} listing={l} viewMode="list" />)}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ListingsPage;
