import { useState } from "react";
import useTodos from "../hooks/useTodos";
import TaskInput from "../components/TaskInput";
import TaskList from "../components/TaskList";
import TrashBucket from "../components/TrashBucket";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

/* ── Inline style tokens ── */
const S = {
  font: "Inter, system-ui, sans-serif",
  green: "#16A34A",
  green50: "#F0FDF4",
  gray50: "#F9FAFB",
  gray100: "#F3F4F6",
  gray200: "#E5E7EB",
  gray400: "#9CA3AF",
  gray500: "#6B7280",
  gray700: "#374151",
  gray900: "#111827",
  amber50: "#FFFBEB",
  amber600: "#D97706",
  white: "#FFFFFF",
  border: "1px solid #E5E7EB",
};

function StatCard({ icon, label, value, iconBg, valueColor }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: S.white,
        border: S.border,
        borderRadius: "16px",
        padding: "20px 24px",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        boxShadow: hovered ? "0 4px 16px rgba(0,0,0,0.08)" : "0 2px 8px rgba(0,0,0,0.04)",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        transition: "box-shadow 180ms ease, transform 180ms ease",
        animation: "fadeSlideUp 200ms ease both",
      }}
    >
      <div style={{
        width: "44px", height: "44px",
        borderRadius: "12px",
        background: iconBg,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <p style={{ margin: "0 0 2px 0", fontSize: "11px", fontWeight: 500, color: S.gray400, textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: S.font }}>
          {label}
        </p>
        <p style={{ margin: 0, fontSize: "28px", fontWeight: 600, color: valueColor, lineHeight: 1.2, fontFamily: S.font }}>
          {value}
        </p>
      </div>
    </div>
  );
}

function Dashboard() {
  const { tasks, loading, error, editingId, setEditingId, saveTask, removeTask, toggleTaskStatus } = useTodos();
  const [inputValue, setInputValue] = useState("");
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const completedCount = tasks.filter((t) => t.status === "completed").length;
  const pendingCount = tasks.length - completedCount;

  const handleEdit = (task) => {
    setEditingId(task.id);
    setInputValue(task.name);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    saveTask(inputValue.trim());
    setInputValue("");
  };

  const initials = user.username.slice(0, 2).toUpperCase();

  return (
    <div style={{ minHeight: "100vh", background: S.gray50, fontFamily: S.font }}>

      {/* ── Top Navbar ── */}
      <nav style={{
        background: S.white,
        borderBottom: S.border,
        position: "sticky",
        top: 0,
        zIndex: 10,
        boxShadow: "0 1px 0 #E5E7EB",
      }}>
        <div style={{
          maxWidth: "960px",
          margin: "0 auto",
          padding: "0 32px",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          {/* Brand */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "32px", height: "32px",
              borderRadius: "10px",
              background: S.green,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 1px 4px rgba(22,163,74,0.25)",
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            <span style={{ fontWeight: 600, fontSize: "15px", color: S.gray900, letterSpacing: "-0.01em" }}>
              Devflow WorkSpace
            </span>
          </div>

          {/* Right side */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {user.role === "admin" && (
              <>
                <NavBtn onClick={() => navigate("/admin")} label="Admin Panel" />
                <NavBtn onClick={() => navigate("/admin/users")} label="All Users" />
              </>
            )}

            {/* Divider */}
            <div style={{ width: "1px", height: "20px", background: S.gray200, marginLeft: "4px", marginRight: "4px" }} />

            {/* Avatar + name */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{
                width: "32px", height: "32px",
                borderRadius: "50%",
                background: S.green,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 1px 4px rgba(22,163,74,0.20)",
              }}>
                <span style={{ color: "white", fontSize: "11px", fontWeight: 600 }}>{initials}</span>
              </div>
              <span style={{ fontSize: "14px", fontWeight: 500, color: S.gray700 }}>
                {user.username}
              </span>
            </div>

            {/* Sign out */}
            <SignOutBtn onClick={logout} />
          </div>
        </div>
      </nav>

      {/* ── Page Content ── */}
      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "40px 32px" }}>

        {/* Page heading */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ margin: "0 0 4px 0", fontSize: "28px", fontWeight: 600, color: S.gray900, letterSpacing: "-0.02em", fontFamily: S.font }}>
            My Projects
          </h1>
          <p style={{ margin: 0, fontSize: "14px", fontWeight: 400, color: S.gray400, fontFamily: S.font }}>
            Manage and track your work items
          </p>
        </div>

        {/* Stats Row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", marginBottom: "32px" }}>
          <StatCard
            iconBg="#F3F4F6"
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
                <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
              </svg>
            }
            label="Total"
            value={tasks.length}
            valueColor={S.gray900}
          />
          <StatCard
            iconBg="#F0FDF4"
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            }
            label="Completed"
            value={completedCount}
            valueColor="#16A34A"
          />
          <StatCard
            iconBg="#FFFBEB"
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            }
            label="Pending"
            value={pendingCount}
            valueColor="#D97706"
          />
        </div>

        {/* Main task area */}
        <div style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <TaskInput
              inputValue={inputValue}
              setInputValue={setInputValue}
              onSubmit={handleSubmit}
              isEditing={!!editingId}
            />
            <TaskList
              tasks={tasks}
              loading={loading}
              error={error}
              editingId={editingId}
              onEdit={handleEdit}
              onDelete={removeTask}
              onToggle={toggleTaskStatus}
            />
          </div>

          <div style={{ width: "176px", flexShrink: 0 }}>
            <TrashBucket onDropTask={removeTask} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Small sub-components ── */
function NavBtn({ onClick, label }) {
  const [h, setH] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        fontSize: "12px",
        fontWeight: 500,
        fontFamily: "Inter, sans-serif",
        color: h ? "#374151" : "#6B7280",
        background: h ? "#F3F4F6" : "transparent",
        border: "1px solid",
        borderColor: h ? "#D1D5DB" : "#E5E7EB",
        padding: "6px 12px",
        borderRadius: "8px",
        cursor: "pointer",
        transition: "all 150ms ease",
      }}
    >
      {label}
    </button>
  );
}

function SignOutBtn({ onClick }) {
  const [h, setH] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        fontSize: "13px",
        fontWeight: 500,
        fontFamily: "Inter, sans-serif",
        color: h ? "#EF4444" : "#9CA3AF",
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "6px 8px",
        borderRadius: "8px",
        transition: "color 150ms ease",
      }}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
        <polyline points="16 17 21 12 16 7"/>
        <line x1="21" y1="12" x2="9" y2="12"/>
      </svg>
      Sign out
    </button>
  );
}

export default Dashboard;
