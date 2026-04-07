export const formatPrice = (price: number): string => {
  if (price === 0) return 'Gratuit';
  return price.toLocaleString('fr-FR') + ' FCFA';
};

export const formatDate = (dateStr: string, lang: 'fr' | 'en' = 'fr'): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
};

export const timeAgo = (dateStr: string, lang: 'fr' | 'en' = 'fr'): string => {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return lang === 'fr' ? "Aujourd'hui" : 'Today';
  if (diffDays === 1) return lang === 'fr' ? 'Hier' : 'Yesterday';
  if (diffDays < 7) return lang === 'fr' ? `Il y a ${diffDays} jours` : `${diffDays} days ago`;
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return lang === 'fr' ? `Il y a ${weeks} semaine${weeks > 1 ? 's' : ''}` : `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  }
  return formatDate(dateStr, lang);
};
