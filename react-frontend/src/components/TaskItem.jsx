import React, { useState } from "react";
import { Edit2, Circle, CheckCircle2 } from "lucide-react";

// 1. Accept the onToggle prop here
function TaskItem({ task, isEditing, onEdit, onToggle }) {
  const [isDragging, setIsDragging] = useState(false);

  // 🔥 Look! No local isCompleted state anymore.
  // We check if task.status is equal to 'completed'
  const isTaskCompleted = task.status === "completed";

  return (
    <li
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", task.id);
        setTimeout(() => setIsDragging(true), 0);
      }}
      onDragEnd={() => setIsDragging(false)}
      className={`flex justify-between items-center p-5 mb-3 bg-white border rounded-[16px] cursor-grab transition-all duration-300
                ${isDragging ? "opacity-40 shadow-xl scale-95 border-gray-300" : "opacity-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 border-gray-100"}
                ${isEditing ? "ring-2 ring-[#293681] border-transparent" : ""}
                ${isTaskCompleted ? "bg-gray-50/50" : ""}`}>
      <div className="flex items-center gap-3">
        {/* 2. When clicked, fire the global handler passing the whole task object */}
        <button
          onClick={() => onToggle(task)}
          className="focus:outline-none group">
          {isTaskCompleted ? (
            <CheckCircle2 className="w-5 h-5 text-[#293681]" />
          ) : (
            <Circle className="w-5 h-5 text-gray-300 group-hover:text-[#293681] transition-colors" />
          )}
        </button>

        <span
          className={`text-[15px] font-semibold transition-all duration-300 
                    ${isTaskCompleted ? "text-gray-400 line-through" : "text-gray-800"}`}>
          {task.name}
        </span>
      </div>

      <button
        onClick={() => onEdit(task)}
        className={`p-2 rounded-lg transition-all ${isEditing ? "text-[#293681] bg-[#E8ECFF]" : "text-gray-400 hover:text-[#293681] hover:bg-gray-50"}`}>
        <Edit2 className="w-4 h-4" />
      </button>
    </li>
  );
}

export default TaskItem;
