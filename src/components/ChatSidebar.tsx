import { MessageSquarePlus, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
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

interface ChatSidebarProps {
  onNewChat: () => void;
  onClearChat: () => void;
}

export function ChatSidebar({ onNewChat, onClearChat }: ChatSidebarProps) {
  return (
    <div className="flex flex-col gap-3 p-3 bg-white border-r">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-xl h-12 w-12 hover:bg-gray-100"
              onClick={onNewChat}
            >
              <MessageSquarePlus className="w-5 h-5" style={{ color: '#00C27A' }} />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>New Chat</p>
          </TooltipContent>
        </Tooltip>

        <AlertDialog>
          <Tooltip>
            <TooltipTrigger asChild>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-xl h-12 w-12 hover:bg-red-50"
                >
                  <Trash2 className="w-5 h-5 text-red-500" />
                </Button>
              </AlertDialogTrigger>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Clear Chat</p>
            </TooltipContent>
          </Tooltip>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Clear current chat?</AlertDialogTitle>
              <AlertDialogDescription>
                This will delete all messages in the current conversation. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={onClearChat}
                className="bg-red-500 hover:bg-red-600"
              >
                Clear Chat
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </TooltipProvider>
    </div>
  );
}
