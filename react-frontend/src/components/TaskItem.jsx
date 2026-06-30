import React, { useState } from "react";

function TaskItem({ task, isEditing, onEdit, onToggle }) {
  const [isDragging, setIsDragging] = useState(false);
  const isCompleted = task.status === "completed";

  return (
    <li
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", task.id);
        setTimeout(() => setIsDragging(true), 0);
      }}
      onDragEnd={() => setIsDragging(false)}
      className={`flex justify-between items-center p-4 mb-2.5 bg-white border rounded-2xl cursor-grab transition-all duration-200
        ${isDragging ? "opacity-40 scale-95 shadow-lg border-slate-200" : "opacity-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 border-slate-100"}
        ${isEditing ? "ring-2 ring-blue-500 border-transparent" : ""}
        ${isCompleted ? "bg-slate-50/70" : ""}`}>

      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={() => onToggle(task)}
          className="shrink-0 focus:outline-none group">
          {isCompleted ? (
            <span className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center shadow shadow-blue-200">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </span>
          ) : (
            <span className="w-5 h-5 rounded-full border-2 border-slate-300 group-hover:border-blue-500 transition-colors block" />
          )}
        </button>

        <span className={`text-sm font-semibold transition-all duration-200 truncate
          ${isCompleted ? "text-slate-400 line-through" : "text-slate-800"}`}>
          {task.name}
        </span>
      </div>

      <button
        onClick={() => onEdit(task)}
        className={`shrink-0 ml-3 p-2 rounded-lg transition-all ${
          isEditing
            ? "text-blue-600 bg-blue-50"
            : "text-slate-400 hover:text-blue-600 hover:bg-blue-50"
        }`}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
      </button>
    </li>
  );
}

export default TaskItem;
