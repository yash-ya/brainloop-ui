import { useState, useEffect } from "react";

export default function LogRevisionModal({
  isOpen,
  onClose,
  onSave,
  problemTitle,
  error,
}) {
  const [timeTaken, setTimeTaken] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) setTimeTaken("");
  }, [isOpen]);

  const handleSave = async () => {
    setIsLoading(true);
    await onSave({ timeTaken });
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-slate-800">
          Initial Solve Complete!
        </h2>
        <p className="mt-2 text-slate-500">
          Log your time for:{" "}
          <span className="font-medium text-slate-700">{problemTitle}</span>
        </p>

        <div className="mt-6">
          <label
            htmlFor="timeTaken"
            className="block text-sm font-medium text-slate-600 mb-1"
          >
            Time Taken (in minutes)
          </label>
          <input
            type="number"
            id="timeTaken"
            value={timeTaken}
            onChange={(e) => setTimeTaken(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            placeholder="e.g., 25"
          />
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-100 border-l-4 border-red-400 text-red-800 rounded-lg">
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="mt-8 flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isLoading || !timeTaken}
            className="px-6 py-2.5 bg-sky-500 text-white rounded-lg font-semibold hover:bg-sky-600 disabled:bg-sky-300"
          >
            {isLoading ? "Saving..." : "Save Log"}
          </button>
        </div>
      </div>
    </div>
  );
}
