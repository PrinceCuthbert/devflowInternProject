import React, { useState } from "react";

function TrashBucket({ onDropTask }) {
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!isDragActive) setIsDragActive(true);
  };

  const handleDragLeave = () => setIsDragActive(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    const taskId = e.dataTransfer.getData("text/plain");
    if (taskId) onDropTask(parseInt(taskId, 10));
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-2xl transition-all duration-300 select-none
        ${isDragActive
          ? "border-red-400 bg-red-50 scale-105"
          : "border-slate-200 bg-white hover:border-slate-300"
        } min-h-45`}>

      {/* Trash icon */}
      <div className={`mb-3 transition-all duration-300 ${isDragActive ? "scale-110" : ""}`}>
        <div className="relative w-10 flex flex-col items-center">
          <div className={`w-11 h-1.5 rounded transition-all duration-300 origin-bottom-left z-10
            ${isDragActive ? "bg-red-400 rotate-[-35deg] -translate-y-2" : "bg-slate-300"}`} />
          <div className={`w-8.5 h-10 mt-0.5 rounded-b-lg flex justify-evenly pt-1.5 transition-colors duration-300
            ${isDragActive ? "bg-red-400" : "bg-slate-300"}`}>
            <div className="w-0.5 h-6 bg-white/60 rounded-full" />
            <div className="w-0.5 h-6 bg-white/60 rounded-full" />
          </div>
        </div>
      </div>

      <p className={`text-xs font-semibold text-center transition-colors duration-300 ${isDragActive ? "text-red-500" : "text-slate-400"}`}>
        {isDragActive ? "Release to delete" : "Drag here\nto delete"}
      </p>
    </div>
  );
}

export default TrashBucket;
