import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPersonas, createSession } from '../api';

export default function Home() {
  const [personas, setPersonas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getPersonas().then(res => setPersonas(res.data));
  }, []);

  const startChat = async (id) => {
    const res = await createSession(id);
    navigate(`/chat/${res.data.id}`);
  };

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-6 text-center">🎓 Agentic AI Tutor</h1>
      <p className="text-center text-lg mb-8">Choose a subject-matter expert to begin</p>

      {/* Add container width constraint */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {personas.map((persona) => (
            <div
              key={persona.id}
              className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center"
            >
              <img
                src={`/personas/${persona.name.toLowerCase().split(' ')[0]}.png`}
                alt={`${persona.name} avatar`}
                className="w-24 h-24 mb-4 rounded-full object-cover"
              />
              <h2 className="text-xl font-bold">{persona.name}</h2>
              <p className="text-gray-600 mb-4">{persona.description}</p>
              <button
                onClick={() => startChat(persona.id)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Start Chat
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
