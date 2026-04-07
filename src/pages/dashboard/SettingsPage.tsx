import React from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

const SettingsPage: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">{t.dashboard.settings}</h2>
      <Card>
        <CardContent className="p-6 space-y-6">
          <div>
            <Label>Langue / Language</Label>
            <Select value={language} onValueChange={(v) => setLanguage(v as 'fr' | 'en')}>
              <SelectTrigger className="mt-1 w-48"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Notifications email</p>
              <p className="text-xs text-muted-foreground">Recevoir les notifications par email</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Notifications push</p>
              <p className="text-xs text-muted-foreground">Recevoir les notifications push</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Button onClick={() => toast.success(t.common.success)}>{t.common.save}</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
