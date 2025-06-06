import { useEffect, useRef, useState } from 'react';
import Message from './Message';
import { getHistory } from '../api';

export default function ChatBox({ sessionId, onSend, personaColor }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  // Scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load message history
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await getHistory(sessionId);
        setMessages(res.data);
      } catch (err) {
        console.error('Failed to load history:', err);
      }
    };
    loadHistory();
  }, [sessionId]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: 'user', message: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const reply = await onSend(sessionId, input);
      const replyText =
        typeof reply?.data === 'string'
          ? reply.data
          : typeof reply?.data?.reply === 'string'
          ? reply.data.reply
          : '⚠️ Unexpected response format.';

      setMessages([...newMessages, { sender: 'agent', message: replyText }]);
    } catch (err) {
      setMessages([
        ...newMessages,
        { sender: 'agent', message: '⚠️ Failed to get response.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full border rounded p-4 bg-white shadow">
      <div className="flex-1 overflow-y-auto mb-4">
        {messages.map((msg, i) => {
          console.log('Rendering message:', msg);
          return (
            <Message
              key={i}
              sender={msg.sender}
              text={msg.message} // ensure this accesses .message everywhere
              persona={personaColor}
            />
          );
        })}
        {loading && (
          <div className="text-sm text-gray-500 mb-2">Agent is thinking...</div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="flex">
        <input
          type="text"
          className="flex-1 p-2 border rounded-l"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask your question..."
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 rounded-r disabled:opacity-50"
          disabled={loading}
        >
          Send
        </button>
      </div>
    </div>
  );
}
