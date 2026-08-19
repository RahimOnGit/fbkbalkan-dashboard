import { useQuery } from '@tanstack/react-query';
import { fetchStats, fetchUpcoming, fetchRecent, fetchMatches, type Game } from '../api/matches';
import { computeTeamStats } from '../utils/teamStats';
import TeamStatsTable from './TeamStatsTable';

export default function Dashboard() {
    const statsQuery = useQuery({ queryKey: ['stats'], queryFn: fetchStats });
    const upcomingQuery = useQuery({ queryKey: ['upcoming'], queryFn: () => fetchUpcoming(2) });
    const recentQuery = useQuery({ queryKey: ['recent'], queryFn: () => fetchRecent(2) });
    const matchesQuery = useQuery({ queryKey: ['matches'], queryFn: fetchMatches });

    //  Compute team stats from all matches
    const teamStats = matchesQuery.data ? computeTeamStats(matchesQuery.data) : [];

    if (
        statsQuery.isLoading ||
        upcomingQuery.isLoading ||
        recentQuery.isLoading ||
        matchesQuery.isLoading
    ) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
            </div>
        );
    }

    if (
        statsQuery.error ||
        upcomingQuery.error ||
        recentQuery.error ||
        matchesQuery.error
    ) {
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-800">
                <p className="font-semibold">Failed to load dashboard data</p>
                <p className="mt-1 text-sm text-red-600">
                    Please check your connection or try again later.
                </p>
            </div>
        );
    }

    const stats = statsQuery.data!;
    const upcoming = upcomingQuery.data!;
    const recent = recentQuery.data!;

    return (
        <div className="space-y-8">
            {/* Page header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    Dashboard
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                    Overview of FBK Balkan matches and statistics
                </p>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    label="Total Matches"
                    value={stats.totalMatches}
                    color="blue"
                    icon={
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    }
                />
                <StatCard
                    label="Finished"
                    value={stats.finishedMatches}
                    color="emerald"
                    icon={
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                />
                <StatCard
                    label="Wins"
                    value={stats.wins}
                    color="indigo"
                    icon={
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                    }
                />
                <StatCard
                    label="Losses"
                    value={stats.losses}
                    color="rose"
                    icon={
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    }
                />
            </div>

            {/* Goals summary */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                                Goals Scored
                            </p>
                            <p className="mt-0.5 text-2xl font-bold tabular-nums text-emerald-600">
                                {stats.goalsFor}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                                Goals Conceded
                            </p>
                            <p className="mt-0.5 text-2xl font-bold tabular-nums text-rose-600">
                                {stats.goalsAgainst}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/*  Team win‑rate table */}
            <TeamStatsTable stats={teamStats} />

            {/* Upcoming & Recent */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <MatchSection
                    title="Upcoming Matches"
                    matches={upcoming.slice(0, 5)}
                    emptyMessage="No upcoming matches"
                />
                <MatchSection
                    title="Recent Results"
                    matches={recent.slice(0, 5)}
                    emptyMessage="No recent results"
                />
            </div>
        </div>
    );
}



// ---------- Sub-components ----------
function StatCard({
                      label,
                      value,
                      icon,
                      color,
                  }: {
    label: string;
    value: number;
    icon: React.ReactNode;
    color: 'blue' | 'emerald' | 'indigo' | 'rose' ;
}) {
    const colorMap = {
        blue: {
            bg: 'bg-blue-50',
            text: 'text-blue-600',
            ring: 'ring-blue-100',
        },
        emerald: {
            bg: 'bg-emerald-50',
            text: 'text-emerald-600',
            ring: 'ring-emerald-100',
        },
        indigo: {
            bg: 'bg-indigo-50',
            text: 'text-indigo-600',
            ring: 'ring-indigo-100',
        },
        rose: {
            bg: 'bg-rose-50',
            text: 'text-rose-600',
            ring: 'ring-rose-100',
        },
    }[color];

    return (
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-center gap-4">
                <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${colorMap.bg} ${colorMap.text} ring-1 ${colorMap.ring}`}
                >
                    {icon}
                </div>
                <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                        {label}
                    </p>
                    <p className="mt-0.5 text-2xl font-bold tabular-nums text-slate-900">
                        {value}
                    </p>
                </div>
            </div>
        </div>
    );
}

function MatchSection({
                          title,
                          matches,
                          emptyMessage,
                      }: {
    title: string;
    matches: Game[];
    emptyMessage: string;
}) {
    return (
        <div>
            <h2 className="mb-3 text-lg font-semibold text-slate-800">{title}</h2>
            {matches.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-6 py-10 text-center text-sm text-slate-400">
                    {emptyMessage}
                </div>
            ) : (
                <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
                    <ul className="divide-y divide-slate-100">
                        {matches.map((match) => (
                            <MatchRow key={match.gameNumber} match={match} />
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

function MatchRow({ match }: { match: Game }) {
    const date = new Date(match.timeAsDateTime);
    const formattedDate = date.toLocaleDateString('sv-SE');
    const formattedTime = date.toLocaleTimeString('sv-SE', {
        hour: '2-digit',
        minute: '2-digit',
    });

    let resultText = match.result;
    if (
        !resultText &&
        match.isFinished &&
        match.goalsScoredHomeTeam !== null &&
        match.goalsScoredAwayTeam !== null
    ) {
        resultText = `${match.goalsScoredHomeTeam} – ${match.goalsScoredAwayTeam}`;
    }

    return (
        <li className="flex items-center justify-between gap-4 px-4 py-3.5 transition hover:bg-slate-50/80">
            <div className="flex min-w-0 flex-1 items-center gap-3">
                {match.homeTeamImageUrl && (
                    <img
                        src={match.homeTeamImageUrl}
                        alt={match.homeTeamName}
                        className="h-8 w-8 shrink-0 object-contain"
                    />
                )}


                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
                        <span className="truncate font-medium text-slate-800">
                            {match.homeTeamName}
                        </span>
                        <span className="text-slate-300">vs</span>

                        {match.awayTeamImageUrl && (
                            <img
                                src={match.awayTeamImageUrl}
                                alt={match.awayTeamName}
                                className="h-8 w-8 shrink-0 object-contain"
                            />
                        )}
                        <span className="truncate font-medium text-slate-800">
                            {match.awayTeamName}
                        </span>
                    </div>
                    <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-500">
                        <span>{formattedDate}</span>
                        <span className="text-slate-300">·</span>
                        <span>{formattedTime}</span>
                        {match.venueName && (
                            <>
                                <span className="text-slate-300">·</span>
                                <span className="truncate">{match.venueName}</span>
                            </>
                        )}
                        {match.competitionName && (
                            <>
                                <span className="text-slate-300">·</span>
                                <span className="truncate">{match.competitionName}</span>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <div className="shrink-0 text-right font-mono text-sm font-semibold tabular-nums text-slate-800">
                {resultText || <span className="text-slate-300">—</span>}
            </div>
        </li>
    );
}