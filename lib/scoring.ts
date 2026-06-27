/**
 * Monarch Index (MIG) Calculation Logic
 * Formula: (Traction * 0.45) + (Team * 0.30) + (Market * 0.25)
 */

export interface ScoringInputs {
    tractionScore: number; // 0-100
    teamScore: number;    // 0-100
    marketScore: number;  // 0-100
}

export function calculateMonarchIndex(inputs: ScoringInputs): number {
    const TRACTION_WEIGHT = 0.45;
    const TEAM_WEIGHT = 0.30;
    const MARKET_WEIGHT = 0.25;

    const score =
        (inputs.tractionScore * TRACTION_WEIGHT) +
        (inputs.teamScore * TEAM_WEIGHT) +
        (inputs.marketScore * MARKET_WEIGHT);

    return Math.round(score);
}
