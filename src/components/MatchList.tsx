import { useQuery } from '@tanstack/react-query';
import { fetchMatches, type Game } from '../api/matches';
import { useState, useMemo } from 'react';

export default function MatchList() {
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<'all' | 'upcoming' | 'finished'>('all');

    const { data, isLoading, error } = useQuery({
        queryKey: ['matches'],
        queryFn: fetchMatches,
    });

    // Filter and search
    const filteredMatches = useMemo(() => {
        if (!data) return [];
        return data.filter((m) => {
            // Search in team names
            const searchLower = search.toLowerCase();
            const teamMatch =
                m.homeTeamName.toLowerCase().includes(searchLower) ||
                m.awayTeamName.toLowerCase().includes(searchLower);
            if (!teamMatch) return false;

            // Status filter
            if (filter === 'upcoming') return !m.isFinished;
            if (filter === 'finished') return m.isFinished;
            return true;
        });
    }, [data, search, filter]);

    // Sort by date (newest first for finished, oldest first for upcoming)
    const sorted = useMemo(() => {
        return [...filteredMatches].sort((a, b) => {
            const dateA = new Date(a.timeAsDateTime).getTime();
            const dateB = new Date(b.timeAsDateTime).getTime();
            if (filter === 'finished') return dateB - dateA; // recent first
            return dateA - dateB; // oldest first (next match on top)
        });
    }, [filteredMatches, filter]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
                <p className="font-medium">Failed to load matches</p>
                <p className="text-sm">Please try again later.</p>
            </div>
        );
    }

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h1 className="text-2xl font-bold text-gray-900">All Matches</h1>
                <div className="flex flex-col sm:flex-row gap-3">
                    <input
                        type="text"
                        placeholder="Search teams..."
                        className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <select
                        className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value as 'all' | 'upcoming' | 'finished')}
                    >
                        <option value="all">All</option>
                        <option value="upcoming">Upcoming</option>
                        <option value="finished">Finished</option>
                    </select>
                </div>
            </div>

            {sorted.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-12 text-center text-gray-400">
                    No matches match your criteria.
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Home
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Away
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Result
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Competition
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Venue
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {sorted.map((match) => (
                                <MatchRow key={match.gameNumber} match={match} />
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

// Extract MatchRow to avoid inline type usage if needed, but it's fine here.
function MatchRow({ match }: { match: Game }) {
    return (
        <tr className="hover:bg-gray-50 transition">
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {new Date(match.timeAsDateTime).toLocaleString('sv-SE', {
                    dateStyle: 'short',
                    timeStyle: 'short',
                })}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {match.homeTeamImageUrl && (
                    <img src={match.homeTeamImageUrl} alt="" className="inline w-5 h-5 mr-2 object-contain" />
                )}
                {match.homeTeamName}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {match.awayTeamImageUrl && (
                    <img src={match.awayTeamImageUrl} alt="" className="inline w-5 h-5 mr-2 object-contain" />
                )}
                {match.awayTeamName}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-mono font-bold">
                {match.isFinished && match.goalsScoredHomeTeam !== null ? (
                    `${match.goalsScoredHomeTeam} – ${match.goalsScoredAwayTeam}`
                ) : (
                    <span className="text-gray-400">-</span>
                )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {match.competitionName || '-'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {match.venueName || '-'}
            </td>
        </tr>
    );
}