import { useState } from "react";
import useTodos from "../hooks/useTodos";
import TaskInput from "../components/TaskInput";
import TaskList from "../components/TaskList";
import TrashBucket from "../components/TrashBucket";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

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
    <div className="min-h-screen bg-slate-50 font-sans">

      {/* ── Top Navbar ── */}
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow shadow-blue-200">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            <span className="font-bold text-slate-800 text-base tracking-tight">WorkSpace</span>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {user.role === "admin" && (
              <>
                <button
                  onClick={() => navigate("/admin")}
                  className="text-xs bg-red-50 text-red-600 border border-red-100 px-3 py-1.5 rounded-lg font-semibold hover:bg-red-100 transition-colors">
                  Admin Panel
                </button>
                <button
                  onClick={() => navigate("/admin/users")}
                  className="text-xs bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1.5 rounded-lg font-semibold hover:bg-blue-100 transition-colors">
                  All Users
                </button>
              </>
            )}

            <div className="flex items-center gap-2.5 pl-3 ml-1 border-l border-slate-100">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shadow shadow-blue-200">
                <span className="text-white text-xs font-bold">{initials}</span>
              </div>
              <span className="text-sm font-semibold text-slate-700 hidden sm:block">{user.username}</span>
            </div>

            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-red-500 transition-colors ml-1 font-medium">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Sign out
            </button>
          </div>
        </div>
      </nav>

      {/* ── Page Content ── */}
      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Page heading */}
        <div className="mb-7">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">My Projects</h1>
          <p className="text-slate-400 text-sm mt-1">Manage and track your work items</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
                <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total</p>
              <p className="text-2xl font-extrabold text-slate-800 leading-tight">{tasks.length}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Completed</p>
              <p className="text-2xl font-extrabold text-emerald-500 leading-tight">{completedCount}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending</p>
              <p className="text-2xl font-extrabold text-blue-600 leading-tight">{pendingCount}</p>
            </div>
          </div>
        </div>

        {/* Main task area */}
        <div className="flex gap-6 items-start">
          <div className="flex-1 min-w-0">
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

          <div className="w-44 shrink-0">
            <TrashBucket onDropTask={removeTask} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
