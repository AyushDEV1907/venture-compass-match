
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
    }
  }, [user, onComplete]);

  // This component is no longer needed as authentication is handled in AuthPage
  // Just redirect to complete if somehow reached
  useEffect(() => {
    onComplete();
  }, [onComplete]);

  return null;
};

export default UserTypeSelection;
