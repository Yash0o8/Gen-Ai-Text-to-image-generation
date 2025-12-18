export default function HistoryPanel({ history, onSelect }) {
  return (
    <div className="mt-4">
      <h3 className="text-sm text-slate-400 mb-2">History</h3>

      <div className="grid grid-cols-2 gap-2">
        {history.map((item, idx) => (
          <img
            key={idx}
            src={item.image}
            onClick={() => onSelect(item)}
            className="rounded-lg cursor-pointer hover:ring-2 hover:ring-indigo-500"
            alt="history"
          />
        ))}
      </div>
    </div>
  );
}
