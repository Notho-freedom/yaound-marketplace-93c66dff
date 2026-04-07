import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card } from '@/components/ui/card';
import { BarChart3, List, Heart, MessageCircle, Bell, User, Settings } from 'lucide-react';

const DashboardLayout: React.FC = () => {
  const { t } = useLanguage();
  const { pathname } = useLocation();

  const links = [
    { to: '/dashboard', icon: BarChart3, label: t.dashboard.overview },
    { to: '/dashboard/listings', icon: List, label: t.dashboard.myListings },
    { to: '/dashboard/favorites', icon: Heart, label: t.dashboard.favorites },
    { to: '/dashboard/messages', icon: MessageCircle, label: t.dashboard.messages },
    { to: '/dashboard/notifications', icon: Bell, label: t.dashboard.notifications },
    { to: '/dashboard/profile', icon: User, label: t.dashboard.profile },
    { to: '/dashboard/settings', icon: Settings, label: t.dashboard.settings },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-6">
        <h1 className="text-2xl font-bold mb-6">{t.dashboard.title}</h1>
        <div className="flex gap-6">
          <aside className="hidden md:block w-56 flex-shrink-0">
            <Card className="p-2">
              <nav className="space-y-1">
                {links.map(({ to, icon: Icon, label }) => (
                  <Link
                    key={to}
                    to={to}
                    className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted ${pathname === to ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground'}`}
                  >
                    <Icon className="h-4 w-4" />{label}
                  </Link>
                ))}
              </nav>
            </Card>
          </aside>
          <div className="flex-1 min-w-0"><Outlet /></div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DashboardLayout;
