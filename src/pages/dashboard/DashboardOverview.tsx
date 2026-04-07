import React from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Eye, MessageCircle, List } from 'lucide-react';

const DashboardOverview: React.FC = () => {
  const { t } = useLanguage();

  const stats = [
    { icon: List, label: t.dashboard.activeListings, value: '5', color: 'text-primary' },
    { icon: Eye, label: t.dashboard.totalViews, value: '1,234', color: 'text-secondary' },
    { icon: MessageCircle, label: t.dashboard.unreadMessages, value: '3', color: 'text-accent' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map(({ icon: Icon, label, value, color }) => (
          <Card key={label}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`rounded-full p-3 bg-muted ${color}`}><Icon className="h-5 w-5" /></div>
              <div>
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DashboardOverview;
