import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import JoinPage from './pages/JoinPage';
import RoomPage from './pages/RoomPage';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/room/:slug/join" element={<JoinPage />} />
                <Route path="/room/:slug" element={<RoomPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
