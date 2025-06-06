export default function PersonaSelector({ personas, selected, onSelect }) {
  return (
    <div className="mb-4">
      <label className="block mb-1 font-semibold text-gray-700">Choose a subject expert:</label>
      <select
        value={selected}
        onChange={(e) => onSelect(e.target.value)}
        className="w-full p-2 border rounded"
      >
        <option value="">-- Select --</option>
        {personas.map((p) => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>
    </div>
  );
}
