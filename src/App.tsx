import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import MatchList from './components/MatchList';

function App() {
    return (
        <BrowserRouter>
            <nav className="bg-white shadow-md p-4 flex gap-6">
                <Link to="/" className="font-bold">Dashboard</Link>
                <Link to="/matches">Matches</Link>
            </nav>
            <main className="p-6">
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/matches" element={<MatchList />} />
                </Routes>
            </main>
        </BrowserRouter>
    );
}

export default App;