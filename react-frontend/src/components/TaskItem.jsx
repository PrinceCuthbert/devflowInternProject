import React, { useState } from "react";

function TaskItem({ task, isEditing, onEdit, onToggle }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [editHovered, setEditHovered] = useState(false);
  const isCompleted = task.status === "completed";

  return (
    <li
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", task.id);
        setTimeout(() => setIsDragging(true), 0);
      }}
      onDragEnd={() => setIsDragging(false)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "14px 16px",
        marginBottom: "8px",
        background: isCompleted ? "#FAFAFA" : "#FFFFFF",
        border: isEditing ? "2px solid #16A34A" : "1px solid #E5E7EB",
        borderRadius: "12px",
        cursor: "grab",
        transition: "box-shadow 180ms ease, transform 180ms ease, opacity 180ms ease",
        boxShadow: isDragging
          ? "0 8px 24px rgba(0,0,0,0.12)"
          : isHovered
          ? "0 4px 12px rgba(0,0,0,0.08)"
          : "0 1px 4px rgba(0,0,0,0.04)",
        transform: isDragging ? "scale(0.97)" : isHovered ? "translateY(-1px)" : "translateY(0)",
        opacity: isDragging ? 0.5 : 1,
        userSelect: "none",
        animation: "fadeSlideUp 200ms ease both",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
        {/* Checkbox toggle */}
        <button
          onClick={() => onToggle(task)}
          style={{ flexShrink: 0, background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center" }}
        >
          {isCompleted ? (
            <span style={{
              width: "20px", height: "20px", borderRadius: "50%",
              background: "#16A34A",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 1px 4px rgba(22,163,74,0.25)",
            }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </span>
          ) : (
            <span style={{
              width: "20px", height: "20px", borderRadius: "50%",
              border: "2px solid #D1D5DB",
              display: "block", flexShrink: 0,
              transition: "border-color 150ms ease",
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "#16A34A"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "#D1D5DB"}
            />
          )}
        </button>

        {/* Task name */}
        <span style={{
          fontSize: "14px",
          fontWeight: 500,
          fontFamily: "Inter, sans-serif",
          color: isCompleted ? "#9CA3AF" : "#374151",
          textDecoration: isCompleted ? "line-through" : "none",
          transition: "color 180ms ease",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}>
          {task.name}
        </span>
      </div>

      {/* Edit button */}
      <button
        onClick={() => onEdit(task)}
        onMouseEnter={() => setEditHovered(true)}
        onMouseLeave={() => setEditHovered(false)}
        style={{
          flexShrink: 0,
          marginLeft: "12px",
          padding: "6px",
          borderRadius: "8px",
          border: "none",
          background: isEditing || editHovered ? "#F0FDF4" : "transparent",
          color: isEditing ? "#16A34A" : editHovered ? "#16A34A" : "#9CA3AF",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          transition: "background 150ms ease, color 150ms ease",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
      </button>
    </li>
  );
}

export default TaskItem;
