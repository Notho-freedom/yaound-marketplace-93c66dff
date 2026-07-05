# Plan complet — Explorer réel + refonte UX GitHub/Sidebar

Objectif: finir en une seule passe (a) toutes les actions fichiers réelles via `explorer-server.mjs`, (b) la refonte visuelle demandée (dossiers jaunes, empty states centrés, toolbar contextuelle, sliders partout), (c) la refonte de la page GitHub (Monaco, header éclaté, commit navigable, multi-comptes), (d) previews médias au clic, (e) sidebar « Ce PC » arborescente avec chevrons, (f) connecteurs réseau étendus.

Aucune simulation ne subsiste à la fin: tout job vient d'un événement serveur.

---

## 1. Backend `scripts/explorer-server.mjs` — endpoints réels + SSE

Nouveaux endpoints, tous streamés en SSE quand ils sont longs:

- `POST /api/fs/mkdir`, `/api/fs/rename`, `/api/fs/new-file`, `/api/fs/duplicate`
- `POST /api/fs/delete` — SSE `{type:"progress",file,index,total}` puis `{type:"done"}`
- `POST /api/fs/copy`, `/api/fs/move` — SSE avec `bytes/total/currentFile`
- `POST /api/fs/compress` (archiver), `/api/fs/extract` (unzipper) — SSE
- `GET  /api/fs/properties?path=…` — taille récursive, perms, dates
- `POST /api/shell/exec` (WebSocket via `node-pty`) — terminal réel
- `GET  /api/devices/mobile` — WPD/PowerShell (Win), `system_profiler`+`/Volumes` (mac), `lsusb`+`gio mount` (Linux)
- `GET  /api/github/repos?sort=updated&per_page=8` — proxy authentifié
- `POST /api/sources` — CRUD sources typées (FTP/SFTP/SMB/WebDAV/GDrive/OneDrive/Dropbox/S3), stockage AES-256-GCM dans `~/.cognitive-explorer/sources.json`
- Drivers `sourceDriver(type).list/read/write/delete` uniformes (basic-ftp, ssh2-sftp-client, @marsaud/smb2, webdav, googleapis, @microsoft/microsoft-graph-client, dropbox, @aws-sdk/client-s3)

Format SSE unifié: `data: {"type":"progress"|"done"|"error", …}\n\n`.

## 2. Frontend — fin des simulations

- `useFileOperations.ts`: retirer le `setInterval`, ouvrir `EventSource` sur l'endpoint, mettre à jour `copiedBytes/currentItem/processed[]` en direct. Job clos uniquement sur `done`.
- `CopyDetailDialog.tsx`: liste scrollable des fichiers traités avec ⏳/✓/✗.
- `useRealFileExplorer.ts`: rename/mkdir/delete/newFile/duplicate → API directe, plus aucun fallback mock.
- `TerminalPanel.tsx`: WebSocket `/api/shell/exec` (node-pty), bouton « Se connecter » masqué si déjà attaché.
- Nouveau helper `apiClient.ts` → `sse(path, body, onEvent)`.

## 3. Icônes dossier jaunes + fichiers propres

- `iconRegistry.ts`: substituer `locationIcons.folder`/`folderOpen` par les SVG `default_folder(_opened).svg` de **vscode-icons** (jaunes). Idem `folderNameIconMap` — garder uniquement les folders « fonctionnels » (git, node_modules, downloads…) en couleur, tout le reste devient jaune classique.
- `FileIcon.tsx`: taille 16-20 px, `image-rendering: crisp-edges`, fallback emoji compact.

## 4. Empty states centrés

- `EmptyState.tsx` déjà centré ✓ — auditer chaque vue et **retirer** les listes de sources décoratives quand la vue est réellement vide (Réseau, Cloud, Corbeille, Recherche, Favoris, Récents, Mobile). Si zéro élément → uniquement l'EmptyState + CTA.

## 5. Toolbar contextuelle

- `Toolbar.tsx`: prop `contextActions?: ReactNode` injectée avant « Trier ».
- Vue Réseau → menu `+ Connexion` (FTP/SFTP/SMB/WebDAV/GDrive/OneDrive/Dropbox/S3).
- Vue GitHub non-auth → bouton « Se connecter ».
- Vue Dossier → « Nouveau » harmonisé avec `NewMenu`.
- Retirer le « + » posé dans le corps de la page réseau (garder celui de la sidebar).

## 6. Sidebar — « Ce PC » arborescente + multi-comptes

- `RealExplorerSidebar.tsx`:
  - Chaque disque et chaque dossier avec enfants affiche un **chevron** ▸/▾ (les vides n'en ont pas). Clic sur le chevron déplie l'arborescence dans la sidebar. Clic sur le label ouvre le contenu dans le tab actif. Chargement lazy via `/api/fs/list`.
  - Section **GitHub**: icône `+` à côté du titre → dialog « Ajouter un compte GitHub » (token PAT). Multi-comptes stockés dans `~/.cognitive-explorer/github.json`, sélecteur de compte actif.
  - Sous « Dépôts » du compte actif: 8 dépôts les plus récents (rafraîchis toutes les 5 min ou à la demande), clic → GitHubPanel.
  - Section **Réseau**: icône `+` → même `NewConnectionDialog` (§7). Liste les sources connectées avec icône par type.

## 7. `NewConnectionDialog.tsx` (remplace `FtpConnectionDialog`)

Sélecteur de type + champs adaptés:
- FTP/FTPS/SFTP: host, port, user, pass/key
- SMB: host, share, domain, user, pass
- WebDAV: URL, user, pass
- Google Drive: client ID/secret utilisateur + device flow
- OneDrive: OAuth Microsoft
- Dropbox: app key + code
- S3/MinIO: endpoint, region, access/secret, bucket

Persistance chiffrée côté serveur (§1).

## 8. Refonte page GitHub (`GitHubPanel.tsx`)

- **Header dissous**:
  - Flèche Retour + avatar langage + nom du dépôt → dans la **Toolbar** (slot `contextActions`).
  - Description → **tooltip** sur le nom.
  - Branche, ⭐, forks, watchers, visibilité privé/public → **StatusBar** (bottom).
  - Bouton « Ouvrir sur GitHub » **supprimé**.
  - Le contenu (arborescence + éditeur) occupe tout l'espace récupéré.
- **Monaco Editor** (`@monaco-editor/react`) pour l'affichage du code, thème `vs-dark` accordé aux tokens Midnight Indigo, langue détectée par extension.
- **Commits navigables**: clic sur un commit → rechargement de l'arborescence à ce SHA via `GET /repos/:o/:r/git/trees/:sha?recursive=1`, badge « @sha1234 » dans la Toolbar, bouton « Revenir à HEAD ». Aucun `window.open`.
- **Slider** (Resizable) entre arborescence et éditeur.

## 9. Previews médias automatiques

- `PreviewPanel.tsx`: au **clic simple** sur un fichier média (image, vidéo, audio, PDF, texte, code) → panneau preview s'ouvre automatiquement (image `<img>`, vidéo `<video controls>`, audio `<audio controls>`, PDF via `<embed>`, texte/code via Monaco read-only). Toggle pour désactiver.
- Chargement via `/api/fs/read?path=…` en stream, ou URL blob pour les binaires.

## 10. Sliders partout (Resizable)

Utiliser `src/components/ui/resizable.tsx` (déjà présent) pour:
- Sidebar ↔ zone de contenu (RealExplorerTab)
- Arborescence GitHub ↔ Monaco (GitHubPanel)
- Contenu ↔ PreviewPanel
- SplitView gauche ↔ droite (déjà fait, à vérifier)
- Terminal (hauteur ajustable)

Persister les tailles dans `localStorage`.

## 11. Loading & feedback

- `LoadingShimmer.tsx` (déjà présent) — l'utiliser partout à la place des spinners: listes fichiers, chargement dépôt, chargement preview.
- Dot pulse indigo pour actions ponctuelles.

## 12. Nettoyage menus contextuels

- `contextMenuConfig.tsx`: retirer « Remonter ». Vérifier cohérence par cible.
- « Renommer » branché sur `/api/fs/rename`.

## 13. Fichiers touchés

**Backend**
- `scripts/explorer-server.mjs`, nouveau `scripts/source-drivers/*.mjs`, `scripts/crypto.mjs`, `scripts/pty.mjs`

**Nouveaux composants**
- `NewConnectionDialog.tsx`, `AddGithubAccountDialog.tsx`, `GithubAccountSwitcher.tsx`, `SidebarTree.tsx`, `MonacoCode.tsx`, `MediaPreview.tsx`, `DeletionProgressList.tsx`

**Refactor**
- `useFileOperations.ts`, `useRealFileExplorer.ts`, `apiClient.ts` (+ helper SSE)
- `CopyDetailDialog.tsx`, `CopyProgressBar.tsx`, `Toolbar.tsx`, `StatusBar.tsx`
- `RealExplorerSidebar.tsx` (tree + chevrons + multi-comptes + `+` réseau)
- `RealExplorerTab.tsx` (slider sidebar, toolbar contextuelle)
- `GitHubPanel.tsx` (header éclaté, Monaco, commit → tree SHA, slider)
- `PreviewPanel.tsx` (auto-preview au clic, Monaco RO)
- `MobileDeviceView.tsx`, `TerminalPanel.tsx`
- `FileIcon.tsx`, `icons/iconRegistry.ts` (dossiers jaunes)
- `contextMenuConfig.tsx`

**Dépendances à ajouter**
- Runtime: `@monaco-editor/react`, `monaco-editor`
- Backend: `archiver`, `unzipper`, `basic-ftp`, `ssh2-sftp-client`, `@marsaud/smb2`, `webdav`, `googleapis`, `@microsoft/microsoft-graph-client`, `dropbox`, `@aws-sdk/client-s3`, `node-pty`, `ws`

## Section technique

- SSE: `Content-Type: text/event-stream`, keep-alive 15 s, `AbortController` côté client pour cancel.
- Chiffrement sources: AES-256-GCM, clé dérivée `scrypt(os.hostname()+machineId, salt)`, salt persisté `~/.cognitive-explorer/key`.
- Multi-comptes GitHub: `[{id,label,token,scopes,addedAt}]`, header `Authorization: Bearer <token>` du compte actif; refresh dépôts récents via `If-None-Match` (ETag).
- Sidebar tree lazy: expansion appelle `/api/fs/list?path=…` et met en cache 30 s.
- Monaco: import dynamique pour éviter d'alourdir le bundle initial; worker via Vite `?worker`.
- Commit navigation: `git/trees/:sha?recursive=1` puis `git/blobs/:sha` pour le contenu; badge SHA + bouton HEAD dans Toolbar.
- Sliders: persister `panel-size:<id>` dans `localStorage` via `onLayout` de `react-resizable-panels`.
- Node-pty: fallback `child_process.spawn` si binaire indisponible (message clair, pas de crash).
