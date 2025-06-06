import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSessions } from '../api';

export default function Sidebar() {
  const [sessions, setSessions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getSessions().then(res => setSessions(res.data));
  }, []);

  return (
    <div className="w-64 bg-zinc-900 text-white flex flex-col justify-between h-screen p-4">
      <div>
        <div className="text-2xl font-bold mb-6">Your Sessions</div>
        <ul className="space-y-2">
          {sessions.map(session => (
            <li key={session.id}>
              <Link to={`/chat/${session.id}`} className="block hover:text-purple-300">
                🗂 Chat #{session.id}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={() => navigate('/')}
        className="bg-purple-700 hover:bg-purple-600 text-white px-4 py-2 mt-4 rounded"
      >
        ➕ Start New Chat
      </button>
    </div>
  );
}
