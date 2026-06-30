import React from "react";

function TaskInput({ inputValue, setInputValue, onSubmit, isEditing }) {
  return (
    <form onSubmit={onSubmit} className="flex gap-3 mb-6">
      <div className="flex-1 relative flex items-center bg-white border border-slate-200 rounded-xl shadow-sm focus-within:border-blue-500 focus-within:ring-3 focus-within:ring-blue-100 transition-all">
        <svg className="absolute left-4 w-4 h-4 text-slate-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={isEditing ? "Edit task name..." : "Add a new project task..."}
          className="w-full bg-transparent py-3.5 pl-11 pr-4 outline-none text-slate-800 text-sm placeholder-slate-400 font-medium"
        />
      </div>
      <button
        type="submit"
        className={`px-5 rounded-xl font-bold text-sm transition-all duration-200 shadow-sm whitespace-nowrap ${
          isEditing
            ? "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-200"
            : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200"
        }`}>
        {isEditing ? "Update" : "Add Task"}
      </button>
    </form>
  );
}

export default TaskInput;
