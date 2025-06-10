
import { useEffect } from "react";
import { useAuth } from "@/components/AuthContext";

interface UserTypeSelectionProps {
  userType: 'startup' | 'investor';
  onComplete: () => void;
}

const UserTypeSelection = ({ userType, onComplete }: UserTypeSelectionProps) => {
  const { user } = useAuth();

  useEffect(() => {
    // If user is authenticated, redirect to dashboard
    if (user) {
      onComplete();
      return;
    }
    
    // Component is deprecated, redirect to complete
    onComplete();
  }, [user, onComplete]);

  return null;
};

export default UserTypeSelection;
