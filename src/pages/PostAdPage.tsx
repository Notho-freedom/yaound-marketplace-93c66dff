import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { categories } from '@/data/categories';
import { regions } from '@/data/regions';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Upload, Image, Check, ArrowLeft, ArrowRight } from 'lucide-react';

const STEPS = 6;

const PostAdPage: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    categoryId: '', subcategoryId: '', title: '', description: '', price: '',
    condition: 'used' as 'new' | 'used', images: [] as string[],
    region: '', city: '', specs: {} as Record<string, string>,
    isFeatured: false, isUrgent: false, isTop: false,
  });

  const selectedCategory = categories.find((c) => c.id === form.categoryId);
  const selectedRegion = regions.find((r) => r.name === form.region);

  const stepLabels = [t.post.step1, t.post.step2, t.post.step3, t.post.step4, t.post.step5, t.post.step6];

  const canProceed = () => {
    switch (step) {
      case 1: return form.categoryId && form.subcategoryId;
      case 2: return form.title && form.description;
      case 3: return true;
      case 4: return form.region && form.city;
      default: return true;
    }
  };

  const handlePublish = () => {
    toast.success(t.post.published);
    navigate('/dashboard/listings');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">{t.post.title}</h1>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {stepLabels.map((label, i) => (
            <div key={i} className="flex-1">
              <div className={`h-2 rounded-full ${i + 1 <= step ? 'bg-primary' : 'bg-muted'}`} />
              <span className="text-[10px] text-muted-foreground mt-1 block text-center">{label}</span>
            </div>
          ))}
        </div>

        <Card>
          <CardContent className="p-6">
            {/* Step 1: Category */}
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">{t.post.selectCategory}</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      className={`rounded-lg border p-3 text-left text-sm transition-colors hover:border-primary ${form.categoryId === cat.id ? 'border-primary bg-primary/5' : ''}`}
                      onClick={() => setForm({ ...form, categoryId: cat.id, subcategoryId: '' })}
                    >
                      {cat.name[language]}
                    </button>
                  ))}
                </div>
                {selectedCategory && (
                  <div>
                    <h3 className="text-sm font-medium mt-4 mb-2">{t.post.selectSubcategory}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {selectedCategory.subcategories.map((sub) => (
                        <button
                          key={sub.id}
                          className={`rounded-md border p-2 text-xs transition-colors hover:border-primary ${form.subcategoryId === sub.id ? 'border-primary bg-primary/5' : ''}`}
                          onClick={() => setForm({ ...form, subcategoryId: sub.id })}
                        >
                          {sub.name[language]}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Details */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <Label>{t.post.adTitle}</Label>
                  <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Ex: Appartement 3 chambres à Bonamoussadi" className="mt-1" />
                </div>
                <div>
                  <Label>{t.post.adDescription}</Label>
                  <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={6} className="mt-1" placeholder="Décrivez votre article en détail..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{t.post.adPrice}</Label>
                    <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="0" className="mt-1" />
                  </div>
                  <div>
                    <Label>{t.post.adCondition}</Label>
                    <Select value={form.condition} onValueChange={(v) => setForm({ ...form, condition: v as 'new' | 'used' })}>
                      <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">{t.listing.new}</SelectItem>
                        <SelectItem value="used">{t.listing.used}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Photos */}
            {step === 3 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">{t.post.uploadPhotos}</h2>
                <p className="text-sm text-muted-foreground">{t.post.uploadHint}</p>
                <div className="border-2 border-dashed rounded-lg p-12 text-center cursor-pointer hover:border-primary transition-colors">
                  <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground">{t.post.uploadPhotos}</p>
                  <p className="text-xs text-muted-foreground mt-1">JPG, PNG — max 5MB</p>
                </div>
                {form.images.length > 0 && (
                  <div className="grid grid-cols-4 gap-2">
                    {form.images.map((img, i) => (
                      <div key={i} className="aspect-square rounded-md bg-muted overflow-hidden">
                        <img src={img} alt="" className="h-full w-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Location */}
            {step === 4 && (
              <div className="space-y-4">
                <div>
                  <Label>{t.post.selectRegion}</Label>
                  <Select value={form.region} onValueChange={(v) => setForm({ ...form, region: v, city: '' })}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder={t.post.selectRegion} /></SelectTrigger>
                    <SelectContent>
                      {regions.map((r) => (
                        <SelectItem key={r.id} value={r.name}>{r.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {selectedRegion && (
                  <div>
                    <Label>{t.post.selectCity}</Label>
                    <Select value={form.city} onValueChange={(v) => setForm({ ...form, city: v })}>
                      <SelectTrigger className="mt-1"><SelectValue placeholder={t.post.selectCity} /></SelectTrigger>
                      <SelectContent>
                        {selectedRegion.cities.map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            )}

            {/* Step 5: Specs */}
            {step === 5 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">{t.listing.specs}</h2>
                <p className="text-sm text-muted-foreground">
                  {language === 'fr' ? 'Ajoutez des détails spécifiques à votre annonce' : 'Add specific details to your listing'}
                </p>
                {['surface', 'chambres', 'marque', 'modèle', 'année', 'kilométrage'].map((field) => (
                  <div key={field}>
                    <Label className="capitalize">{field}</Label>
                    <Input
                      value={form.specs[field] || ''}
                      onChange={(e) => setForm({ ...form, specs: { ...form.specs, [field]: e.target.value } })}
                      className="mt-1"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Step 6: Premium options */}
            {step === 6 && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold">{t.post.premiumOptions}</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <p className="font-medium">{t.post.featuredAd}</p>
                      <p className="text-sm text-muted-foreground">{t.post.featuredDesc}</p>
                    </div>
                    <Switch checked={form.isFeatured} onCheckedChange={(v) => setForm({ ...form, isFeatured: v })} />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <p className="font-medium">{t.post.urgentAd}</p>
                      <p className="text-sm text-muted-foreground">{t.post.urgentDesc}</p>
                    </div>
                    <Switch checked={form.isUrgent} onCheckedChange={(v) => setForm({ ...form, isUrgent: v })} />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <p className="font-medium">{t.post.topAd}</p>
                      <p className="text-sm text-muted-foreground">{t.post.topDesc}</p>
                    </div>
                    <Switch checked={form.isTop} onCheckedChange={(v) => setForm({ ...form, isTop: v })} />
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={() => setStep(step - 1)} disabled={step === 1}>
                <ArrowLeft className="h-4 w-4 mr-1" />{t.post.previous}
              </Button>
              {step < STEPS ? (
                <Button onClick={() => setStep(step + 1)} disabled={!canProceed()}>
                  {t.post.next}<ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              ) : (
                <Button onClick={handlePublish}>
                  <Check className="h-4 w-4 mr-1" />{t.post.publish}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default PostAdPage;
