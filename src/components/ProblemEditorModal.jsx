"use client";

import { useState, useEffect } from "react";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { addProblem, updateProblem, getAllTags } from "@/lib/api";

const difficultyOptions = [
  { value: "Easy", label: "Easy" },
  { value: "Medium", label: "Medium" },
  { value: "Hard", label: "Hard" },
];

const statusOptions = [
  { value: "To Do", label: "To Do" },
  { value: "In Progress", label: "In Progress" },
  { value: "Done", label: "Done" },
];

const customSelectStyles = {
  control: (provided) => ({
    ...provided,
    backgroundColor: "#f8fafc", // slate-50
    border: "1px solid #e2e8f0", // slate-200
    borderRadius: "0.5rem",
    padding: "0.25rem",
    boxShadow: "none",
    "&:hover": {
      borderColor: "#cbd5e1", // slate-300
    },
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#0ea5e9"
      : state.isFocused
      ? "#f1f5f9"
      : "white",
    color: state.isSelected ? "white" : "#334155",
    borderRadius: "0.375rem",
    margin: "0.25rem",
    width: "auto",
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: "#e0f2fe", // sky-100
    borderRadius: "0.375rem",
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: "#0c4a6e", // sky-900
    fontWeight: 500,
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: "#0c4a6e",
    "&:hover": {
      backgroundColor: "#bae6fd", // sky-200
      color: "#0c4a6e",
    },
  }),
};

export default function ProblemEditorModal({
  isOpen,
  onClose,
  onSave,
  existingProblem,
}) {
  const [formData, setFormData] = useState({
    title: "",
    problem: "",
    examples: "",
    difficulty: "Medium",
    status: "To Do",
    notes: "",
  });

  const [selectedTags, setSelectedTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const isEditMode = Boolean(existingProblem);

  useEffect(() => {
    if (isOpen) {
      const fetchTags = async () => {
        try {
          const tagsFromApi = await getAllTags();
          const formattedTags = tagsFromApi.map((tag) => ({
            value: tag.ID,
            label: tag.Name,
          }));
          setAvailableTags(formattedTags);
        } catch (err) {
          console.error("Failed to fetch tags:", err);
        }
      };
      fetchTags();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && existingProblem) {
      setFormData({
        title: existingProblem.Title || "",
        problem: existingProblem.Problem || "",
        examples: existingProblem.Examples || "",
        difficulty: existingProblem.Difficulty || "Medium",
        status: existingProblem.Status || "To Do",
        notes: existingProblem.Notes || "",
      });
      const currentTags =
        existingProblem.Tags?.map((tag) => ({
          value: tag.ID,
          label: tag.Name,
        })) || [];
      setSelectedTags(currentTags);
    } else {
      setFormData({
        title: "",
        problem: "",
        examples: "",
        difficulty: "Medium",
        status: "To Do",
        notes: "",
      });
      setSelectedTags([]);
    }
  }, [existingProblem, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const tagsPayload = selectedTags.map((tag) => ({
      ID: tag.__isNew__ ? 0 : tag.value,
      Name: tag.label,
    }));

    const problemPayload = { ...formData, Tags: tagsPayload };

    try {
      const savedProblem = isEditMode
        ? await updateProblem(existingProblem.ID, problemPayload)
        : await addProblem(problemPayload);

      onSave(savedProblem);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:w-0 [scrollbar-width:none]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-6 text-slate-800">
          {isEditMode ? "Edit Problem" : "Add New Problem"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-slate-600 mb-1"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="difficulty"
                  className="block text-sm font-medium text-slate-600 mb-1"
                >
                  Difficulty
                </label>
                <Select
                  id="difficulty"
                  options={difficultyOptions}
                  value={difficultyOptions.find(
                    (opt) => opt.value === formData.difficulty
                  )}
                  onChange={(option) =>
                    setFormData((prev) => ({
                      ...prev,
                      difficulty: option.value,
                    }))
                  }
                  styles={customSelectStyles}
                />
              </div>
              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-slate-600 mb-1"
                >
                  Status
                </label>
                <Select
                  id="status"
                  options={statusOptions}
                  value={statusOptions.find(
                    (opt) => opt.value === formData.status
                  )}
                  onChange={(option) =>
                    setFormData((prev) => ({ ...prev, status: option.value }))
                  }
                  styles={customSelectStyles}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="tags"
                className="block text-sm font-medium text-slate-600 mb-1"
              >
                Tags
              </label>
              <CreatableSelect
                isMulti
                options={availableTags}
                value={selectedTags}
                onChange={setSelectedTags}
                placeholder="Select or create tags..."
                styles={customSelectStyles}
              />
            </div>

            <div>
              <label
                htmlFor="problem"
                className="block text-sm font-medium text-slate-600 mb-1"
              >
                Problem Statement
              </label>
              <textarea
                id="problem"
                name="problem"
                value={formData.problem}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                rows="4"
              ></textarea>
            </div>
            <div>
              <label
                htmlFor="examples"
                className="block text-sm font-medium text-slate-600 mb-1"
              >
                Examples
              </label>
              <textarea
                id="examples"
                name="examples"
                value={formData.examples}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 font-mono text-sm"
                rows="3"
              ></textarea>
            </div>
            <div>
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-slate-600 mb-1"
              >
                Your Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                rows="4"
              ></textarea>
            </div>
          </div>
          {error && (
            <p className="text-red-600 mt-4 text-sm font-medium">
              Error: {error}
            </p>
          )}
          <div className="mt-8 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 bg-sky-500 text-white rounded-lg font-semibold hover:bg-sky-600 transition-colors disabled:bg-sky-300"
            >
              {isLoading ? "Saving..." : "Save Problem"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
