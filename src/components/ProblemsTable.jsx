"use client";

const getDifficultyStyles = (difficulty) => {
  switch (difficulty?.toLowerCase()) {
    case "easy":
      return "bg-green-100 text-green-700 ring-green-600/20";
    case "medium":
      return "bg-yellow-100 text-yellow-700 ring-yellow-600/20";
    case "hard":
      return "bg-red-100 text-red-700 ring-red-600/20";
    default:
      return "bg-slate-100 text-slate-700 ring-slate-600/20";
  }
};

const getStatusStyles = (status) => {
  switch (status?.toLowerCase()) {
    case "to do":
      return "bg-slate-100 text-slate-700 ring-slate-600/20";
    case "in progress":
      return "bg-blue-100 text-blue-700 ring-blue-600/20";
    case "done":
      return "bg-violet-100 text-violet-700 ring-violet-600/20";
    default:
      return "bg-slate-100 text-slate-700 ring-slate-600/20";
  }
};

export default function ProblemsTable({
  problems,
  onView,
  onEdit,
  onDelete,
  onLogRevision,
}) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm ">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm table-fixed">
          <thead className="border-b border-slate-200">
            <tr>
              <th
                scope="col"
                className="px-6 py-4 text-left font-medium text-slate-500 w-2/5"
              >
                Title
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-center font-medium text-slate-500 w-1/6"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-center font-medium text-slate-500 w-1/6"
              >
                Difficulty
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-center font-medium text-slate-500 w-1/4"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/80">
            {problems.map((problem) => (
              <tr
                key={problem.ID}
                className="hover:bg-slate-50/50 transition-colors duration-150"
              >
                <td className="px-6 py-4 whitespace-nowrap overflow-hidden text-ellipsis">
                  <button
                    onClick={() => onView(problem)}
                    className="font-medium text-slate-800 hover:text-sky-600 text-left"
                  >
                    {problem.Title}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span
                    className={`px-2.5 py-1 inline-flex font-semibold rounded-full text-xs ring-1 ring-inset ${getStatusStyles(
                      problem.Status
                    )}`}
                  >
                    {problem.Status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span
                    className={`px-2.5 py-1 inline-flex font-semibold rounded-full text-xs ring-1 ring-inset ${getDifficultyStyles(
                      problem.Difficulty
                    )}`}
                  >
                    {problem.Difficulty}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                  <button
                    onClick={() => onLogRevision(problem)}
                    className="text-green-600 hover:text-green-800 transition-colors mr-4"
                  >
                    Revisions
                  </button>
                  <button
                    onClick={() => onEdit(problem)}
                    className="text-slate-600 hover:text-sky-600 transition-colors mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(problem.ID)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
