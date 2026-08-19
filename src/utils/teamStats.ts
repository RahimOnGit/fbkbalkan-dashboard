import type { Game } from '../api/matches';

export interface TeamStats {
    teamName: string;
    total: number;
    wins: number;
    draws: number;
    losses: number;
    winRate: number; // percentage
}

/**
 * Compute win/loss/draw stats for all FBK Balkan teams.
 * Only finished matches with a score are considered.
 * Team names are trimmed to avoid duplicate entries due to trailing spaces.
 */
export function computeTeamStats(matches: Game[]): TeamStats[] {
    // 1. Filter matches that involve a "FBK Balkan" team (home or away)
    const fbkMatches = matches.filter((m) => {
        if (!m.isFinished) return false;
        if (m.goalsScoredHomeTeam === null || m.goalsScoredAwayTeam === null) return false;
        const isHomeFbk = m.homeTeamName?.toLowerCase().includes('fbk balkan') ?? false;
        const isAwayFbk = m.awayTeamName?.toLowerCase().includes('fbk balkan') ?? false;
        return isHomeFbk || isAwayFbk;
    });

    // 2. Group matches by team name (trimmed to avoid whitespace differences)
    const teamMap = new Map<string, { wins: number; draws: number; losses: number; total: number }>();

    fbkMatches.forEach((m) => {
        const isHomeFbk = m.homeTeamName.toLowerCase().includes('fbk balkan');
        const isAwayFbk = m.awayTeamName.toLowerCase().includes('fbk balkan');
        // The team we care about is the one that is FBK Balkan – trim it!
        const rawTeamName = isHomeFbk ? m.homeTeamName : m.awayTeamName;
        const teamName = rawTeamName.trim(); // <-- FIX: remove leading/trailing whitespace

        if (!teamMap.has(teamName)) {
            teamMap.set(teamName, { wins: 0, draws: 0, losses: 0, total: 0 });
        }
        const entry = teamMap.get(teamName)!;
        entry.total++;

        const homeGoals = m.goalsScoredHomeTeam!;
        const awayGoals = m.goalsScoredAwayTeam!;
        // For FBK team
        const fbkGoals = isHomeFbk ? homeGoals : awayGoals;
        const oppGoals = isHomeFbk ? awayGoals : homeGoals;

        if (fbkGoals > oppGoals) entry.wins++;
        else if (fbkGoals === oppGoals) entry.draws++;
        else entry.losses++;
    });

    // 3. Convert map to array and compute win rate
    return Array.from(teamMap.entries())
        .map(([teamName, data]) => ({
            teamName,
            total: data.total,
            wins: data.wins,
            draws: data.draws,
            losses: data.losses,
            winRate: data.total > 0 ? (data.wins / data.total) * 100 : 0,
        }))
        .sort((a, b) => b.winRate - a.winRate); // sort by win rate descending
}