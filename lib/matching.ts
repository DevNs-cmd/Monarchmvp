/**
 * Monarch Matching Engine (MVP)
 * Weighted alignment between Investor Mandate and Startup Profile
 */

export interface MatchCriteria {
    investorSectors: string[];
    investorStages: string[];
    investorCapitalRange: { min: number; max: number };
    investorRegion: string;
}

export interface StartupProfile {
    id: string;
    industry: string;
    stage: string;
    capitalAsk: number;
    region: string;
}

export function calculateMatchScore(criteria: MatchCriteria, startup: StartupProfile): number {
    let score = 0;

    // Sector Alignment (40%)
    if (criteria.investorSectors.length === 0 || criteria.investorSectors.includes(startup.industry)) {
        score += 40;
    }

    // Stage Alignment (25%)
    if (criteria.investorStages.length === 0 || criteria.investorStages.includes(startup.stage)) {
        score += 25;
    }

    // Capital Alignment (25%)
    if (criteria.investorCapitalRange.min === 0 && criteria.investorCapitalRange.max === 0) {
        score += 25;
    } else if (startup.capitalAsk >= criteria.investorCapitalRange.min && startup.capitalAsk <= criteria.investorCapitalRange.max) {
        score += 25;
    }

    // Region Overlap (10%)
    if (criteria.investorRegion === "Global" || criteria.investorRegion === startup.region) {
        score += 10;
    }

    return score;
}
