import type {TeamStats} from '../utils/teamStats';

export default function TeamStatsTable({ stats }: { stats: TeamStats[] }) {
    if (stats.length === 0) {
        return <div className="text-gray-400">No finished matches for FBK Balkan teams.</div>;
    }

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden mt-8">
            <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Team Win Rates</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Team</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Matches</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">W</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">D</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">L</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Win Rate</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Progress</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {stats.map((row) => (
                        <tr key={row.teamName} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {row.teamName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{row.total}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">{row.wins}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600 font-medium">{row.draws}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">{row.losses}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">
                                {row.winRate.toFixed(1)}%
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap w-full">
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div
                                        className="bg-blue-600 h-2.5 rounded-full"
                                        style={{ width: `${Math.min(row.winRate, 100)}%` }}
                                    />
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}