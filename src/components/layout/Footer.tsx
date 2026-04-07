import { Link } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="border-t bg-muted/50 mt-12">
      <div className="container py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold text-primary mb-4">{t.site.name}</h3>
            <p className="text-sm text-muted-foreground">{t.site.slogan}</p>
            <p className="text-sm text-muted-foreground mt-2">{t.site.description}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">{t.footer.about}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-primary">{t.footer.about}</Link></li>
              <li><Link to="/how-it-works" className="hover:text-primary">{t.footer.howItWorks}</Link></li>
              <li><Link to="/rules" className="hover:text-primary">{t.footer.rules}</Link></li>
              <li><Link to="/faq" className="hover:text-primary">{t.footer.faq}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Légal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/privacy" className="hover:text-primary">{t.footer.privacy}</Link></li>
              <li><Link to="/terms" className="hover:text-primary">{t.footer.terms}</Link></li>
              <li><Link to="/contact" className="hover:text-primary">{t.footer.contact}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">{t.footer.followUs}</h4>
            <div className="flex gap-3">
              <a href="#" className="text-muted-foreground hover:text-primary text-sm">Facebook</a>
              <a href="#" className="text-muted-foreground hover:text-primary text-sm">Twitter</a>
              <a href="#" className="text-muted-foreground hover:text-primary text-sm">Instagram</a>
            </div>
          </div>
        </div>
        <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} {t.site.name}. {t.footer.allRights}.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
