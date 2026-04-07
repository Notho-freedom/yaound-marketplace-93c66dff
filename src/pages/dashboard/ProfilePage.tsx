import React, { useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { regions } from '@/data/regions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const ProfilePage: React.FC = () => {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: 'Jean Dupont', email: 'jean@email.com', phone: '+237 6XX XXX XXX', region: 'Littoral', city: 'Douala' });
  const selectedRegion = regions.find((r) => r.name === form.region);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">{t.dashboard.profile}</h2>
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center text-2xl font-bold text-muted-foreground">JD</div>
            <Button variant="outline" size="sm">Changer la photo</Button>
          </div>
          <div><Label>{t.auth.name}</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1" /></div>
          <div><Label>{t.auth.email}</Label><Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1" /></div>
          <div><Label>{t.auth.phone}</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-1" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>{t.listing.region}</Label>
              <Select value={form.region} onValueChange={(v) => setForm({ ...form, region: v, city: '' })}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>{regions.map((r) => <SelectItem key={r.id} value={r.name}>{r.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>{t.listing.city}</Label>
              <Select value={form.city} onValueChange={(v) => setForm({ ...form, city: v })}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>{selectedRegion?.cities.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={() => toast.success(t.common.success)}>{t.common.save}</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
