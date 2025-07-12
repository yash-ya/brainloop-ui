"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import {
  getProblems,
  deleteProblem,
  updateProblem,
  logRevision,
} from "@/lib/api";

// Import all necessary components
import ProblemEditorModal from "@/components/ProblemEditorModal";
import ConfirmationModal from "@/components/ConfirmationModal";
import ProblemsTable from "@/components/ProblemsTable";
import ProblemDetailModal from "@/components/ProblemDetailModal";
import LogRevisionModal from "@/components/LogRevisionModal";
import RevisionHistoryModal from "@/components/RevisionHistoryModal";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // State for modals
  const [isEditorModalOpen, setIsEditorModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  // State for data management
  const [problems, setProblems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [problemToEdit, setProblemToEdit] = useState(null);
  const [problemToDelete, setProblemToDelete] = useState(null);
  const [problemToView, setProblemToView] = useState(null);
  const [problemToLog, setProblemToLog] = useState(null);
  const [problemForHistory, setProblemForHistory] = useState(null);
  const [logError, setLogError] = useState(null);

  const fetchProblems = async () => {
    try {
      setIsLoading(true);
      const data = await getProblems();
      setProblems(data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      setProblems([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchProblems();
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    router.push("/login");
  };

  const handleSave = (savedProblem) => {
    fetchProblems();
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

  const handleSaveInitialLog = async (logData) => {
    if (!problemToLog) return;
    setLogError(null);
    try {
      await Promise.all([
        updateProblem(problemToLog.ID, { TimeTaken: logData.timeTaken }),
        logRevision(problemToLog.ID, { timeTaken: logData.timeTaken }),
      ]);
      fetchProblems();
      handleCloseLogModal();
    } catch (err) {
      setLogError(err.message);
    }
  };

  const handleAddNewRevision = async (problemId, revisionData) => {
    try {
      await logRevision(problemId, revisionData);
      await fetchProblems();
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

  if (authLoading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100">
        <p className="text-lg font-semibold text-slate-600">
          Loading Your BrainLoop...
        </p>
      </div>
    );
  if (!user) return null;

  const renderContent = () => {
    if (isLoading)
      return (
        <div className="text-center p-16 text-slate-500">
          Loading problems...
        </div>
      );
    if (error && problems.length === 0)
      return (
        <div className="text-center p-16 text-red-600 bg-red-50 rounded-lg">
          Error: {error}
        </div>
      );
    if (problems.length === 0) {
      return (
        <div className="mt-8 text-center border-2 border-dashed border-slate-300 rounded-xl py-16 bg-white">
          <h3 className="text-xl font-semibold text-slate-700">
            Welcome to Your Loop!
          </h3>
          <p className="text-slate-500 mt-2">
            It looks empty here. Add your first problem to get started.
          </p>
          <button
            onClick={handleOpenEditorForAdd}
            className="mt-6 px-6 py-2 bg-sky-500 text-white rounded-lg font-semibold hover:bg-sky-600 transition-all duration-300 shadow-sm hover:shadow-md"
          >
            Add First Problem
          </button>
        </div>
      );
    }
    return (
      <ProblemsTable
        problems={problems}
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
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-slate-800">BrainLoop</h1>
            <div className="flex items-center gap-4">
              <span className="text-slate-600 hidden sm:block">
                Welcome,{" "}
                <span className="font-medium text-slate-800">
                  {user.username}
                </span>
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-300 transition-colors text-sm"
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
            <button
              onClick={handleOpenEditorForAdd}
              className="px-5 py-2 bg-sky-500 text-white rounded-lg font-semibold hover:bg-sky-600 transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Add Problem
            </button>
          </div>
          {error && (
            <div className="my-4 text-center p-3 text-red-700 bg-red-100 rounded-lg">
              Error: {error}
            </div>
          )}
          {renderContent()}
        </main>
      </div>

      {/* Modals will be updated next to match the new style */}
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
        message="Are you sure you want to delete this problem?"
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
    </>
  );
}
