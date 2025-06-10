
export interface CalibrationStartup {
  id: number;
  name: string;
  description: string;
  sector: string;
  stage: string;
  revenue: string;
  team: string;
  asking: string;
  metrics: string;
}

export const calibrationStartups: CalibrationStartup[] = [
  {
    id: 1,
    name: "AI Vision Pro",
    description: "Computer vision platform that helps retailers reduce shrinkage by 45% through real-time theft detection and analytics.",
    sector: "AI/ML",
    stage: "Series A",
    revenue: "$150K ARR",
    team: "15 engineers",
    asking: "$3M",
    metrics: "95% accuracy, 200+ stores deployed"
  },
  {
    id: 2,
    name: "GreenCharge",
    description: "Solar-powered EV charging network targeting apartment complexes and office buildings with subscription-based model.",
    sector: "CleanTech",
    stage: "Seed",
    revenue: "$45K MRR",
    team: "8 people",
    asking: "$2M",
    metrics: "50 locations, 2000+ monthly users"
  },
  {
    id: 3,
    name: "MediConnect",
    description: "Telemedicine platform specializing in mental health services with AI-powered therapist matching and 24/7 crisis support.",
    sector: "HealthTech",
    stage: "Series A",
    revenue: "$300K ARR",
    team: "25 people",
    asking: "$5M",
    metrics: "10K+ patients, 500+ therapists"
  },
  {
    id: 4,
    name: "CodeMentor AI",
    description: "AI-powered coding assistant that provides real-time code review, bug detection, and learning recommendations for developers.",
    sector: "EdTech",
    stage: "Seed",
    revenue: "$80K MRR",
    team: "12 engineers",
    asking: "$1.5M",
    metrics: "50K+ developers, 40% monthly retention"
  },
  {
    id: 5,
    name: "FlexWork",
    description: "B2B platform connecting companies with vetted remote freelancers, featuring AI-powered skill matching and project management tools.",
    sector: "SaaS",
    stage: "Pre-seed",
    revenue: "$25K MRR",
    team: "6 people",
    asking: "$800K",
    metrics: "1000+ freelancers, 150+ companies"
  }
];
