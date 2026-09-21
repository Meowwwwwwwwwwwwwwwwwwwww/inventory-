import { CheckCircle2, X } from "lucide-react";

function Toast({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[60] flex max-w-sm items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-xl">
      <CheckCircle2 size={19} className="shrink-0 text-green-600" />

      <p className="text-sm font-medium text-slate-700">
        {message}
      </p>

      <button
        onClick={onClose}
        className="ml-2 rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
      >
        <X size={16} />
      </button>
    </div>
  );
}

export default Toast;