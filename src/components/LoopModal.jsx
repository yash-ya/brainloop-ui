"use client";

import { useState, useEffect } from "react";

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
};

export default function LoopModal({ isOpen, onClose, onSave, problems }) {
  const [activeProblemIndex, setActiveProblemIndex] = useState(0);
  const [sessionTime, setSessionTime] = useState(0);
  const [isLoggingTimeFor, setIsLoggingTimeFor] = useState(null);
  const [timeLogs, setTimeLogs] = useState({});
  const [isSessionComplete, setIsSessionComplete] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setSessionTime(0);
      return;
    }
    const timerInterval = setInterval(() => {
      setSessionTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timerInterval);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setActiveProblemIndex(0);
      setIsLoggingTimeFor(null);
      setTimeLogs({});
      setIsSessionComplete(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isSessionComplete) {
      const timer = setTimeout(() => {
        onSave(timeLogs);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isSessionComplete, onSave, timeLogs]);

  const handleLogTime = (index) => {
    setIsLoggingTimeFor(index);
  };

  const handleSaveTime = (index) => {
    if (timeLogs[index]) {
      setIsLoggingTimeFor(null);

      if (Object.keys(timeLogs).length === problems.length) {
        setIsSessionComplete(true);
      }
    }
  };

  const handleTimeInputChange = (index, value) => {
    setTimeLogs((prev) => ({ ...prev, [index]: value }));
  };

  const handleFinishLoop = () => {
    onSave(timeLogs);
  };

  if (!isOpen || !problems || problems.length === 0) return null;

  const currentProblem = problems[activeProblemIndex];
  const isCompleted = timeLogs[activeProblemIndex] !== undefined;

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-lg z-50 flex flex-col p-4 sm:p-8 transition-opacity duration-300">
      {isSessionComplete ? (
        <div className="m-auto text-center text-white animate-fade-in">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-24 w-24 mx-auto text-green-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h1 className="text-5xl font-bold mt-4">Loop Complete!</h1>
          <p className="text-xl mt-4 text-slate-300">
            Great work. Keep up the momentum!
          </p>
        </div>
      ) : (
        <>
          <div className="flex-shrink-0 flex justify-between items-center text-white mb-6">
            <h1 className="text-2xl font-bold">The Loop</h1>
            <div className="flex items-center gap-4">
              <span className="text-2xl font-mono bg-white/10 px-4 py-1 rounded-lg">
                {formatTime(sessionTime)}
              </span>
              <button
                onClick={handleFinishLoop}
                className="px-4 py-2 bg-sky-500/80 rounded-lg hover:bg-sky-500"
              >
                Finish Loop
              </button>
            </div>
          </div>

          <div className="flex-grow bg-white rounded-2xl shadow-2xl p-8 flex flex-col">
            <div className="flex justify-between items-center border-b border-slate-200 pb-4">
              <button
                onClick={() => setActiveProblemIndex((i) => Math.max(0, i - 1))}
                disabled={activeProblemIndex === 0}
                className="px-4 py-2 bg-slate-100 rounded-lg disabled:opacity-50"
              >
                Previous
              </button>
              <div className="text-center">
                <p className="text-sm text-slate-500">
                  Question {activeProblemIndex + 1} of {problems.length}
                </p>
                <h2 className="text-xl font-bold text-slate-800">
                  {currentProblem.Title}
                </h2>
              </div>
              <button
                onClick={() =>
                  setActiveProblemIndex((i) =>
                    Math.min(problems.length - 1, i + 1)
                  )
                }
                disabled={activeProblemIndex === problems.length - 1}
                className="px-4 py-2 bg-slate-100 rounded-lg disabled:opacity-50"
              >
                Next
              </button>
            </div>

            <div className="flex-grow overflow-y-auto py-6 space-y-6 [&::-webkit-scrollbar]:w-0 [scrollbar-width:none]">
              <div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2">
                  Problem Statement
                </h3>
                <p className="text-slate-600 whitespace-pre-wrap leading-relaxed">
                  {currentProblem.Problem}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2">
                  Examples
                </h3>
                <div className="whitespace-pre-wrap font-mono bg-slate-50 p-4 rounded-lg border border-slate-200 text-sm">
                  {currentProblem.Examples}
                </div>
              </div>
            </div>

            <div className="flex-shrink-0 border-t border-slate-200 pt-6 mt-4">
              {isLoggingTimeFor === activeProblemIndex ? (
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    value={timeLogs[activeProblemIndex] || ""}
                    onChange={(e) =>
                      handleTimeInputChange(activeProblemIndex, e.target.value)
                    }
                    placeholder="Time in minutes"
                    className="flex-grow w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                    autoFocus
                  />
                  <button
                    onClick={() => handleSaveTime(activeProblemIndex)}
                    className="px-6 py-2.5 bg-green-500 text-white rounded-lg font-semibold"
                  >
                    Save Time
                  </button>
                </div>
              ) : isCompleted ? (
                <div className="text-center text-green-600 font-semibold py-3">
                  Completed in {timeLogs[activeProblemIndex]} minutes!
                </div>
              ) : (
                <button
                  onClick={() => handleLogTime(activeProblemIndex)}
                  className="w-full py-3 bg-sky-500 text-white rounded-lg font-semibold hover:bg-sky-600"
                >
                  Mark as Completed
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
