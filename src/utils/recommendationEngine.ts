
import { StartupData } from "../types";

interface CalibrationData {
  startupId: number;
  rating: number;
  sector: string;
  stage: string;
  revenue: string;
  timestamp: string;
}

interface PreferenceData {
  sectors: string[];
  stages: string[];
  minInvestment: number[];
  maxInvestment: number[];
  locations: string[];
  riskTolerance: string;
  revenueRequirement: boolean;
}

export class RecommendationEngine {
  private calibrationData: CalibrationData[];
  private preferences: PreferenceData;
  private swipeHistory: any[];

  constructor() {
    this.calibrationData = JSON.parse(localStorage.getItem('calibrationLearning') || '[]');
    this.preferences = JSON.parse(localStorage.getItem('investorPreferences') || '{}');
    this.swipeHistory = JSON.parse(localStorage.getItem('swipeLearning') || '[]');
  }

  calculateStartupScore(startup: StartupData): number {
    let score = 0;
    let factors = 0;

    // Sector preference scoring
    if (this.preferences.sectors && this.preferences.sectors.length > 0) {
      if (this.preferences.sectors.includes(startup.sector)) {
        score += 30;
      } else {
        score -= 10;
      }
      factors++;
    }

    // Stage preference scoring
    if (this.preferences.stages && this.preferences.stages.length > 0) {
      if (this.preferences.stages.includes(startup.stage)) {
        score += 25;
      } else {
        score -= 5;
      }
      factors++;
    }

    // Location preference scoring
    if (this.preferences.locations && this.preferences.locations.length > 0) {
      if (this.preferences.locations.includes(startup.location)) {
        score += 15;
      }
      factors++;
    }

    // Revenue requirement scoring
    if (this.preferences.revenueRequirement) {
      const hasRevenue = startup.revenue && startup.revenue !== '$0 MRR';
      if (hasRevenue) {
        score += 20;
      } else {
        score -= 15;
      }
      factors++;
    }

    // Calibration-based learning
    const sectorCalibrations = this.calibrationData.filter(c => c.sector === startup.sector);
    if (sectorCalibrations.length > 0) {
      const avgSectorRating = sectorCalibrations.reduce((sum, c) => sum + c.rating, 0) / sectorCalibrations.length;
      score += (avgSectorRating - 3) * 10; // Scale from -20 to +20
      factors++;
    }

    const stageCalibrations = this.calibrationData.filter(c => c.stage === startup.stage);
    if (stageCalibrations.length > 0) {
      const avgStageRating = stageCalibrations.reduce((sum, c) => sum + c.rating, 0) / stageCalibrations.length;
      score += (avgStageRating - 3) * 8; // Scale from -16 to +16
      factors++;
    }

    // Swipe history learning
    const similarSwipes = this.swipeHistory.filter(s => 
      s.sector === startup.sector || s.stage === startup.stage
    );
    
    if (similarSwipes.length > 0) {
      const interestedCount = similarSwipes.filter(s => s.interested).length;
      const interestRate = interestedCount / similarSwipes.length;
      score += (interestRate - 0.5) * 20; // Scale from -10 to +10
      factors++;
    }

    // Risk tolerance adjustment
    if (this.preferences.riskTolerance === 'low' && startup.stage === 'Pre-seed') {
      score -= 15;
    } else if (this.preferences.riskTolerance === 'high' && startup.stage === 'Series C+') {
      score -= 10;
    }

    // Normalize score (0-100)
    const baseScore = 50; // Neutral score
    const finalScore = Math.max(0, Math.min(100, baseScore + score));
    
    return Math.round(finalScore);
  }

  getRecommendedStartups(startups: StartupData[], count: number = 5): StartupData[] {
    // Calculate scores for all startups
    const scoredStartups = startups.map(startup => ({
      ...startup,
      recommendationScore: this.calculateStartupScore(startup)
    }));

    // Sort by score and return top recommendations
    return scoredStartups
      .sort((a, b) => b.recommendationScore - a.recommendationScore)
      .slice(0, count);
  }

  getRecommendationReason(startup: StartupData): string {
    const reasons = [];

    if (this.preferences.sectors?.includes(startup.sector)) {
      reasons.push(`matches your ${startup.sector} sector preference`);
    }

    if (this.preferences.stages?.includes(startup.stage)) {
      reasons.push(`aligns with your ${startup.stage} stage focus`);
    }

    if (this.preferences.locations?.includes(startup.location)) {
      reasons.push(`located in your preferred region`);
    }

    const sectorCalibrations = this.calibrationData.filter(c => c.sector === startup.sector);
    if (sectorCalibrations.length > 0) {
      const avgRating = sectorCalibrations.reduce((sum, c) => sum + c.rating, 0) / sectorCalibrations.length;
      if (avgRating >= 4) {
        reasons.push(`you showed high interest in similar ${startup.sector} companies`);
      }
    }

    if (reasons.length === 0) {
      reasons.push('shows strong growth potential');
    }

    return `Recommended because it ${reasons.slice(0, 2).join(' and ')}.`;
  }

  logInteraction(startup: StartupData, interested: boolean) {
    const interaction = {
      startupId: startup.id,
      interested,
      sector: startup.sector,
      stage: startup.stage,
      timestamp: new Date().toISOString(),
      recommendationScore: this.calculateStartupScore(startup)
    };

    this.swipeHistory.push(interaction);
    localStorage.setItem('swipeLearning', JSON.stringify(this.swipeHistory));
  }
}

export const recommendationEngine = new RecommendationEngine();
