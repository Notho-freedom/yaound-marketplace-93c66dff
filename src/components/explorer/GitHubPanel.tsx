import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, FileText, Folder, GitCommit, GitPullRequest, Search, GitFork, Eye, Clock, Lock, Globe, LogOut, RefreshCw, Loader2, AlertCircle, Star, GitBranch, FileCode2, Undo2 } from 'lucide-react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import Editor from '@monaco-editor/react';
import { useI18n } from '@/i18n/LanguageContext';
import { useSound } from '@/hooks/useSound';
import { HDIcon } from './icons/HDIcon';
import { EmptyState } from './EmptyState';
import { GitHubAuthCard, loadGithubToken, clearGithubToken } from './GitHubAuthCard';
import { api } from '@/lib/apiClient';
import { cn } from '@/lib/utils';

const EXT_LANGUAGE: Record<string, string> = {
  ts: 'typescript', tsx: 'typescript', js: 'javascript', jsx: 'javascript',
  json: 'json', md: 'markdown', mdx: 'markdown', html: 'html', htm: 'html',
  css: 'css', scss: 'scss', less: 'less', py: 'python', rb: 'ruby',
  go: 'go', rs: 'rust', java: 'java', kt: 'kotlin', swift: 'swift',
  c: 'c', h: 'c', cpp: 'cpp', hpp: 'cpp', cs: 'csharp', php: 'php',
  sh: 'shell', bash: 'shell', zsh: 'shell', yml: 'yaml', yaml: 'yaml',
  xml: 'xml', sql: 'sql', vue: 'html', svelte: 'html', toml: 'ini',
  ini: 'ini', dockerfile: 'dockerfile', lock: 'yaml',
};
function detectLanguage(name: string): string {
  const lower = name.toLowerCase();
  if (lower === 'dockerfile') return 'dockerfile';
  const ext = lower.split('.').pop() || '';
  return EXT_LANGUAGE[ext] || 'plaintext';
}

const GH_LOGO = 'https://cdn.jsdelivr.net/gh/PKief/vscode-material-icon-theme@latest/icons/github.svg';
const CACHE_TTL = 5 * 60_000;

const LANGUAGE_LOGOS: Record<string, string> = {
  TypeScript: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
  JavaScript: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
  Python: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
  Java: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
  Go: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg',
  Rust: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-original.svg',
  PHP: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg',
  HTML: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
  CSS: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
  Vue: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg',
  Svelte: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/svelte/svelte-original.svg',
  Dart: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg',
  Kotlin: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg',
  Swift: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg',
};

interface Repo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  default_branch: string;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  open_issues_count: number;
  language: string | null;
  private: boolean;
  html_url: string;
  updated_at: string;
  clone_url?: string;
  ssh_url?: string;
}

interface GitHubUser {
  login: string;
  avatar_url: string;
  message?: string;
}

interface RepoContentItem {
  name: string;
  path: string;
  type: 'file' | 'dir' | 'symlink' | 'submodule';
  size?: number;
  download_url?: string | null;
  html_url?: string;
}

interface CommitItem {
  sha: string;
  html_url: string;
  commit: {
    message: string;
    author?: { name?: string; date?: string };
  };
}

interface GithubCache {
  user: GitHubUser;
  repos: Repo[];
  time: number;
}

interface Props {
  onNavigate: (id: string) => void;
}

function cacheKey(token: string) {
  return `explorer.github.cache.v2:${token.slice(-10)}`;
}

function readGithubCache(token: string): GithubCache | null {
  try {
    const cache = JSON.parse(localStorage.getItem(cacheKey(token)) || 'null') as GithubCache | null;
    if (!cache || Date.now() - cache.time > CACHE_TTL) return null;
    return cache;
  } catch {
    return null;
  }
}

function writeGithubCache(token: string, user: GitHubUser, repos: Repo[]) {
  try {
    localStorage.setItem(cacheKey(token), JSON.stringify({ user, repos, time: Date.now() }));
    // Public snapshot for the sidebar (top-8 recently updated) — no token needed.
    const sorted = [...repos].sort((a, b) => (b.updated_at > a.updated_at ? 1 : -1)).slice(0, 8);
    localStorage.setItem('explorer.github.recent', JSON.stringify({
      user: { login: user.login, avatar_url: user.avatar_url },
      repos: sorted.map((r) => ({ id: r.id, name: r.name, full_name: r.full_name, private: r.private, language: r.language, updated_at: r.updated_at, html_url: r.html_url })),
      time: Date.now(),
    }));
    window.dispatchEvent(new CustomEvent('github:recent-updated'));
  } catch { /* ignore cache */ }
}


function languageLogo(language: string | null) {
  if (!language) return GH_LOGO;
  return LANGUAGE_LOGOS[language] || GH_LOGO;
}

export function GitHubPanel(_: Props) {
  const { t } = useI18n();
  const { play, playHover } = useSound();
  const [token, setToken] = useState<string | null>(() => loadGithubToken());
  const [repos, setRepos] = useState<Repo[] | null>(null);
  const [user, setUser] = useState<{ login: string; avatar_url: string } | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [languageFilter, setLanguageFilter] = useState('all');
  const [visibilityFilter, setVisibilityFilter] = useState<'all' | 'public' | 'private'>('all');
  const [selectedRepo, setSelectedRepo] = useState<Repo | null>(null);
  const [repoPath, setRepoPath] = useState('');
  const [repoItems, setRepoItems] = useState<RepoContentItem[]>([]);
  const [repoCommits, setRepoCommits] = useState<CommitItem[]>([]);
  const [repoReadme, setRepoReadme] = useState<string | null>(null);
  const [repoStatus, setRepoStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [repoError, setRepoError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<{ item: RepoContentItem; text: string } | null>(null);
  const [viewingSha, setViewingSha] = useState<string | null>(null);

  const fetchAll = async (tk: string, opts: { force?: boolean } = {}) => {
    const cached = !opts.force ? readGithubCache(tk) : null;
    if (cached) {
      setUser({ login: cached.user.login, avatar_url: cached.user.avatar_url });
      setRepos(cached.repos);
      setStatus('idle');
      return;
    }
    setStatus('loading'); setError(null);
    try {
      const me = await api.githubGet<GitHubUser>('/user', tk);
      if (me.status !== 200) throw new Error(me.data?.message || `HTTP ${me.status}`);
      const pages: Repo[] = [];
      for (let page = 1; page <= 10; page += 1) {
        const list = await api.githubGet<Repo[]>(`/user/repos?per_page=100&page=${page}&sort=updated&affiliation=owner,collaborator,organization_member`, tk);
        if (!Array.isArray(list.data) || list.data.length === 0) break;
        pages.push(...list.data);
        if (list.data.length < 100) break;
      }
      setUser({ login: me.data.login, avatar_url: me.data.avatar_url });
      setRepos(pages);
      writeGithubCache(tk, me.data, pages);
      setStatus('idle');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Impossible de charger les dépôts.');
    }
  };

  useEffect(() => { if (token) void fetchAll(token); }, [token]);

  const filtered = useMemo(() => {
    if (!repos) return [];
    const q = search.toLowerCase();
    return repos.filter((r) => {
      const matchesSearch = `${r.full_name} ${r.description || ''} ${r.language || ''}`.toLowerCase().includes(q);
      const matchesLanguage = languageFilter === 'all' || (r.language || 'Sans langage') === languageFilter;
      const matchesVisibility = visibilityFilter === 'all' || (visibilityFilter === 'private' ? r.private : !r.private);
      return matchesSearch && matchesLanguage && matchesVisibility;
    });
  }, [languageFilter, repos, search, visibilityFilter]);

  const languages = useMemo(() => {
    const counts = new Map<string, number>();
    for (const repo of repos || []) counts.set(repo.language || 'Sans langage', (counts.get(repo.language || 'Sans langage') || 0) + 1);
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 8);
  }, [repos]);

  const disconnect = () => { clearGithubToken(); setToken(null); setRepos(null); setUser(null); };

  const loadRepo = async (repo: Repo, path = '', ref?: string) => {
    if (!token) return;
    setRepoStatus('loading');
    setRepoError(null);
    setSelectedFile(null);
    const effectiveRef = ref || repo.default_branch;
    try {
      const encodedPath = path.split('/').map(encodeURIComponent).join('/');
      const contents = await api.githubGet<RepoContentItem | RepoContentItem[]>(`/repos/${repo.full_name}/contents/${encodedPath}?ref=${encodeURIComponent(effectiveRef)}`, token);
      if (contents.status !== 200) throw new Error((contents.data as { message?: string }).message || `HTTP ${contents.status}`);
      const items = Array.isArray(contents.data) ? contents.data : [contents.data];
      setRepoItems(items.sort((a, b) => (a.type === 'dir' && b.type !== 'dir' ? -1 : a.type !== 'dir' && b.type === 'dir' ? 1 : a.name.localeCompare(b.name))));
      setRepoPath(path);
      // Commits list always follows the default branch, not the pinned SHA.
      const [commits, readme] = await Promise.all([
        api.githubGet<CommitItem[]>(`/repos/${repo.full_name}/commits?per_page=15&sha=${encodeURIComponent(repo.default_branch)}`, token),
        path ? Promise.resolve(null) : api.githubGet<{ content?: string; encoding?: string }>(`/repos/${repo.full_name}/readme?ref=${encodeURIComponent(effectiveRef)}`, token),
      ]);
      setRepoCommits(Array.isArray(commits.data) ? commits.data : []);
      if (readme && readme.status === 200 && readme.data.content) {
        setRepoReadme(atob(readme.data.content.replace(/\n/g, '')));
      } else if (!path) {
        setRepoReadme(null);
      }
      setRepoStatus('idle');
    } catch (err) {
      setRepoStatus('error');
      setRepoError(err instanceof Error ? err.message : 'Impossible de charger le dépôt.');
    }
  };

  const openRepo = (repo: Repo) => {
    play('open');
    setSelectedRepo(repo);
    setRepoReadme(null);
    setViewingSha(null);
    void loadRepo(repo, '');
  };

  const openCommit = (sha: string) => {
    if (!selectedRepo) return;
    play('open');
    setViewingSha(sha);
    void loadRepo(selectedRepo, '', sha);
  };

  const returnToHead = () => {
    if (!selectedRepo) return;
    setViewingSha(null);
    void loadRepo(selectedRepo, '');
  };

  const openRepoItem = async (item: RepoContentItem) => {
    if (!selectedRepo || !token) return;
    if (item.type === 'dir') {
      play('open');
      void loadRepo(selectedRepo, item.path, viewingSha || undefined);
      return;
    }
    play('dblclick');
    setSelectedFile(null);
    if (!item.download_url || (item.size || 0) > 512_000) {
      setSelectedFile({ item, text: item.download_url ? 'Fichier trop volumineux pour la prévisualisation texte.' : 'Aucune prévisualisation disponible.' });
      return;
    }
    try {
      const res = await fetch(item.download_url);
      const text = await res.text();
      setSelectedFile({ item, text });
    } catch (err) {
      setSelectedFile({ item, text: err instanceof Error ? err.message : 'Lecture impossible.' });
    }
  };

  if (!token) {
    return (
      <div className="flex-1 flex flex-col">
        <div className="px-6 pt-6 pb-4 border-b border-border/30 flex items-center gap-3">
          <HDIcon src={GH_LOGO} size={28} alt="GitHub" fallbackEmoji="🐙" />
          <div>
            <h2 className="text-[15px] font-normal">{t('github.title') || 'GitHub'}</h2>
            <p className="text-[11px] text-muted-foreground font-light">{t('github.subtitle') || 'Vos dépôts, en direct.'}</p>
          </div>
        </div>
        <GitHubAuthCard onAuthenticated={setToken} />
      </div>
    );
  }

  if (status === 'loading' && !repos) {
    return (
      <EmptyState
        icon={<Loader2 className="animate-spin" size={22} />}
        title="Chargement de vos dépôts…"
        description="Nous interrogeons GitHub avec votre token."
      />
    );
  }

  if (status === 'error') {
    return (
      <EmptyState
        icon={<AlertCircle size={22} />}
        title="Impossible de charger GitHub"
        description={error || 'Vérifiez votre token puis réessayez.'}
        actions={
          <div className="flex gap-2">
            <button onClick={() => token && fetchAll(token)} className="h-8 px-3 text-[12px] rounded border border-border/40 hover:bg-[hsl(var(--explorer-hover))] flex items-center gap-1.5">
              <RefreshCw size={11} /> Réessayer
            </button>
            <button onClick={disconnect} className="h-8 px-3 text-[12px] rounded border border-border/40 hover:bg-[hsl(var(--explorer-hover))] flex items-center gap-1.5">
              <LogOut size={11} /> Se déconnecter
            </button>
          </div>
        }
      />
    );
  }

  if (selectedRepo) {
    const pathParts = repoPath.split('/').filter(Boolean);
    const editorLang = selectedFile ? detectLanguage(selectedFile.item.name) : 'markdown';
    const editorValue = selectedFile ? selectedFile.text : (repoReadme ?? '# ' + selectedRepo.name + '\n\nSélectionnez un fichier pour l’ouvrir dans l’éditeur.');
    const editorFilename = selectedFile ? selectedFile.item.path : 'README.md';
    return (
      <div className="flex-1 flex flex-col min-h-0 min-w-0">
        {/* Compact toolbar-like header: back + avatar + name (description in tooltip). No external link. */}
        <div className="h-10 shrink-0 px-3 border-b border-border/30 flex items-center gap-2 bg-[hsl(var(--explorer-surface))]">
          <button
            onClick={() => { setSelectedRepo(null); setSelectedFile(null); setViewingSha(null); }}
            className="h-7 px-2 text-[12px] rounded hover:bg-[hsl(var(--explorer-hover))] flex items-center gap-1.5 shrink-0 text-muted-foreground hover:text-foreground"
            title="Retour aux dépôts"
          >
            <ArrowLeft size={13} />
          </button>
          <HDIcon src={languageLogo(selectedRepo.language)} size={20} alt={selectedRepo.language || 'repo'} fallbackEmoji="📦" />
          <Tooltip>
            <TooltipTrigger asChild>
              <h2 className="text-[13px] font-normal truncate cursor-default">{selectedRepo.full_name}</h2>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-md text-xs">
              <p>{selectedRepo.description || 'Aucune description.'}</p>
            </TooltipContent>
          </Tooltip>
          {viewingSha && (
            <button
              onClick={returnToHead}
              className="ml-2 h-6 px-2 text-[10px] rounded border border-amber-400/40 text-amber-300 hover:bg-amber-400/10 flex items-center gap-1.5 font-mono"
              title="Revenir au HEAD de la branche par défaut"
            >
              <Undo2 size={10} /> @{viewingSha.slice(0, 7)} · HEAD
            </button>
          )}
          <div className="flex-1" />
          <button onClick={() => void loadRepo(selectedRepo, repoPath, viewingSha || undefined)} className="p-1.5 rounded hover:bg-[hsl(var(--explorer-hover))] text-muted-foreground" title="Actualiser">
            <RefreshCw size={12} className={repoStatus === 'loading' ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Body — resizable panels: tree | editor | commits */}
        <ResizablePanelGroup direction="horizontal" className="flex-1 min-h-0 min-w-0" autoSaveId="github-detail">
          <ResizablePanel defaultSize={22} minSize={12} maxSize={45}>
            <div className="h-full flex flex-col min-h-0 bg-[hsl(var(--explorer-surface))]">
              <div className="h-8 px-2 border-b border-border/40 flex items-center gap-1 text-[11px] font-mono overflow-x-auto scrollbar-none">
                <button onClick={() => void loadRepo(selectedRepo, '', viewingSha || undefined)} className="text-primary hover:underline shrink-0">{selectedRepo.name}</button>
                {pathParts.map((part, index) => {
                  const nextPath = pathParts.slice(0, index + 1).join('/');
                  return (
                    <span key={nextPath} className="flex items-center gap-1 shrink-0">
                      <span className="text-muted-foreground">/</span>
                      <button onClick={() => void loadRepo(selectedRepo, nextPath, viewingSha || undefined)} className="hover:text-primary truncate max-w-[100px]" title={part}>{part}</button>
                    </span>
                  );
                })}
              </div>
              <div className="flex-1 overflow-y-auto">
                {repoStatus === 'loading' && repoItems.length === 0 ? (
                  <div className="p-6 text-[12px] text-muted-foreground flex items-center gap-2"><Loader2 size={12} className="animate-spin" /> Chargement…</div>
                ) : repoStatus === 'error' ? (
                  <div className="p-6 text-[12px] text-red-300">{repoError}</div>
                ) : (
                  <div>
                    {repoPath && (
                      <button onClick={() => void loadRepo(selectedRepo, pathParts.slice(0, -1).join('/'), viewingSha || undefined)} className="w-full h-7 px-3 text-left text-[11px] hover:bg-[hsl(var(--explorer-hover))] text-muted-foreground font-mono">.. remonter</button>
                    )}
                    {repoItems.map((item) => {
                      const active = selectedFile?.item.path === item.path;
                      return (
                        <button
                          key={item.path}
                          onClick={() => void openRepoItem(item)}
                          onMouseEnter={playHover}
                          className={cn(
                            'w-full h-7 px-3 flex items-center gap-2 text-left hover:bg-[hsl(var(--explorer-hover))]',
                            active && 'bg-[hsl(var(--explorer-selected))]'
                          )}
                        >
                          {item.type === 'dir'
                            ? <Folder size={13} className="text-amber-300 shrink-0" />
                            : <FileCode2 size={13} className="text-muted-foreground shrink-0" />}
                          <span className="text-[11px] flex-1 truncate">{item.name}</span>
                          {item.type === 'file' && item.size ? (
                            <span className="text-[9px] text-muted-foreground/70 font-mono shrink-0">{item.size < 1024 ? `${item.size}B` : `${Math.round(item.size / 1024)}K`}</span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={56} minSize={30}>
            <div className="h-full flex flex-col min-w-0 min-h-0">
              <div className="h-8 shrink-0 px-3 border-b border-border/40 flex items-center gap-2 text-[11px] font-mono bg-[hsl(var(--explorer-surface))]">
                <FileCode2 size={12} className="text-muted-foreground" />
                <span className="truncate">{editorFilename}</span>
                <span className="ml-2 text-[9px] uppercase text-muted-foreground/70">{editorLang}</span>
              </div>
              <div className="flex-1 min-h-0 min-w-0 relative">
                <Editor
                  height="100%"
                  width="100%"
                  theme="vs-dark"
                  language={editorLang}
                  value={editorValue}
                  options={{
                    readOnly: true,
                    minimap: { enabled: true },
                    fontSize: 13,
                    lineNumbers: 'on',
                    wordWrap: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    renderWhitespace: 'selection',
                    fontFamily: 'JetBrains Mono, Menlo, monospace',
                    smoothScrolling: true,
                  }}
                  loading={<div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-[12px]"><Loader2 size={14} className="animate-spin mr-2" /> Chargement de l’éditeur…</div>}
                />
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={22} minSize={12} maxSize={45}>
            <div className="h-full flex flex-col min-h-0 bg-[hsl(var(--explorer-surface))]">
              <div className="h-8 shrink-0 px-3 border-b border-border/40 flex items-center gap-2 text-[11px] section-label">
                <GitCommit size={11} /> Commits
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {repoCommits.length === 0 && <p className="text-[11px] text-muted-foreground px-2 py-4 text-center">Aucun commit chargé.</p>}
                {repoCommits.map((commit) => {
                  const active = viewingSha === commit.sha;
                  return (
                    <button
                      key={commit.sha}
                      onClick={() => openCommit(commit.sha)}
                      title="Ouvrir les fichiers du dépôt à ce commit"
                      className={cn(
                        'w-full text-left text-[11px] p-2 rounded border transition-colors',
                        active
                          ? 'border-primary/60 bg-primary/10 text-foreground'
                          : 'border-border/30 hover:border-primary/40 hover:bg-[hsl(var(--explorer-hover))]'
                      )}
                    >
                      <p className="line-clamp-2 leading-tight">{commit.commit.message.split('\n')[0]}</p>
                      <p className="text-muted-foreground font-mono text-[9px] mt-1 flex items-center gap-1">
                        <span>{commit.sha.slice(0, 7)}</span>
                        <span>·</span>
                        <span className="truncate">{commit.commit.author?.name || 'GitHub'}</span>
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>

        {/* Bottom mini status: branch, stars, forks, watchers, visibility. */}
        <div className="h-6 shrink-0 border-t border-border/40 bg-[hsl(var(--explorer-surface))] flex items-center gap-3 px-3 text-[10px] text-muted-foreground font-mono">
          <span className="flex items-center gap-1"><GitBranch size={10} /> {selectedRepo.default_branch}</span>
          <span className="flex items-center gap-1"><Star size={10} /> {selectedRepo.stargazers_count}</span>
          <span className="flex items-center gap-1"><GitFork size={10} /> {selectedRepo.forks_count}</span>
          <span className="flex items-center gap-1"><Eye size={10} /> {selectedRepo.watchers_count}</span>
          {selectedRepo.open_issues_count > 0 && (
            <span className="flex items-center gap-1 text-amber-400/80"><GitPullRequest size={10} /> {selectedRepo.open_issues_count}</span>
          )}
          <span className="flex items-center gap-1">{selectedRepo.private ? <Lock size={10} /> : <Globe size={10} />} {selectedRepo.private ? 'Privé' : 'Public'}</span>
          <div className="flex-1" />
          <span className="text-muted-foreground/70">{repoItems.length} entrée(s){viewingSha ? ` · @${viewingSha.slice(0, 7)}` : ''}</span>
        </div>
      </div>
    );
  }



  return (
    <div className="flex-1 overflow-auto">
      <div className="px-6 pt-6 pb-4 border-b border-border/30">
        <div className="flex items-center gap-3 mb-4">
          {user?.avatar_url ? (
            <img src={user.avatar_url} alt={user.login} className="w-9 h-9 rounded-full border border-border/40" />
          ) : (
            <HDIcon src={GH_LOGO} size={32} alt="GitHub" fallbackEmoji="🐙" />
          )}
          <div className="flex-1 min-w-0">
            <h2 className="text-[16px] font-normal text-foreground">{t('github.title') || 'GitHub'}</h2>
            <p className="text-[11px] text-muted-foreground font-light">
              Connecté en tant que <span className="font-mono text-foreground/80">{user?.login}</span>
            </p>
          </div>
          <div className="flex gap-3 text-[11px] text-muted-foreground items-center">
            <span className="flex items-center gap-1"><GitBranch size={11} className="text-primary/70" /> {repos?.length || 0} repos</span>
            <button onClick={() => token && fetchAll(token, { force: true })} className="p-1 rounded hover:bg-[hsl(var(--explorer-hover))]" title="Actualiser">
              <RefreshCw size={12} className={status === 'loading' ? 'animate-spin' : ''} />
            </button>
            <button onClick={disconnect} className="p-1 rounded hover:bg-[hsl(var(--explorer-hover))]" title="Se déconnecter">
              <LogOut size={12} />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-72">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
            <input
              value={search}
              onContextMenu={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher dans les dépôts…"
              className="allow-select w-full h-7 pl-7 pr-2 text-[12px] font-light bg-[hsl(var(--muted))] border border-border/30 rounded outline-none focus:border-primary/40"
            />
          </div>
          {(['all', 'public', 'private'] as const).map((value) => (
            <button
              key={value}
              onClick={() => setVisibilityFilter(value)}
              className={cn('h-7 px-2 text-[11px] rounded border border-border/40 hover:bg-[hsl(var(--explorer-hover))]', visibilityFilter === value && 'bg-primary/15 text-primary border-primary/30')}
            >
              {value === 'all' ? 'Tous' : value === 'public' ? 'Publics' : 'Privés'}
            </button>
          ))}
          <button
            onClick={() => setLanguageFilter('all')}
            className={cn('h-7 px-2 text-[11px] rounded border border-border/40 hover:bg-[hsl(var(--explorer-hover))]', languageFilter === 'all' && 'bg-primary/15 text-primary border-primary/30')}
          >
            Langages
          </button>
          {languages.map(([language, count]) => (
            <button
              key={language}
              onClick={() => setLanguageFilter(language)}
              className={cn('h-7 px-2 text-[11px] rounded border border-border/40 hover:bg-[hsl(var(--explorer-hover))] flex items-center gap-1.5', languageFilter === language && 'bg-primary/15 text-primary border-primary/30')}
            >
              <HDIcon src={languageLogo(language === 'Sans langage' ? null : language)} size={13} alt={language} fallbackEmoji="📦" />
              {language} <span className="text-muted-foreground font-mono">{count}</span>
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<GitBranch size={22} />}
          title={search ? 'Aucun dépôt ne correspond' : 'Aucun dépôt à afficher'}
          description={search ? 'Essayez un autre terme.' : 'Créez ou rejoignez un dépôt sur github.com.'}
        />
      ) : (
        <div className="p-3 grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))' }}>
          {filtered.map((r) => (
            <button
              key={r.id}
              onClick={() => openRepo(r)}
              onMouseEnter={playHover}
              className="group text-left flex flex-col gap-2 p-3 rounded-md border border-border/40 bg-[hsl(var(--explorer-surface))] hover:border-primary/30 transition-all"
            >
              <div className="flex items-start gap-2">
                <HDIcon src={languageLogo(r.language)} size={18} alt={r.language || ''} fallbackEmoji="📦" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[12px] font-mono text-foreground font-normal truncate">{r.full_name}</span>
                    <span className={cn(
                      'text-[9px] uppercase tracking-wider px-1.5 py-px rounded font-mono flex items-center gap-1',
                      r.private ? 'border border-amber-400/30 text-amber-400/80' : 'border border-border/40 text-muted-foreground',
                    )}>
                      {r.private ? <Lock size={8} /> : <Globe size={8} />}
                      {r.private ? 'private' : 'public'}
                    </span>
                  </div>
                  {r.description && (
                    <p className="text-[11px] text-muted-foreground font-light line-clamp-1 mt-0.5">{r.description}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-mono">
                <span className="flex items-center gap-1"><GitBranch size={10} /> {r.default_branch}</span>
                <span className="flex items-center gap-1"><Star size={10} /> {r.stargazers_count}</span>
                <span className="flex items-center gap-1"><GitFork size={10} /> {r.forks_count}</span>
                <span className="flex items-center gap-1"><Eye size={10} /> {r.watchers_count}</span>
                {r.open_issues_count > 0 && (
                  <span className="flex items-center gap-1 text-amber-400/80"><GitPullRequest size={10} /> {r.open_issues_count}</span>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/70">
                {r.language && <><span className="w-2 h-2 rounded-full bg-primary/60" /><span>{r.language}</span><span className="mx-1">·</span></>}
                <Clock size={9} />
                <span>{new Date(r.updated_at).toLocaleDateString()}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
