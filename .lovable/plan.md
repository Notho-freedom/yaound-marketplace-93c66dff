# Explorer — Améliorations UX (menu latéral, page GitHub, prévisualisation médias, tooltips)

## 1. Menu latéral redimensionnable
- Envelopper `RealExplorerSidebar` + zone de contenu dans un `ResizablePanelGroup` (horizontal).
- Sidebar : `defaultSize` calculé (240px), `minSize=8`, `maxSize=30`, `collapsible`.
- Handle visible avec bouton pour replier/étendre. État persistant (localStorage).

## 2. Page détails GitHub — réorganisation

### En-tête (retrait + relocalisation)
- Supprimer le mini-header (h-10) contenant : flèche retour, avatar, nom du repo, badge SHA, bouton actualiser.
- Rendre ces éléments dans la `Toolbar` principale via une nouvelle prop `githubHeader?: React.ReactNode` — visibles UNIQUEMENT sur la page détails d'un dépôt.
- `ExplorerTab` détecte le contexte (`showGithub && selectedRepo`) et fournit ces boutons.

### Pied de page (retrait + relocalisation)
- Supprimer la mini status bar (h-6) contenant : branche, stars, forks, watchers, issues, visibilité.
- `StatusBar` accepte une prop `contextInfo?: React.ReactNode`. Quand on est sur les détails d'un dépôt, on injecte ces éléments (badge « issues » en jaune pour cardinal > 0).
- Se met à jour automatiquement pour chaque dépôt et disparaît en sortie de page.

### Panneau commits — comportement adaptatif
- Détecter la largeur du panel via `ResizablePanel` `onResize` (ou `ResizeObserver`). Si largeur < 180px (~10% viewport) :
  - Masquer complètement le panneau droit.
  - Afficher un `<select>` dans la barre de titre de l'éditeur ("Commit : sha — message"), qui appelle `openCommit(sha)`.
- Sinon, garder l'affichage panneau actuel.

### Édition Monaco + commit
- Passer Monaco en `readOnly: false` quand un fichier est sélectionné.
- Ajouter un bouton "Commit" dans l'en-tête de l'éditeur, actif dès qu'il y a des modifs non sauvegardées.
- Modale de commit : champ message + bouton « Commit ». Appel à l'API GitHub `PUT /repos/:owner/:repo/contents/:path` (Base64, `sha` du blob courant).
- Toast de succès + rechargement du fichier.

## 3. Sidebar — corrections comportement

### Clic sur dépôt GitHub
- Actuellement `onNavigate('virtual:demo-github')` → aucun effet spécifique. 
- Ajouter un event global `github:open-repo` (avec `fullName`) émis depuis la sidebar et écouté dans `ExplorerTab` → active `showGithub=true` + `openRepo(repo)` directement.

### Clic sur disque → arbre déplié
- Dans `RealExplorerSidebar`, un clic sur un lecteur doit aussi appeler `toggleExpand(mount)` en plus de `onNavigate(mount)` — pas seulement quand on clique sur le chevron.
- Auto-charger les enfants au premier clic si non chargés.

### Bouton "+" section GitHub
- Ajouter une prop `action` sur la section GitHub (comme la section Réseau).
- Bouton `+` ouvre une nouvelle modale `GitHubAuthDialog` (basée sur `NewConnectionDialog` visuellement).
- `GitHubAuthCard` devient le corps de cette modale — le panneau GitHub principal l'utilise aussi si aucun token n'existe (fallback).

## 4. Ouverture de médias → panel de prévisualisation
- Dans `handleOpen` de `ExplorerTab`, quand `file.type` ∈ `image|video|audio`, forcer l'ouverture de `PreviewPanel` (`explorer.openPreview()`) même sur simple clic (pas seulement double-clic sur non-folder).
- `PreviewPanel` existe déjà — vérifier qu'il gère bien video/audio et enrichir si nécessaire.

## 5. Tooltips personnalisés premium
- Créer `RichTooltip` (wrapper autour de `Tooltip` shadcn) avec :
  - Style verre dépoli, ombre douce, coins arrondis 6px.
  - Support titre + description + raccourci clavier (badges monospace).
  - Micro-animation d'entrée (fade + slide 4px).
- Remplacer les tooltips de la Toolbar principale et boutons de la sidebar par ce composant.

## 6. Correction "Nouveau dossier / fichier / terminal"
- `NewMenu` déclenche `onNewFolder` → `explorer.createFolder()` — vérifier que cette fonction du hook `useFileExplorer` fait réellement apparaître un élément en mode rename dans la grille.
- Debugger : suivre le flux `createFolder` → `startRename` → affichage dans `FileGrid`. Corriger le hook si l'item n'est pas ajouté à `currentChildren`.
- `handleNewFile` : actuellement appelle `createFolder()` — remplacer par une vraie création de fichier avec extension appropriée.
- Terminal : vérifier que `TerminalPanel` s'affiche bien quand `terminalOpen=true`.

## Ordre d'implémentation
1. Sidebar redimensionnable + fixes de clic (disque + repo)
2. Bouton + GitHub avec modale d'ajout de compte
3. Toolbar : injection du header GitHub + StatusBar : injection du footer GitHub
4. Suppression du header/footer local du GitHubPanel détails
5. Panneau commits adaptatif + select fallback
6. Édition Monaco + commit
7. Preview auto-ouverture pour médias
8. RichTooltip + intégration
9. Correction création dossier/fichier et terminal

## Notes techniques
- L'édition/commit GitHub nécessite le scope `repo` (déjà demandé dans le lien PAT).
- Le redimensionnement du panneau commits utilise `ResizeObserver` sur son conteneur (`ResizablePanel` ne fournit pas d'événement direct).
- Le `<select>` de commits reste natif (pas de shadcn) pour rester ultra-compact dans la barre.