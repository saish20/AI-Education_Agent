import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPersonas, sendMessage } from '../api';
import ChatBox from '../components/ChatBox';

export default function ChatPage() {
  const { sessionId } = useParams();
  const [personas, setPersonas] = useState([]);
  const [personaName, setPersonaName] = useState('');

  useEffect(() => {
    const load = async () => {
      const res = await getPersonas();
      setPersonas(res.data);

      // Simple hack: assuming personaId === sessionId for now
      const session = await fetch(`http://localhost:5000/api/chat/session/${sessionId}`);
      const data = await session.json();

      const selectedPersona = res.data.find(p => p.id === data.persona_id);
      setPersonaName(selectedPersona?.name || '');
    };

    load();
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-semibold mb-4 text-center">🧠 Chat with {personaName}</h1>
      <div className="max-w-3xl mx-auto">
        <ChatBox sessionId={sessionId} onSend={sendMessage} personaColor={personaName} />
      </div>
    </div>
  );
}
