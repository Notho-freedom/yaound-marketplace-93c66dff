
# 🇨🇲 Njoka — Le Bazaraki du Cameroun

## Nom & Identité
- **Nom** : Njoka (inspiré du concept de marché/rassemblement)
- **Slogan** : "Le N°1 du Cameroun" 
- **Style** : Marketplace classique fonctionnel (comme Bazaraki), fond blanc, accents vert/rouge/jaune
- **Devise** : FCFA
- **Langues** : Français 🇫🇷 + Anglais 🇬🇧 (switch en header)
- **Régions** : Les 10 régions du Cameroun avec toutes leurs villes principales

---

## Pages & Vues à construire

### 1. Header global (toutes pages)
- Logo Njoka + slogan
- Barre de recherche + filtre par région/ville
- Boutons : Compte personnel, Favoris ⭐, Messages 💬, Switch FR/EN
- Bouton CTA : **"Publier une annonce"**

### 2. Page d'accueil
- Grille de catégories avec icônes (exactement comme Bazaraki)
- Sous-catégories en hover/dropdown
- Sections de annonces premium par catégorie (carrousels horizontaux)
- Footer avec liens utiles, contact, réseaux sociaux

### 3. Catégories complètes (calquées sur Bazaraki)
- **Immobilier à vendre** : Maisons, Appartements, Terrains, Locaux commerciaux, Immeubles
- **Immobilier à louer** : Maisons, Appartements, Chambres/Colocations, Studios, Court terme
- **Véhicules & Motos** : Voitures, Motos, Pièces auto, Location voitures, Camions, Bus, Remorques
- **Emplois** : Administration, Marketing, BTP, Éducation, Santé, IT, Ventes, Sécurité, Ménage, etc.
- **Téléphones & Communication** : Téléphones mobiles, Accessoires, Montres connectées, Pièces
- **Enfants & Bébés** : Vêtements enfants, Jouets, Poussettes, Meubles bébé, Fournitures scolaires
- **Vêtements & Accessoires** : Vêtements, Chaussures, Sacs, Bijoux, Montres, Lunettes
- **Informatique & Jeux** : PC, Laptops, Tablettes, Imprimantes, Consoles, Logiciels
- **Électronique & Électroménager** : Audio, TV, Climatisation, Cuisine, Caméras, Énergie solaire
- **Maison, Jardin & Piscine** : Meubles, Décoration, Matériaux BTP, Cuisine, Outils, Jardinage
- **Loisirs, Sports** : Vélos, Instruments musique, Articles de sport, Hobbies
- **Animaux** : Chiens, Chats, Oiseaux, Animaux de ferme, Accessoires, Adoption
- **Santé & Beauté** : Maquillage, Parfums, Soins, Massages, Services adultes (18+), Produits adultes (18+)
- **Services** : Beauté, Garde d'enfants, IT, Transport, Événements, Mariages, Cours, Marketing digital
- **Business** : Fonds de commerce, Équipement commercial, Meubles de bureau, Fournisseurs
- **Gratuit** : Dons et objets gratuits

### 4. Page liste d'annonces (résultats)
- Filtres latéraux : prix min/max, région/ville, type, état (neuf/occasion), tri
- Vue grille et vue liste (toggle)
- Cards annonces : image, prix FCFA, titre, localisation, date, badge premium/urgent
- Pagination
- Nombre total de résultats

### 5. Page détail annonce
- Galerie photos (carrousel, lightbox plein écran)
- Titre, prix FCFA, localisation, date publication
- Description complète
- Spécifications (selon catégorie : surface, chambres pour immobilier / km, année pour véhicules, etc.)
- Informations vendeur (nom, photo, date d'inscription, nombre d'annonces)
- Boutons : Appeler 📞, Envoyer message 💬, Ajouter aux favoris ⭐, Signaler 🚩, Partager
- Annonces similaires en bas
- Carte de localisation (position approximative)

### 6. Publier une annonce (formulaire multi-étapes)
- Étape 1 : Choisir catégorie → sous-catégorie
- Étape 2 : Titre, description, prix FCFA, état (neuf/occasion)
- Étape 3 : Upload photos (jusqu'à 15), drag & drop pour réordonner
- Étape 4 : Localisation (région + ville)
- Étape 5 : Champs spécifiques selon catégorie (surface, chambres, marque voiture, etc.)
- Étape 6 : Options premium (mise en avant, urgent, top listing) — avec prix en FCFA
- Aperçu final + publier

### 7. Espace utilisateur / Mon compte
- **Tableau de bord** : stats rapides (annonces actives, vues, messages)
- **Mes annonces** : liste avec statuts (active, en attente, expirée, refusée), actions (modifier, supprimer, renouveler, promouvoir)
- **Mes favoris** : liste des annonces sauvegardées
- **Messages / Chat** : messagerie interne entre acheteurs et vendeurs, liste conversations, chat en temps réel
- **Notifications** : alertes (nouveau message, annonce expirée, etc.)
- **Mon profil** : modifier infos, photo, numéro de téléphone, localisation
- **Paramètres** : langue, notifications email/push

### 8. Authentification
- Page Connexion (email + mot de passe)
- Page Inscription (nom, email, téléphone, mot de passe)
- Mot de passe oublié
- Vérification email/téléphone

### 9. Profil vendeur public
- Photo, nom, date d'inscription
- Nombre d'annonces, évaluation
- Liste de ses annonces actives

### 10. Pages statiques
- À propos de Njoka
- Comment ça marche
- Règles de publication
- Politique de confidentialité
- Conditions d'utilisation
- Contact / Support
- FAQ

### 11. Page recherche avancée
- Tous les filtres combinés : catégorie, sous-catégorie, prix, localisation, mots-clés, état, tri

### 12. Notifications
- Centre de notifications (dropdown + page dédiée)
- Types : nouveaux messages, annonce vue X fois, annonce qui expire, réponse reçue

---

## Workflows UX complets
1. **Parcourir** : Accueil → Catégorie → Filtrer → Voir annonce → Contacter vendeur
2. **Publier** : S'inscrire/Se connecter → Publier annonce (multi-étapes) → Gérer dans Mon compte
3. **Acheter/Louer** : Rechercher → Filtrer → Voir détails → Chat/Appeler vendeur → Ajouter aux favoris
4. **Gérer** : Mon compte → Mes annonces → Modifier/Supprimer/Renouveler/Promouvoir
5. **Communiquer** : Messagerie interne acheteur ↔ vendeur
6. **Notifications** : Alertes en temps réel sur nouvelles interactions

---

## Données de démo
- Annonces fictives avec photos placeholder pour chaque catégorie
- Vendeurs fictifs camerounais
- Villes : Douala, Yaoundé, Bafoussam, Bamenda, Garoua, Maroua, Bertoua, Ebolowa, Buéa, Kribi, Limbé, Ngaoundéré

## Responsive
- Desktop, tablette et mobile (mobile-first pour le Cameroun)
