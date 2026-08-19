import { apiClient } from './client';

export interface Game {
    gameNumber: number;
    homeTeamName: string;
    awayTeamName: string;
    homeTeamImageUrl?: string;
    awayTeamImageUrl?: string;
    goalsScoredHomeTeam?: number | null;
    goalsScoredAwayTeam?: number | null;
    competitionName: string;
    venueName: string;
    timeAsDateTime: string;
    isFinished: boolean;
    result?: string;
}

export interface Stats {
    totalMatches: number;
    finishedMatches: number;
    wins: number;
    draws: number;
    losses: number;
    goalsFor: number;
    goalsAgainst: number;
}
export const fetchMatches = () =>
    apiClient.get<Game[]>('/matches').then(res => res.data);

export const fetchUpcoming = (months = 2) =>
    apiClient.get<Game[]>(`/matches/upcoming?months=${months}`).then(res => res.data);

export const fetchRecent = (months = 2) =>
    apiClient.get<Game[]>(`/matches/recent?months=${months}`).then(res => res.data);

export const fetchStats = () =>
    apiClient.get<Stats>('/matches/stats').then(res => res.data);

