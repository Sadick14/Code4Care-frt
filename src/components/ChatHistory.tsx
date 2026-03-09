import { useState, useEffect } from "react";
import { Clock, MessageSquare, Trash2 } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

interface ChatSession {
  id: string;
  title: string;
  timestamp: Date;
  preview: string;
}

interface ChatHistoryProps {
  currentSessionId: string;
  onSelectSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
}

export function ChatHistory({ currentSessionId, onSelectSession, onDeleteSession }: ChatHistoryProps) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = () => {
    const stored = localStorage.getItem('chatSessions');
    if (stored) {
      const parsed = JSON.parse(stored);
      setSessions(parsed.map((s: any) => ({
        ...s,
        timestamp: new Date(s.timestamp)
      })));
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return `${days} days ago`;
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="h-full flex flex-col bg-white border-l">
      <div className="p-4 border-b">
        <h2 className="font-semibold" style={{ color: '#1A1A1A' }}>Chat History</h2>
        <p className="text-xs text-gray-500 mt-1">{sessions.length} conversations</p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {sessions.length === 0 ? (
            <div className="text-center py-12 px-4">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm text-gray-500">No chat history yet</p>
              <p className="text-xs text-gray-400 mt-1">Your conversations will appear here</p>
            </div>
          ) : (
            sessions.map((session) => (
              <div
                key={session.id}
                className={`group relative p-3 mb-2 rounded-lg cursor-pointer transition-all ${
                  session.id === currentSessionId
                    ? 'bg-green-50 border border-green-200'
                    : 'hover:bg-gray-50 border border-transparent'
                }`}
                onClick={() => onSelectSession(session.id)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium truncate" style={{ color: '#1A1A1A' }}>
                      {session.title}
                    </h3>
                    <p className="text-xs text-gray-500 truncate mt-1">
                      {session.preview}
                    </p>
                    <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                      <Clock className="w-3 h-3" />
                      {formatTime(session.timestamp)}
                    </div>
                  </div>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete conversation?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete this chat session. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDeleteSession(session.id)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
