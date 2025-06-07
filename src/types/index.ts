
export interface StartupData {
  id: number;
  name: string;
  description: string;
  sector: string;
  stage: string;
  fundingTarget: string;
  location: string;
  teamSize: string;
  revenue: string;
  traction: string;
  logo: string;
  recommendationScore?: number;
}

export interface InvestorData {
  id: number;
  name: string;
  description: string;
  sectors: string[];
  stages: string[];
  ticketSize: string;
  location: string;
  portfolio: string;
  logo: string;
}
