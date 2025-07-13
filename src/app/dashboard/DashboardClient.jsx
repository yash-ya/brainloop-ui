"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getProblems,
  deleteProblem,
  updateProblem,
  logRevision,
} from "@/lib/api";

import ProblemEditorModal from "@/components/ProblemEditorModal";
import ConfirmationModal from "@/components/ConfirmationModal";
import ProblemsTable from "@/components/ProblemsTable";
import ProblemDetailModal from "@/components/ProblemDetailModal";
import LogRevisionModal from "@/components/LogRevisionModal";
import RevisionHistoryModal from "@/components/RevisionHistoryModal";
import LoopModal from "@/components/LoopModal";
import FilterToggle from "@/components/FilterToggle";

export default function DashboardClient({ initialProblems, user, token }) {
  const router = useRouter();

  const [problems, setProblems] = useState(initialProblems);
  const [error, setError] = useState(null);

  const [isEditorModalOpen, setIsEditorModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isLoopModalOpen, setIsLoopModalOpen] = useState(false);
  const [problemToEdit, setProblemToEdit] = useState(null);
  const [problemToDelete, setProblemToDelete] = useState(null);
  const [problemToView, setProblemToView] = useState(null);
  const [problemToLog, setProblemToLog] = useState(null);
  const [problemForHistory, setProblemForHistory] = useState(null);
  const [loopProblems, setLoopProblems] = useState([]);
  const [logError, setLogError] = useState(null);
  const [showOnlyDue, setShowOnlyDue] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem("authToken", token);
    }
  }, [token]);

  const refreshProblems = async () => {
    try {
      const data = await getProblems();
      setProblems(data || []);
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredProblems = useMemo(() => {
    if (!showOnlyDue) return problems;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return problems.filter(
      (p) => p.NextRevisionDate && new Date(p.NextRevisionDate) <= today
    );
  }, [problems, showOnlyDue]);

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
  };

  const handleSave = (savedProblem) => {
    refreshProblems();
    const isNowDone = savedProblem.Status === "Done";
    const wasNotTimedBefore = !savedProblem.TimeTaken;
    if (isNowDone && wasNotTimedBefore) {
      setProblemToLog(savedProblem);
      setIsLogModalOpen(true);
    }
  };

  const handleOpenEditorForEdit = (problem) => {
    setProblemToEdit(problem);
    setIsEditorModalOpen(true);
  };
  const handleOpenEditorForAdd = () => {
    setProblemToEdit(null);
    setIsEditorModalOpen(true);
  };
  const handleCloseEditor = () => {
    setIsEditorModalOpen(false);
    setProblemToEdit(null);
  };
  const openDeleteConfirm = (id) => {
    setProblemToDelete(id);
    setIsConfirmModalOpen(true);
  };
  const closeDeleteConfirm = () => {
    setProblemToDelete(null);
    setIsConfirmModalOpen(false);
  };
  const handleViewProblem = (problem) => {
    setProblemToView(problem);
    setIsDetailModalOpen(true);
  };
  const handleCloseDetail = () => {
    setProblemToView(null);
    setIsDetailModalOpen(false);
  };
  const handleCloseLogModal = () => {
    setProblemToLog(null);
    setIsLogModalOpen(false);
    setLogError(null);
  };
  const handleOpenHistoryModal = (problem) => {
    setProblemForHistory(problem);
    setIsHistoryModalOpen(true);
  };
  const handleCloseHistoryModal = () => {
    setProblemForHistory(null);
    setIsHistoryModalOpen(false);
  };

  const handleStartLoop = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueProblems = problems.filter(
      (p) => p.NextRevisionDate && new Date(p.NextRevisionDate) <= today
    );

    if (dueProblems.length === 0) {
      alert(
        "Great job! Nothing is due for revision today. Feel free to practice any problem by opening its revision history."
      );
      return;
    }

    const shuffled = [...dueProblems].sort(() => 0.5 - Math.random());
    const selectedProblems = shuffled.slice(0, 3);

    setLoopProblems(selectedProblems);
    setIsLoopModalOpen(true);
  };

  const handleEndLoop = async (timeLogs) => {
    if (Object.keys(timeLogs).length === 0) {
      setIsLoopModalOpen(false);
      return;
    }

    const revisionPromises = Object.entries(timeLogs).map(
      ([index, timeTaken]) => {
        const problemId = loopProblems[parseInt(index)].ID;
        return logRevision(problemId, { timeTaken });
      }
    );

    try {
      await Promise.all(revisionPromises);
      await refreshProblems();
    } catch (err) {
      alert(
        `An error occurred while saving your loop progress: ${err.message}`
      );
    }

    setIsLoopModalOpen(false);
  };

  const handleSaveInitialLog = async (logData) => {
    if (!problemToLog) return;
    setLogError(null);
    try {
      await Promise.all([
        updateProblem(problemToLog.ID, { TimeTaken: logData.timeTaken }),
        logRevision(problemToLog.ID, { timeTaken: logData.timeTaken }),
      ]);
      refreshProblems();
      handleCloseLogModal();
    } catch (err) {
      setLogError(err.message);
    }
  };

  const handleAddNewRevision = async (problemId, revisionData) => {
    try {
      await logRevision(problemId, revisionData);
      await refreshProblems();
    } catch (err) {
      alert(`Error adding revision: ${err.message}`);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!problemToDelete) return;
    try {
      await deleteProblem(problemToDelete);
      setProblems(problems.filter((p) => p.ID !== problemToDelete));
    } catch (err) {
      setError(err.message);
    } finally {
      closeDeleteConfirm();
    }
  };

  const renderContent = () => {
    if (error)
      return (
        <div className="text-center p-16 text-red-600">Error: {error}</div>
      );
    if (filteredProblems.length === 0) {
      if (showOnlyDue) {
        return (
          <div className="mt-8 text-center border-2 border-dashed border-slate-300 rounded-xl py-16 bg-white">
            <h3 className="text-xl font-semibold text-slate-700">
              All Caught Up!
            </h3>
            <p className="text-slate-500 mt-2">
              You have no problems due for revision today. Great work!
            </p>
          </div>
        );
      }
      return (
        <div className="mt-8 text-center border-2 border-dashed border-slate-300 rounded-xl py-16 bg-white">
          <h3 className="text-xl font-semibold text-slate-700">
            Welcome to Your Loop!
          </h3>
          <p className="text-slate-500 mt-2">
            Add your first problem to get started.
          </p>
          <button
            onClick={handleOpenEditorForAdd}
            className="mt-6 px-6 py-2 bg-sky-500 text-white rounded-lg"
          >
            Add First Problem
          </button>
        </div>
      );
    }
    return (
      <ProblemsTable
        problems={filteredProblems}
        onView={handleViewProblem}
        onEdit={handleOpenEditorForEdit}
        onDelete={openDeleteConfirm}
        onLogRevision={handleOpenHistoryModal}
      />
    );
  };

  return (
    <>
      <div className="min-h-screen bg-slate-100 font-sans">
        <header className="bg-slate-100/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-slate-800">BrainLoop</h1>
            <div className="flex items-center gap-4">
              <span className="text-slate-600 hidden sm:block">
                Welcome, <span className="font-medium">{user.username}</span>
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg"
              >
                Logout
              </button>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-4xl font-bold text-slate-800 tracking-tight">
                Your Problems
              </h2>
              <p className="mt-1 text-slate-500">
                This is your command center. Track, review, and conquer.
              </p>
            </div>
            <div className="flex items-center gap-4">
              {problems.length > 0 && (
                <>
                  <button
                    onClick={handleStartLoop}
                    className="px-5 py-2 bg-green-500 text-white rounded-lg"
                  >
                    Start Loop
                  </button>
                  <button
                    onClick={handleOpenEditorForAdd}
                    className="px-5 py-2 bg-sky-500 text-white rounded-lg"
                  >
                    Add Problem
                  </button>
                </>
              )}
            </div>
          </div>

          {problems.length > 0 && (
            <div className="mb-6 p-4 bg-white rounded-xl border border-slate-200/80 flex items-center justify-between">
              <FilterToggle
                label="Show Only Due For Revision"
                isChecked={showOnlyDue}
                onChange={() => setShowOnlyDue(!showOnlyDue)}
              />
              <p className="text-sm text-slate-500">
                Showing {filteredProblems.length} of {problems.length} problems
              </p>
            </div>
          )}

          {renderContent()}
        </main>
      </div>

      {/* All modals are rendered here */}
      <ProblemEditorModal
        isOpen={isEditorModalOpen}
        onClose={handleCloseEditor}
        onSave={handleSave}
        existingProblem={problemToEdit}
      />
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={closeDeleteConfirm}
        onConfirm={handleDeleteConfirm}
        title="Delete Problem"
        message="Are you sure?"
      />
      <ProblemDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetail}
        problem={problemToView}
      />
      <LogRevisionModal
        isOpen={isLogModalOpen}
        onClose={handleCloseLogModal}
        onSave={handleSaveInitialLog}
        problemTitle={problemToLog?.Title}
        error={logError}
      />
      <RevisionHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={handleCloseHistoryModal}
        problem={problemForHistory}
        onAddRevision={handleAddNewRevision}
      />
      <LoopModal
        isOpen={isLoopModalOpen}
        onClose={() => setIsLoopModalOpen(false)}
        problems={loopProblems}
        onSave={handleEndLoop}
      />
    </>
  );
}
