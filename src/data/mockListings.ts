import { Listing, Conversation, Notification } from '@/types';

const placeholderImg = '/placeholder.svg';

export const mockListings: Listing[] = [
  {
    id: '1', title: 'Appartement 3 chambres à Bonamoussadi', description: 'Bel appartement de 3 chambres avec salon, cuisine équipée, 2 salles de bain. Quartier calme, proche des commerces. Disponible immédiatement.',
    price: 150000, currency: 'FCFA', categoryId: 'real-estate-rent', subcategoryId: 'apartments-rent',
    region: 'Littoral', city: 'Douala', images: [placeholderImg], condition: undefined,
    isPremium: true, isUrgent: false, createdAt: '2025-12-01', views: 342,
    seller: { id: 's1', name: 'Jean-Pierre Kamga', joinedAt: '2024-03-15', listingsCount: 12, rating: 4.5 },
    specs: { surface: '120 m²', chambres: '3', sallesDeBain: '2', étage: '2ème' },
  },
  {
    id: '2', title: 'Toyota Corolla 2019 - Très bon état', description: 'Toyota Corolla 2019, essence, boîte automatique, climatisation, 45 000 km. Véhicule bien entretenu, carnet de bord disponible.',
    price: 8500000, currency: 'FCFA', categoryId: 'vehicles', subcategoryId: 'cars',
    region: 'Centre', city: 'Yaoundé', images: [placeholderImg], condition: 'used',
    isPremium: true, isUrgent: true, createdAt: '2025-12-05', views: 567,
    seller: { id: 's2', name: 'Paul Ndongo', joinedAt: '2023-06-20', listingsCount: 5, rating: 4.8 },
    specs: { marque: 'Toyota', modèle: 'Corolla', année: '2019', kilométrage: '45 000 km', carburant: 'Essence', transmission: 'Automatique' },
  },
  {
    id: '3', title: 'iPhone 14 Pro Max 256GB', description: 'iPhone 14 Pro Max 256GB, couleur Deep Purple, acheté neuf en France. État impeccable, avec boîte et accessoires d\'origine.',
    price: 450000, currency: 'FCFA', categoryId: 'phones', subcategoryId: 'mobile-phones',
    region: 'Littoral', city: 'Douala', images: [placeholderImg], condition: 'used',
    isPremium: false, isUrgent: false, createdAt: '2025-12-10', views: 234,
    seller: { id: 's3', name: 'Marie Fotso', joinedAt: '2024-01-10', listingsCount: 3, rating: 4.2 },
    specs: { marque: 'Apple', modèle: 'iPhone 14 Pro Max', stockage: '256 GB', couleur: 'Deep Purple' },
  },
  {
    id: '4', title: 'Terrain 500m² à Logpom', description: 'Terrain titré de 500m² à Logpom, zone résidentielle, accès facile, idéal pour construction. Documents en règle.',
    price: 15000000, currency: 'FCFA', categoryId: 'real-estate-sale', subcategoryId: 'land',
    region: 'Littoral', city: 'Douala', images: [placeholderImg], condition: undefined,
    isPremium: true, isUrgent: false, createdAt: '2025-11-28', views: 189,
    seller: { id: 's4', name: 'Albert Nkomo', joinedAt: '2022-08-01', listingsCount: 20, rating: 4.9 },
    specs: { surface: '500 m²', titre: 'Oui', type: 'Résidentiel' },
  },
  {
    id: '5', title: 'Recherche Développeur Web Full-Stack', description: 'Entreprise de technologie à Yaoundé recherche un développeur web full-stack (React, Node.js). CDI, salaire compétitif. Minimum 3 ans d\'expérience.',
    price: 350000, currency: 'FCFA', categoryId: 'jobs', subcategoryId: 'it-jobs',
    region: 'Centre', city: 'Yaoundé', images: [placeholderImg], condition: undefined,
    isPremium: false, isUrgent: true, createdAt: '2025-12-12', views: 432,
    seller: { id: 's5', name: 'Tech Solutions SARL', joinedAt: '2023-01-15', listingsCount: 8, rating: 4.6 },
    specs: { type: 'CDI', expérience: '3+ ans', secteur: 'IT' },
  },
  {
    id: '6', title: 'Samsung Galaxy S23 Ultra neuf', description: 'Samsung Galaxy S23 Ultra 256GB, neuf sous blister, garantie 1 an. Couleur Phantom Black.',
    price: 520000, currency: 'FCFA', categoryId: 'phones', subcategoryId: 'mobile-phones',
    region: 'Ouest', city: 'Bafoussam', images: [placeholderImg], condition: 'new',
    isPremium: false, isUrgent: false, createdAt: '2025-12-08', views: 156,
    seller: { id: 's6', name: 'Boutique MobilePlus', joinedAt: '2024-05-20', listingsCount: 45, rating: 4.7 },
    specs: { marque: 'Samsung', modèle: 'Galaxy S23 Ultra', stockage: '256 GB' },
  },
  {
    id: '7', title: 'Moto Haojue 125cc - Occasion', description: 'Moto Haojue 125cc en bon état, idéale pour le transport urbain. Papiers en règle.',
    price: 380000, currency: 'FCFA', categoryId: 'vehicles', subcategoryId: 'motorcycles',
    region: 'Nord', city: 'Garoua', images: [placeholderImg], condition: 'used',
    isPremium: false, isUrgent: false, createdAt: '2025-12-06', views: 98,
    seller: { id: 's7', name: 'Ibrahim Aoudou', joinedAt: '2024-07-10', listingsCount: 2, rating: 4.0 },
    specs: { marque: 'Haojue', cylindrée: '125cc', année: '2023' },
  },
  {
    id: '8', title: 'Canapé 5 places en cuir', description: 'Canapé 5 places en simili cuir, couleur marron, très confortable. Livraison possible à Douala.',
    price: 185000, currency: 'FCFA', categoryId: 'home-garden', subcategoryId: 'furniture',
    region: 'Littoral', city: 'Douala', images: [placeholderImg], condition: 'new',
    isPremium: false, isUrgent: false, createdAt: '2025-12-09', views: 67,
    seller: { id: 's8', name: 'Meubles Prestige', joinedAt: '2023-09-01', listingsCount: 35, rating: 4.4 },
    specs: { matière: 'Simili cuir', places: '5', couleur: 'Marron' },
  },
  {
    id: '9', title: 'MacBook Pro M2 2023', description: 'MacBook Pro 14 pouces, puce M2, 16GB RAM, 512GB SSD. État comme neuf, utilisé 6 mois.',
    price: 950000, currency: 'FCFA', categoryId: 'computers', subcategoryId: 'laptops',
    region: 'Centre', city: 'Yaoundé', images: [placeholderImg], condition: 'used',
    isPremium: true, isUrgent: false, createdAt: '2025-12-11', views: 289,
    seller: { id: 's9', name: 'Christian Mbarga', joinedAt: '2024-02-01', listingsCount: 4, rating: 4.3 },
    specs: { marque: 'Apple', modèle: 'MacBook Pro 14"', processeur: 'M2', RAM: '16 GB', stockage: '512 GB SSD' },
  },
  {
    id: '10', title: 'Climatiseur Split LG 1.5CV', description: 'Climatiseur Split LG 1.5CV, neuf avec garantie. Installation possible. Économie d\'énergie.',
    price: 220000, currency: 'FCFA', categoryId: 'electronics', subcategoryId: 'ac',
    region: 'Littoral', city: 'Douala', images: [placeholderImg], condition: 'new',
    isPremium: false, isUrgent: true, createdAt: '2025-12-07', views: 145,
    seller: { id: 's10', name: 'ElectroCool Cameroun', joinedAt: '2023-04-15', listingsCount: 28, rating: 4.6 },
    specs: { marque: 'LG', puissance: '1.5 CV', type: 'Split', garantie: '2 ans' },
  },
  {
    id: '11', title: 'Robe de soirée pailletée', description: 'Magnifique robe de soirée pailletée, taille M/L. Portée une seule fois. Idéale pour événements et mariages.',
    price: 35000, currency: 'FCFA', categoryId: 'fashion', subcategoryId: 'clothing',
    region: 'Centre', city: 'Yaoundé', images: [placeholderImg], condition: 'used',
    isPremium: false, isUrgent: false, createdAt: '2025-12-04', views: 78,
    seller: { id: 's11', name: 'Cécile Ngono', joinedAt: '2024-08-01', listingsCount: 15, rating: 4.1 },
  },
  {
    id: '12', title: 'Service traiteur pour événements', description: 'Service traiteur professionnel pour mariages, anniversaires, baptêmes. Cuisine camerounaise et internationale. Devis gratuit.',
    price: 0, currency: 'FCFA', categoryId: 'services', subcategoryId: 'events',
    region: 'Littoral', city: 'Douala', images: [placeholderImg], condition: undefined,
    isPremium: false, isUrgent: false, createdAt: '2025-12-03', views: 112,
    seller: { id: 's12', name: 'Saveurs du Pays', joinedAt: '2023-11-01', listingsCount: 3, rating: 4.8 },
  },
];

export const mockConversations: Conversation[] = [
  { id: 'c1', participantId: 's1', participantName: 'Jean-Pierre Kamga', listingId: '1', listingTitle: 'Appartement 3 chambres à Bonamoussadi', lastMessage: 'Bonjour, l\'appartement est-il toujours disponible ?', lastMessageAt: '2025-12-12T14:30:00', unreadCount: 2 },
  { id: 'c2', participantId: 's2', participantName: 'Paul Ndongo', listingId: '2', listingTitle: 'Toyota Corolla 2019', lastMessage: 'Quel est votre dernier prix ?', lastMessageAt: '2025-12-11T09:15:00', unreadCount: 0 },
  { id: 'c3', participantId: 's6', participantName: 'Boutique MobilePlus', listingId: '6', listingTitle: 'Samsung Galaxy S23 Ultra neuf', lastMessage: 'Oui nous livrons à Douala.', lastMessageAt: '2025-12-10T16:45:00', unreadCount: 1 },
];

export const mockNotifications: Notification[] = [
  { id: 'n1', type: 'message', title: 'Nouveau message', body: 'Jean-Pierre Kamga vous a envoyé un message', read: false, createdAt: '2025-12-12T14:30:00', link: '/messages' },
  { id: 'n2', type: 'listing_view', title: 'Votre annonce est populaire !', body: 'Votre annonce "Toyota Corolla 2019" a atteint 500 vues', read: false, createdAt: '2025-12-11T10:00:00', link: '/listing/2' },
  { id: 'n3', type: 'listing_expiry', title: 'Annonce bientôt expirée', body: 'Votre annonce "iPhone 14 Pro Max" expire dans 3 jours', read: true, createdAt: '2025-12-10T08:00:00', link: '/dashboard/listings' },
  { id: 'n4', type: 'listing_approved', title: 'Annonce approuvée', body: 'Votre annonce "Canapé 5 places" a été approuvée', read: true, createdAt: '2025-12-09T12:00:00', link: '/listing/8' },
];
