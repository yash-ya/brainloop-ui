// File: src/components/ProblemDetailModal.jsx
"use client";

export default function ProblemDetailModal({ isOpen, onClose, problem }) {
  if (!isOpen || !problem) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:w-0 [scrollbar-width:none]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-sky-700">{problem.Title}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 transition-colors text-3xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* --- Tags Display Section --- */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-6 mb-6">
          {problem.Tags?.length > 0 ? (
            problem.Tags.map((tag) => (
              <span
                key={tag.ID}
                className="px-2.5 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded-full"
              >
                {tag.Name}
              </span>
            ))
          ) : (
            <span className="text-xs text-slate-400 italic">
              No tags assigned
            </span>
          )}
        </div>

        <div className="space-y-6 text-slate-600">
          <div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">
              Problem Statement
            </h3>
            <p className="whitespace-pre-wrap leading-relaxed">
              {problem.Problem || "No statement provided."}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">
              Examples
            </h3>
            <div className="whitespace-pre-wrap font-mono bg-slate-50 p-4 rounded-lg border border-slate-200 text-sm">
              {problem.Examples || "No examples provided."}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">
              Your Notes
            </h3>
            <div className="whitespace-pre-wrap bg-sky-50 p-4 rounded-lg border-l-4 border-sky-200 text-sky-800 leading-relaxed">
              {problem.Notes || "No notes have been added yet."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
