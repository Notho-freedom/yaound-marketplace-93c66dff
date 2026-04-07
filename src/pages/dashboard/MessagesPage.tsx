import React, { useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { mockConversations } from '@/data/mockListings';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, User } from 'lucide-react';

const MessagesPage: React.FC = () => {
  const { t } = useLanguage();
  const [selectedConvo, setSelectedConvo] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const selected = mockConversations.find((c) => c.id === selectedConvo);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">{t.dashboard.messages}</h2>
      <div className="flex gap-4 h-[500px]">
        {/* Conversation list */}
        <Card className="w-80 flex-shrink-0 overflow-y-auto">
          {mockConversations.map((convo) => (
            <button
              key={convo.id}
              className={`w-full text-left p-3 border-b hover:bg-muted transition-colors ${selectedConvo === convo.id ? 'bg-primary/5' : ''}`}
              onClick={() => setSelectedConvo(convo.id)}
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  <User className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between items-center">
                    <p className="font-medium text-sm truncate">{convo.participantName}</p>
                    {convo.unreadCount > 0 && (
                      <span className="h-5 w-5 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center">{convo.unreadCount}</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{convo.lastMessage}</p>
                </div>
              </div>
            </button>
          ))}
        </Card>

        {/* Chat area */}
        <Card className="flex-1 flex flex-col">
          {selected ? (
            <>
              <div className="p-3 border-b">
                <p className="font-medium">{selected.participantName}</p>
                <p className="text-xs text-muted-foreground">{selected.listingTitle}</p>
              </div>
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-3">
                  <div className="flex justify-start"><div className="bg-muted rounded-lg p-3 max-w-[70%] text-sm">{selected.lastMessage}</div></div>
                  <div className="flex justify-end"><div className="bg-primary text-primary-foreground rounded-lg p-3 max-w-[70%] text-sm">Merci pour votre réponse !</div></div>
                </div>
              </div>
              <div className="p-3 border-t flex gap-2">
                <Input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Votre message..." className="flex-1" />
                <Button size="icon"><Send className="h-4 w-4" /></Button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
              {language === 'fr' ? 'Sélectionnez une conversation' : 'Select a conversation'}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

const language = 'fr'; // fallback
export default MessagesPage;
