import { Shield, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { apiService } from "../service/apiService";
import { useEffect, useState } from "react";

const S = {
  font: "Inter, system-ui, sans-serif",
  green: "#16A34A",
  green50: "#F0FDF4",
  green100: "#DCFCE7",
  gray50: "#F9FAFB",
  gray100: "#F3F4F6",
  gray200: "#E5E7EB",
  gray400: "#9CA3AF",
  gray500: "#6B7280",
  gray700: "#374151",
  gray900: "#111827",
  white: "#FFFFFF",
  border: "1px solid #E5E7EB",
};

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
    <div style={{ minHeight: "100vh", background: S.gray50, fontFamily: S.font }}>

      {/* ── Navbar ── */}
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

          {/* Back button */}
          <BackBtn onClick={() => navigate("/dashboard")} />
        </div>
      </nav>

      {/* ── Content ── */}
      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "40px 32px" }}>

        {/* Page heading */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
          <div style={{
            width: "44px", height: "44px",
            borderRadius: "12px",
            background: S.green50,
            border: `1px solid ${S.green100}`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Shield style={{ width: "20px", height: "20px", color: S.green }} />
          </div>
          <div>
            <h1 style={{ margin: "0 0 2px 0", fontSize: "28px", fontWeight: 600, color: S.gray900, letterSpacing: "-0.02em", fontFamily: S.font }}>
              System Access Logs
            </h1>
            <p style={{ margin: 0, fontSize: "14px", fontWeight: 400, color: S.gray400, fontFamily: S.font }}>
              Authorized personnel only
            </p>
          </div>
        </div>

        {/* Table card */}
        <div style={{
          background: S.white,
          border: S.border,
          borderRadius: "16px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          overflow: "hidden",
        }}>
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "24px" }}>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse" style={{ height: "52px", background: S.gray100, borderRadius: "10px" }} />
              ))}
            </div>
          ) : error ? (
            <div style={{
              display: "flex", alignItems: "center", gap: "10px",
              color: "#EF4444",
              background: "#FEF2F2",
              border: "1px solid #FECACA",
              margin: "24px",
              padding: "14px 16px",
              borderRadius: "10px",
              fontSize: "14px",
              fontWeight: 500,
              fontFamily: S.font,
            }}>
              <Shield style={{ width: "16px", height: "16px", flexShrink: 0 }} />
              {error}
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ background: S.gray50, borderBottom: `1px solid ${S.gray200}` }}>
                  {["User ID", "Username", "Role", "Joined"].map(col => (
                    <th key={col} style={{
                      padding: "14px 24px",
                      fontSize: "11px",
                      fontWeight: 500,
                      color: S.gray400,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      fontFamily: S.font,
                    }}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {usersList.map((u) => (
                  <UserRow key={u.id} user={u} />
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

function UserRow({ user: u }) {
  const [h, setH] = useState(false);
  const font = "Inter, system-ui, sans-serif";
  const isAdmin = u.role === "admin";

  return (
    <tr
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        borderBottom: "1px solid #F3F4F6",
        background: h ? "#F9FAFB" : "#FFFFFF",
        transition: "background 150ms ease",
      }}
    >
      <td style={{ padding: "16px 24px", fontSize: "13px", color: "#9CA3AF", fontFamily: "ui-monospace, monospace" }}>
        #{u.id}
      </td>
      <td style={{ padding: "16px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "30px", height: "30px",
            borderRadius: "50%",
            background: "#F0FDF4",
            border: "1px solid #BBF7D0",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <span style={{ color: "#16A34A", fontSize: "11px", fontWeight: 600, fontFamily: font }}>
              {u.username.slice(0, 2).toUpperCase()}
            </span>
          </div>
          <span style={{ color: "#374151", fontWeight: 500, fontSize: "14px", fontFamily: font }}>
            {u.username}
          </span>
        </div>
      </td>
      <td style={{ padding: "16px 24px" }}>
        <span style={{
          fontSize: "11px",
          padding: "4px 10px",
          borderRadius: "20px",
          fontWeight: 600,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          fontFamily: font,
          background: isAdmin ? "#F0FDF4" : "#F3F4F6",
          color: isAdmin ? "#16A34A" : "#6B7280",
          border: isAdmin ? "1px solid #BBF7D0" : "1px solid #E5E7EB",
        }}>
          {u.role}
        </span>
      </td>
      <td style={{ padding: "16px 24px", fontSize: "13px", color: "#9CA3AF", fontFamily: font }}>
        {new Date(u.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
      </td>
    </tr>
  );
}

function BackBtn({ onClick }) {
  const [h, setH] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontSize: "13px",
        fontWeight: 500,
        fontFamily: "Inter, system-ui, sans-serif",
        color: h ? "#374151" : "#6B7280",
        background: h ? "#F3F4F6" : "transparent",
        border: "1px solid",
        borderColor: h ? "#D1D5DB" : "#E5E7EB",
        padding: "8px 14px",
        borderRadius: "10px",
        cursor: "pointer",
        transition: "all 150ms ease",
      }}
    >
      <ArrowLeft style={{ width: "15px", height: "15px" }} />
      Back to Projects
    </button>
  );
}

export default AdminDashboard;
