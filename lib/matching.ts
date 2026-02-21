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
    monarchIndex: number;
}

export function calculateMatchScore(investor: MatchCriteria, startup: StartupProfile): number {
    let score = 0;

    // Sector Match (40%)
    if (investor.investorSectors.includes(startup.industry)) {
        score += 40;
    }

    // Stage Match (20%)
    if (investor.investorStages.includes(startup.stage)) {
        score += 20;
    }

    // Capital Alignment (20%)
    if (startup.capitalAsk >= investor.investorCapitalRange.min && startup.capitalAsk <= investor.investorCapitalRange.max) {
        score += 20;
    }

    // Region Overlap (10%)
    if (investor.investorRegion === startup.region) {
        score += 10;
    }

    // Monarch Index Bonus (10%)
    score += (startup.monarchIndex / 100) * 10;

    return Math.round(score);
}

export function getTopMatches(investor: MatchCriteria, startups: StartupProfile[], limit = 3) {
    return startups
        .map(s => ({ ...s, matchScore: calculateMatchScore(investor, s) }))
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, limit);
}
