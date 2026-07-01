import React from "react";

function TaskInput({ inputValue, setInputValue, onSubmit, isEditing }) {
  return (
    <form onSubmit={onSubmit} style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
      {/* Input wrapper */}
      <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "center" }}>
        <span style={{
          position: "absolute",
          left: "16px",
          display: "flex",
          alignItems: "center",
          color: "#9CA3AF",
          pointerEvents: "none",
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </span>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={isEditing ? "Edit task name..." : "Add a new project task..."}
          className="input-field"
          style={{ paddingLeft: "44px" }}
        />
      </div>

      {/* Submit button */}
      <button
        type="submit"
        style={{
          height: "48px",
          paddingLeft: "20px",
          paddingRight: "20px",
          borderRadius: "12px",
          fontFamily: "Inter, sans-serif",
          fontSize: "14px",
          fontWeight: 600,
          color: "#ffffff",
          border: "none",
          cursor: "pointer",
          whiteSpace: "nowrap",
          transition: "background 180ms ease, box-shadow 180ms ease, transform 150ms ease",
          background: isEditing ? "#D97706" : "#16A34A",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = isEditing ? "#B45309" : "#15803D";
          e.currentTarget.style.transform = "translateY(-1px)";
          e.currentTarget.style.boxShadow = isEditing
            ? "0 2px 8px rgba(217,119,6,0.25)"
            : "0 2px 8px rgba(22,163,74,0.25)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = isEditing ? "#D97706" : "#16A34A";
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        {isEditing ? "Update Task" : "Add Task"}
      </button>
    </form>
  );
}

export default TaskInput;
