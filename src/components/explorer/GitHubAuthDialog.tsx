import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { GitHubAuthCard } from './GitHubAuthCard';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAuthenticated: (token: string) => void;
}

/**
 * Modal wrapper around <GitHubAuthCard/> so the token flow lives in a dialog
 * — matches the FTP "New connection" UX from the sidebar.
 */
export function GitHubAuthDialog({ open, onOpenChange, onAuthenticated }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Connecter un compte GitHub</DialogTitle>
          <DialogDescription>
            Créez un Personal Access Token (scope <code className="font-mono text-[11px]">repo</code>) et collez-le
            ci-dessous. Il est conservé localement dans ce navigateur uniquement.
          </DialogDescription>
        </DialogHeader>
        <div className="pt-2">
          <GitHubAuthCard
            onAuthenticated={(token) => {
              onAuthenticated(token);
              onOpenChange(false);
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
