export interface ScoringInputs {
    tractionScore: number; // 0-100
    teamScore: number;    // 0-100
    marketScore: number;  // 0-100
}

export function calculateMonarchIndex(inputs: ScoringInputs): number {
    // Weights
    const TRACTION_WEIGHT = 0.5;
    const TEAM_WEIGHT = 0.3;
    const MARKET_WEIGHT = 0.2;

    const weightedScore =
        (inputs.tractionScore * TRACTION_WEIGHT) +
        (inputs.teamScore * TEAM_WEIGHT) +
        (inputs.marketScore * MARKET_WEIGHT);

    return Math.round(weightedScore);
}

export function getScoreInterpretation(score: number): string {
    if (score >= 90) return "Prime Value: Exceptional growth trajectory and team depth.";
    if (score >= 80) return "High Alpha: Strong market positioning with verified traction.";
    if (score >= 70) return "Growth Tier: Solid fundamentals with scaling potential.";
    return "Observational: Undergoing secondary board review.";
}
