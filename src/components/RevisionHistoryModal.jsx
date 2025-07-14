"use client";

import { useState, useEffect } from "react";
import { getRevisionHistory } from "@/lib/api";

const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function RevisionHistoryModal({
  isOpen,
  onClose,
  problem,
  onAddRevision,
}) {
  const [timeTaken, setTimeTaken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [revisions, setRevisions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && problem?.ID) {
      const fetchHistory = async () => {
        try {
          setError(null);
          const history = await getRevisionHistory(problem.ID);
          setRevisions(history || []);
        } catch (err) {
          setError(err.message);
        }
      };
      fetchHistory();
    }
  }, [isOpen, problem]);

  const handleAddRevision = async (e) => {
    e.preventDefault();
    if (!timeTaken || !problem?.ID) return;
    setIsLoading(true);
    setError(null);
    try {
      await onAddRevision(problem.ID, { timeTaken });
      const history = await getRevisionHistory(problem.ID);
      setRevisions(history || []);
      setTimeTaken("");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-slate-800">
            Revision History
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 transition-colors text-3xl leading-none"
          >
            &times;
          </button>
        </div>
        <p className="text-slate-500 mb-6 -mt-4 border-b border-slate-200 pb-4">
          For:{" "}
          <span className="font-semibold text-slate-700">{problem?.Title}</span>
        </p>

        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
          {revisions.length > 0 ? (
            revisions.map((rev, index) => (
              <div
                key={rev.ID}
                className="flex justify-between items-center bg-slate-100 p-3 rounded-lg"
              >
                <div>
                  <p className="font-semibold text-slate-800">
                    Attempt #{index + 1}
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatDate(rev.CreatedAt)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">Time Taken</p>
                  <p className="text-slate-800 font-semibold">
                    {rev.TimeTaken} mins
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-slate-500 text-center py-4">
              No revision history yet.
            </p>
          )}
        </div>

        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

        <form
          onSubmit={handleAddRevision}
          className="mt-6 border-t border-slate-200 pt-6"
        >
          <h3 className="font-semibold text-slate-700 mb-3">
            Add New Revision Entry
          </h3>
          <label
            htmlFor="new-revision-time"
            className="block text-sm font-medium text-slate-600 mb-1"
          >
            Time Taken (in minutes)
          </label>
          <div className="flex items-center gap-4">
            <input
              id="new-revision-time"
              type="number"
              value={timeTaken}
              onChange={(e) => setTimeTaken(e.target.value)}
              placeholder="e.g., 25"
              className="flex-grow w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            />
            <button
              type="submit"
              disabled={isLoading || !timeTaken}
              className="px-6 py-2.5 bg-sky-500 text-white rounded-lg font-semibold hover:bg-sky-600 transition-colors disabled:bg-sky-300 disabled:cursor-not-allowed"
            >
              {isLoading ? "..." : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
