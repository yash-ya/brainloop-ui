"use client";

export default function FilterToggle({ label, isChecked, onChange }) {
  return (
    <label htmlFor="filter-toggle" className="flex items-center cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          id="filter-toggle"
          className="sr-only"
          checked={isChecked}
          onChange={onChange}
        />
        <div
          className={`block w-12 h-6 rounded-full transition-colors ${
            isChecked ? "bg-sky-500" : "bg-slate-300"
          }`}
        ></div>
        <div
          className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
            isChecked ? "translate-x-6" : ""
          }`}
        ></div>
      </div>
      <div className="ml-3 text-slate-600 font-medium">{label}</div>
    </label>
  );
}
