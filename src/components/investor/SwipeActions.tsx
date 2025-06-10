
import { Button } from "@/components/ui/button";
import { Eye, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SwipeActionsProps {
  onViewProfile: () => void;
  onSendMessage: () => void;
}

const SwipeActions = ({ onViewProfile, onSendMessage }: SwipeActionsProps) => {
  const { toast } = useToast();

  const handleViewProfile = () => {
    console.log('View profile clicked');
    try {
      onViewProfile();
    } catch (error) {
      console.error('Error viewing profile:', error);
      toast({
        title: "Error",
        description: "Unable to view profile at this time.",
        variant: "destructive"
      });
    }
  };

  const handleSendMessage = () => {
    console.log('Send message clicked');
    try {
      onSendMessage();
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Unable to send message at this time.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex gap-4">
      <Button 
        variant="outline" 
        className="flex-1 h-12 hover:bg-accent hover:text-accent-foreground transition-colors" 
        onClick={handleViewProfile}
      >
        <Eye className="w-4 h-4 mr-2" />
        View Full Profile
      </Button>
      <Button 
        variant="outline" 
        className="flex-1 h-12 hover:bg-accent hover:text-accent-foreground transition-colors" 
        onClick={handleSendMessage}
      >
        <MessageSquare className="w-4 h-4 mr-2" />
        Send Message
      </Button>
    </div>
  );
};

export default SwipeActions;
