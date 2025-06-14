
import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthContext";
import { useInvestorStats } from "@/hooks/useInvestorStats";
import InvestorDashboardHeader from "@/components/investor/InvestorDashboardHeader";
import InvestorStatsGrid from "@/components/investor/InvestorStatsGrid";
import CalibrationBanner from "@/components/investor/CalibrationBanner";
import InvestorDashboardTabs from "@/components/investor/InvestorDashboardTabs";

interface InvestorDashboardProps {
  onLogout: () => void;
}

const InvestorDashboard = ({ onLogout }: InvestorDashboardProps) => {
  const { signOut, userProfile } = useAuth();
  const [subscription, setSubscription] = useState('free');
  const [isCalibrated, setIsCalibrated] = useState(false);
  const { stats, loading: statsLoading } = useInvestorStats();

  useEffect(() => {
    const savedSubscription = localStorage.getItem('subscription') || 'free';
    setSubscription(savedSubscription);

    const calibrationStatus = localStorage.getItem('investorCalibrated') === 'true';
    setIsCalibrated(calibrationStatus);
  }, []);

  const handleLogout = async () => {
    await signOut();
    onLogout();
  };

  const handleCalibrationComplete = () => {
    setIsCalibrated(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <InvestorDashboardHeader
        userCompany={userProfile?.company}
        subscription={subscription}
        onLogout={handleLogout}
      />

      <div className="container mx-auto px-6 py-8">
        <InvestorStatsGrid 
          stats={stats} 
          statsLoading={statsLoading} 
        />

        <CalibrationBanner isCalibrated={isCalibrated} />

        <InvestorDashboardTabs
          subscription={subscription}
          onCalibrationComplete={handleCalibrationComplete}
        />
      </div>
    </div>
  );
};

export default InvestorDashboard;
