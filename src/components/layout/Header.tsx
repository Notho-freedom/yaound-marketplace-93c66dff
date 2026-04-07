import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Heart, MessageCircle, Bell, Plus, Menu, X, Globe, User, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/i18n/LanguageContext';
import { regions } from '@/data/regions';

const Header: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [regionDropdownOpen, setRegionDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedRegion) params.set('region', selectedRegion);
    navigate(`/listings?${params.toString()}`);
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background">
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground">
        <div className="container flex items-center justify-between py-1 text-xs">
          <span className="font-medium">{t.site.name} — {t.site.slogan}</span>
          <button
            onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
            className="flex items-center gap-1 hover:underline"
          >
            <Globe className="h-3 w-3" />
            {language === 'fr' ? 'English' : 'Français'}
          </button>
        </div>
      </div>

      {/* Main header */}
      <div className="container py-3">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-primary">
              {t.site.name}
            </h1>
          </Link>

          {/* Search bar - desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 items-center gap-2">
            <div className="relative flex-1 flex">
              <Input
                type="text"
                placeholder={t.nav.search}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-r-none border-r-0"
              />
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setRegionDropdownOpen(!regionDropdownOpen)}
                  className="flex h-10 items-center gap-1 border border-l-0 bg-muted px-3 text-sm text-muted-foreground hover:bg-muted/80"
                >
                  {selectedRegion || t.nav.allRegions}
                  <ChevronDown className="h-3 w-3" />
                </button>
                {regionDropdownOpen && (
                  <div className="absolute right-0 top-full z-50 mt-1 w-56 rounded-md border bg-background shadow-lg">
                    <div
                      className="cursor-pointer px-3 py-2 text-sm hover:bg-muted"
                      onClick={() => { setSelectedRegion(''); setRegionDropdownOpen(false); }}
                    >
                      {t.nav.allRegions}
                    </div>
                    {regions.map((r) => (
                      <div
                        key={r.id}
                        className="cursor-pointer px-3 py-2 text-sm hover:bg-muted"
                        onClick={() => { setSelectedRegion(r.name); setRegionDropdownOpen(false); }}
                      >
                        {r.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <Button type="submit" className="rounded-l-none">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-2">
            <Link to="/favorites">
              <Button variant="ghost" size="icon"><Heart className="h-5 w-5" /></Button>
            </Link>
            <Link to="/messages">
              <Button variant="ghost" size="icon"><MessageCircle className="h-5 w-5" /></Button>
            </Link>
            <Link to="/notifications">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-accent text-[10px] font-bold text-accent-foreground flex items-center justify-center">3</span>
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="sm"><User className="h-4 w-4 mr-1" />{t.nav.login}</Button>
            </Link>
            <Link to="/post-ad">
              <Button size="sm"><Plus className="h-4 w-4 mr-1" />{t.nav.postAd}</Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden ml-auto" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile search */}
        <form onSubmit={handleSearch} className="mt-3 flex md:hidden gap-2">
          <Input
            type="text"
            placeholder={t.nav.search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon"><Search className="h-4 w-4" /></Button>
        </form>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-t md:hidden bg-background">
          <nav className="container py-4 flex flex-col gap-2">
            <Link to="/post-ad" className="flex items-center gap-2 py-2 font-medium text-primary" onClick={() => setMobileMenuOpen(false)}>
              <Plus className="h-4 w-4" />{t.nav.postAd}
            </Link>
            <Link to="/favorites" className="flex items-center gap-2 py-2" onClick={() => setMobileMenuOpen(false)}>
              <Heart className="h-4 w-4" />{t.nav.favorites}
            </Link>
            <Link to="/messages" className="flex items-center gap-2 py-2" onClick={() => setMobileMenuOpen(false)}>
              <MessageCircle className="h-4 w-4" />{t.nav.messages}
            </Link>
            <Link to="/notifications" className="flex items-center gap-2 py-2" onClick={() => setMobileMenuOpen(false)}>
              <Bell className="h-4 w-4" />{t.nav.notifications}
            </Link>
            <Link to="/dashboard" className="flex items-center gap-2 py-2" onClick={() => setMobileMenuOpen(false)}>
              <User className="h-4 w-4" />{t.nav.myAccount}
            </Link>
            <Link to="/login" className="flex items-center gap-2 py-2" onClick={() => setMobileMenuOpen(false)}>
              <User className="h-4 w-4" />{t.nav.login}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
