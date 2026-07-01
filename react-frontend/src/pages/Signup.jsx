import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { FaFacebook, FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

/* ─── Shared primitives ─── */
function Alert({ type, children }) {
  const isErr = type === "error";
  return (
    <div style={{
      background: isErr ? "#FEF2F2" : "#F0FDF4",
      color: isErr ? "#DC2626" : "#16A34A",
      border: `1px solid ${isErr ? "#FECACA" : "#BBF7D0"}`,
      padding: "10px 14px", borderRadius: "8px",
      fontSize: "13px", fontWeight: 500, marginBottom: "12px",
      fontFamily: "Inter, sans-serif",
    }}>
      {children}
    </div>
  );
}

function Divider() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "20px 0 16px" }}>
      <div style={{ flex: 1, height: "1px", background: "#E9EEF4" }} />
      <span style={{ fontSize: "11px", fontWeight: 500, color: "#94A3B8", letterSpacing: "0.06em", textTransform: "uppercase", whiteSpace: "nowrap", fontFamily: "Inter, sans-serif" }}>
        or continue with
      </span>
      <div style={{ flex: 1, height: "1px", background: "#E9EEF4" }} />
    </div>
  );
}

function SocialBtn({ children, label, color }) {
  const [h, setH] = useState(false);
  return (
    <button type="button" aria-label={label}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        width: "56px", height: "44px",
        borderRadius: "10px",
        border: "1px solid #E2E8F0",
        background: h ? "#F8FAFC" : "#FFFFFF",
        color: color || "#374151",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer",
        transition: "background 150ms, border-color 150ms, box-shadow 150ms",
        boxShadow: h ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
      }}>
      {children}
    </button>
  );
}

function fieldStyle(focused) {
  return {
    width: "100%",
    height: "46px",
    background: focused ? "#FFFFFF" : "#F8FAFC",
    border: `1px solid ${focused ? "#16A34A" : "#E2E8F0"}`,
    borderRadius: "10px",
    padding: "0 14px 0 42px",
    fontFamily: "Inter, sans-serif",
    fontSize: "14px",
    fontWeight: 400,
    color: "#1E293B",
    outline: "none",
    boxSizing: "border-box",
    boxShadow: focused ? "0 0 0 3px rgba(22,163,74,0.10)" : "none",
    transition: "border-color 160ms, box-shadow 160ms, background 160ms",
  };
}

function InputField({ icon, type = "text", placeholder, value, onChange, required }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <span style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", color: "#94A3B8", display: "flex", alignItems: "center", pointerEvents: "none" }}>
        {icon}
      </span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={fieldStyle(focused)}
        required={required}
      />
    </div>
  );
}

export default function Signup() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const f = "Inter, system-ui, sans-serif";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) return setError("Passwords do not match.");
    setLoading(true);
    try {
      await register(username, password, email, phoneNumber);
      setSuccess("Account created successfully! Redirecting…");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", fontFamily: f }}>
      <div style={{
        width: "100%", maxWidth: "420px",
        background: "#FFFFFF",
        borderRadius: "20px",
        padding: "40px 36px 36px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04)",
        border: "1px solid #E9EEF4",
        position: "relative",
        animation: "fadeSlideUp 220ms ease both",
      }}>

        {/* Back */}
        <button onClick={() => navigate(-1)} style={{ position: "absolute", left: "20px", top: "20px", background: "none", border: "none", color: "#94A3B8", cursor: "pointer", padding: "6px", borderRadius: "8px", display: "flex", alignItems: "center", transition: "color 150ms" }}
          onMouseEnter={e => e.currentTarget.style.color = "#334155"}
          onMouseLeave={e => e.currentTarget.style.color = "#94A3B8"}>
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
        </button>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <h1 style={{ margin: "0 0 6px", fontSize: "26px", fontWeight: 600, color: "#0F172A", letterSpacing: "-0.025em", fontFamily: f }}>Create Account</h1>
          <p style={{ margin: 0, fontSize: "14px", color: "#64748B", lineHeight: 1.55, fontFamily: f }}>Get started — it only takes a minute</p>
        </div>

        {error && <Alert type="error">{error}</Alert>}
        {success && <Alert type="success">{success}</Alert>}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>

          <InputField required icon={<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>}
            placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />

          <InputField required type="email" icon={<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L22 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>}
            placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} />

          <InputField required type="tel" icon={<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>}
            placeholder="Phone number (e.g. +250…)" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} />

          <InputField required type="password" icon={<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>}
            placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />

          <InputField required type="password" icon={<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>}
            placeholder="Confirm password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />

          <button type="submit" disabled={loading}
            style={{
              width: "100%", height: "46px",
              background: loading ? "#86EFAC" : "#16A34A",
              color: "#ffffff",
              border: "none",
              borderRadius: "10px",
              fontFamily: f, fontSize: "14px", fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              marginTop: "6px",
              transition: "background 180ms, transform 150ms, box-shadow 180ms",
              boxShadow: "0 1px 3px rgba(22,163,74,0.20)",
            }}
            onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = "#15803D"; e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(22,163,74,0.28)"; } }}
            onMouseLeave={e => { e.currentTarget.style.background = loading ? "#86EFAC" : "#16A34A"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(22,163,74,0.20)"; }}>
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: "13px", color: "#64748B", margin: "20px 0 0", fontFamily: f }}>
          Already have an account?{" "}
          <button onClick={() => navigate("/login")}
            style={{ background: "none", border: "none", color: "#16A34A", fontWeight: 600, fontSize: "13px", cursor: "pointer", fontFamily: f, padding: 0 }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.75"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
            Sign in
          </button>
        </p>

        <Divider />

        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
          <SocialBtn label="Continue with Facebook" color="#1877F2"><FaFacebook size={18} /></SocialBtn>
          <SocialBtn label="Continue with Google"><FcGoogle size={18} /></SocialBtn>
          <SocialBtn label="Continue with GitHub" color="#0F172A"><FaGithub size={18} /></SocialBtn>
        </div>

      </div>
    </div>
  );
}