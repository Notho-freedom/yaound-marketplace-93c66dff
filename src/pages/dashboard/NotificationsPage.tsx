import React from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { mockNotifications } from '@/data/mockListings';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Eye, Clock, CheckCircle, XCircle } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  message: <MessageCircle className="h-5 w-5 text-primary" />,
  listing_view: <Eye className="h-5 w-5 text-secondary" />,
  listing_expiry: <Clock className="h-5 w-5 text-accent" />,
  listing_approved: <CheckCircle className="h-5 w-5 text-primary" />,
  listing_rejected: <XCircle className="h-5 w-5 text-destructive" />,
};

const NotificationsPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">{t.dashboard.notifications}</h2>
      {mockNotifications.map((notif) => (
        <Card key={notif.id} className={`p-4 flex items-start gap-3 ${!notif.read ? 'border-l-4 border-l-primary' : ''}`}>
          <div className="mt-0.5">{iconMap[notif.type]}</div>
          <div className="flex-1">
            <p className="font-medium text-sm">{notif.title}</p>
            <p className="text-sm text-muted-foreground">{notif.body}</p>
            <p className="text-xs text-muted-foreground mt-1">{new Date(notif.createdAt).toLocaleDateString('fr-FR')}</p>
          </div>
          {!notif.read && <Badge className="bg-primary text-primary-foreground text-[10px]">New</Badge>}
        </Card>
      ))}
    </div>
  );
};

export default NotificationsPage;
