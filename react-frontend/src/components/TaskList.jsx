import TaskItem from "./TaskItem";

function TaskList({ tasks, loading, error, editingId, onEdit, onDelete, onToggle }) {
  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "8px" }}>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="animate-pulse"
            style={{
              height: "52px",
              background: "#F3F4F6",
              borderRadius: "12px",
              border: "1px solid #E5E7EB",
            }}
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        color: "#EF4444",
        background: "#FEF2F2",
        border: "1px solid #FECACA",
        padding: "14px 16px",
        borderRadius: "12px",
        fontSize: "14px",
        fontWeight: 500,
        marginTop: "8px",
        fontFamily: "Inter, sans-serif",
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        {error}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 24px",
        textAlign: "center",
        fontFamily: "Inter, sans-serif",
        animation: "fadeIn 200ms ease both",
      }}>
        <div style={{
          width: "48px", height: "48px",
          borderRadius: "14px",
          background: "#F3F4F6",
          border: "1px solid #E5E7EB",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: "16px",
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <line x1="8" y1="6" x2="21" y2="6"/>
            <line x1="8" y1="12" x2="21" y2="12"/>
            <line x1="8" y1="18" x2="21" y2="18"/>
            <line x1="3" y1="6" x2="3.01" y2="6"/>
            <line x1="3" y1="12" x2="3.01" y2="12"/>
            <line x1="3" y1="18" x2="3.01" y2="18"/>
          </svg>
        </div>
        <p style={{ color: "#374151", fontWeight: 600, fontSize: "14px", margin: "0 0 4px 0" }}>No tasks yet</p>
        <p style={{ color: "#9CA3AF", fontWeight: 400, fontSize: "12px", margin: 0 }}>
          Add your first task above to get started
        </p>
      </div>
    );
  }

  return (
    <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          isEditing={editingId === task.id}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggle={onToggle}
        />
      ))}
    </ul>
  );
}

export default TaskList;
