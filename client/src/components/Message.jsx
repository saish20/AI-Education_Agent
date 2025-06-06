export default function Message({ sender, text, persona }) {
  const isUser = sender === 'user';

  // Map persona name to color/avatar
  const personaStyles = {
    Math:   { bg: 'bg-yellow-100', text: 'text-yellow-800', emoji: '🧮' },
    English: { bg: 'bg-pink-100', text: 'text-pink-800', emoji: '📚' },
    History: { bg: 'bg-green-100', text: 'text-green-800', emoji: '🏛️' },
    default: { bg: 'bg-gray-200', text: 'text-gray-900', emoji: '🤖' }
  };

  const style = personaStyles[persona] || personaStyles.default;

  return (
    <div className={`mb-2 flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${style.bg}`}>
          <span className="text-xl">{style.emoji}</span>
        </div>
      )}
      <div
        className={`px-4 py-2 rounded-lg max-w-[75%] ${
          isUser
            ? 'bg-blue-600 text-white'
            : `${style.bg} ${style.text}`
        }`}
      >
        {text}
      </div>
    </div>
  );
}
