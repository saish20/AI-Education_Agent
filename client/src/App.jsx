import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ChatPage from './pages/ChatPage';
import MainLayout from './components/MainLayout';

export default function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat/:sessionId" element={<ChatPage />} />
      </Routes>
    </MainLayout>
  );
}
