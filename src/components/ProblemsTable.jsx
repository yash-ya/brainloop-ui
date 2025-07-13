"use client";

const formatRevisionDate = (dateString) => {
  if (!dateString) return { text: "Not Scheduled", color: "text-slate-400" };
  const revisionDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  revisionDate.setHours(0, 0, 0, 0);
  const diffTime = revisionDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0)
    return {
      text: `Due ${Math.abs(diffDays)}d ago`,
      color: "text-red-600 font-semibold",
    };
  switch (diffDays) {
    case 0:
      return { text: "Due Today", color: "text-amber-600 font-semibold" };
    case 1:
      return { text: "Due Tomorrow", color: "text-blue-600" };
    default:
      return { text: `In ${diffDays} days`, color: "text-slate-500" };
  }
};

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

const SortableHeader = ({
  children,
  sortKey,
  sortConfig,
  requestSort,
  className = "",
}) => {
  const isSorted = sortConfig.key === sortKey;
  const directionIcon = isSorted
    ? sortConfig.direction === "ascending"
      ? "▲"
      : "▼"
    : "";
  return (
    <th
      scope="col"
      className={`px-6 py-4 font-medium text-slate-500 cursor-pointer ${className}`}
      onClick={() => requestSort(sortKey)}
    >
      <div className="flex items-center justify-center gap-2">
        {children}
        <span className="text-xs">{directionIcon}</span>
      </div>
    </th>
  );
};

export default function ProblemsTable({
  problems,
  onView,
  onEdit,
  onDelete,
  onLogRevision,
  sortConfig,
  requestSort,
}) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm table-fixed">
          <thead className="border-b border-slate-200">
            <tr>
              <th
                scope="col"
                className="px-6 py-4 text-left font-medium text-slate-500 w-2/5 cursor-pointer"
                onClick={() => requestSort("Title")}
              >
                <div className="flex items-center gap-2">
                  Title
                  <span className="text-xs">
                    {sortConfig.key === "Title"
                      ? sortConfig.direction === "ascending"
                        ? "▲"
                        : "▼"
                      : ""}
                  </span>
                </div>
              </th>
              <SortableHeader
                sortKey="NextRevisionDate"
                sortConfig={sortConfig}
                requestSort={requestSort}
                className="w-1/6"
              >
                Next Revision
              </SortableHeader>
              <SortableHeader
                sortKey="Status"
                sortConfig={sortConfig}
                requestSort={requestSort}
                className="w-1/6"
              >
                Status
              </SortableHeader>
              <SortableHeader
                sortKey="Difficulty"
                sortConfig={sortConfig}
                requestSort={requestSort}
                className="w-1/6"
              >
                Difficulty
              </SortableHeader>
              <th
                scope="col"
                className="px-6 py-4 text-center font-medium text-slate-500 w-1/4"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/80">
            {problems.map((problem) => {
              const revisionInfo = formatRevisionDate(problem.NextRevisionDate);
              return (
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
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-center ${revisionInfo.color}`}
                  >
                    {revisionInfo.text}
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
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
