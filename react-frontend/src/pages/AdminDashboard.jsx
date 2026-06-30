import { Shield, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { apiService } from "../service/apiService";
import { useEffect, useState } from "react";

function AdminDashboard() {
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await apiService.getUsers();
        setUsersList(data);
      } catch (err) {
        setError("Access denied.", err);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow shadow-blue-200">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            <span className="font-bold text-slate-800 text-base tracking-tight">WorkSpace</span>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 px-4 py-2 rounded-xl">
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </button>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Page heading */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-11 h-11 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center">
            <Shield className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">System Access Logs</h1>
            <p className="text-slate-400 text-sm mt-0.5">Authorized personnel only</p>
          </div>
        </div>

        {/* Table card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex flex-col gap-3 p-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-12 bg-slate-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <div className="flex items-center gap-2.5 text-red-500 bg-red-50 border border-red-100 m-6 py-4 px-5 rounded-xl font-medium text-sm">
              <Shield className="w-4 h-4 shrink-0" />
              {error}
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">User ID</th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Username</th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Role</th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Joined</th>
                </tr>
              </thead>
              <tbody>
                {usersList.map((u) => (
                  <tr key={u.id} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6 text-slate-400 text-sm font-mono">#{u.id}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-700 text-xs font-bold">
                            {u.username.slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-slate-700 font-semibold text-sm">{u.username}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wider
                        ${u.role === "admin"
                          ? "bg-red-50 text-red-600 border border-red-100"
                          : "bg-slate-100 text-slate-600"}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-400 text-sm">
                      {new Date(u.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
