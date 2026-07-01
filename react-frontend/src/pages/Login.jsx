import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { useMutation } from "@apollo/client/react";
import { LOGIN_WITH_EMAIL_PASSWORD, VERIFY_OTP } from "../service/graphqlQueries";
import OtpModal from "../components/OtpModal";
import { FaFacebook, FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

/* ─── Eye Icon (outline) ─── */
function EyeIcon({ open }) {
  return open ? (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  );
}

/* ─── Shared sub-components ─── */
function FieldIcon({ children }) {
  return (
    <span style={{
      position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)",
      display: "flex", alignItems: "center", color: "#9CA3AF", pointerEvents: "none",
    }}>
      {children}
    </span>
  );
}

function Field({ icon, children }) {
  return (
    <div style={{ position: "relative" }}>
      <FieldIcon>{icon}</FieldIcon>
      {children}
    </div>
  );
}

function fieldInput(extra = {}) {
  return {
    width: "100%",
    height: "46px",
    background: "#F8FAFC",
    border: "1px solid #E2E8F0",
    borderRadius: "10px",
    padding: "0 14px 0 42px",
    fontFamily: "Inter, sans-serif",
    fontSize: "14px",
    fontWeight: 400,
    color: "#1E293B",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 160ms, box-shadow 160ms, background 160ms",
    ...extra,
  };
}

export default function Login() {
  const { completeLoginSession } = useAuth();
  const navigate = useNavigate();
  const f = "Inter, system-ui, sans-serif";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("EMAIL");
  const [mfaDestination, setMfaDestination] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [stepToken, setStepToken] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [focus, setFocus] = useState("");

  const [loginWithEmailPassword, { loading: loginLoading }] = useMutation(LOGIN_WITH_EMAIL_PASSWORD);
  const [verifyOtp, { loading: otpLoading }] = useMutation(VERIFY_OTP);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccessMessage("");
    const trimmed = mfaDestination.trim();
    if (!trimmed) { setError(deliveryMethod === "EMAIL" ? "Please enter an MFA email address." : "Please enter an MFA mobile number."); return; }
    try {
      const { data } = await loginWithEmailPassword({ variables: { username, password, deliveryMethod, mfaDestination: trimmed } });
      if (data?.loginWithEmailPassword?.requiresOtp) {
        setStepToken(data.loginWithEmailPassword.stepToken);
        setSuccessMessage(`Verification code sent to ${trimmed}.`);
        setShowOtpModal(true);
      }
    } catch (err) { setError(err.message || "Something went wrong."); }
  };

  const handleOtpVerification = async (otpCode) => {
    setError("");
    try {
      const { data } = await verifyOtp({ variables: { stepToken, code: otpCode } });
      if (data?.verifyOtp && !data.verifyOtp.requiresOtp) { setShowOtpModal(false); completeLoginSession(data.verifyOtp); }
    } catch (err) { setError(err.message || "Invalid verification code."); }
  };

  /* ── Focus ring helper ── */
  const focusStyle = (name) => focus === name
    ? { borderColor: "#16A34A", boxShadow: "0 0 0 3px rgba(22,163,74,0.10)", background: "#FFFFFF" }
    : {};

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
          <h1 style={{ margin: "0 0 6px", fontSize: "26px", fontWeight: 600, color: "#0F172A", letterSpacing: "-0.025em", fontFamily: f }}>Welcome back</h1>
          <p style={{ margin: 0, fontSize: "14px", color: "#64748B", lineHeight: 1.55, fontFamily: f }}>Sign in to continue to your workspace</p>
        </div>

        {/* Error / success alerts */}
        {error && <Alert type="error">{error}</Alert>}
        {successMessage && <Alert type="success">{successMessage}</Alert>}

        <form onSubmit={handleLoginSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

          {/* Username */}
          <Field icon={<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>}>
            <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)}
              onFocus={() => setFocus("user")} onBlur={() => setFocus("")}
              style={{ ...fieldInput(), ...focusStyle("user") }} required />
          </Field>

          {/* Password */}
          <Field icon={<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>}>
            <input type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
              onFocus={() => setFocus("pw")} onBlur={() => setFocus("")}
              style={{ ...fieldInput({ paddingRight: "42px" }), ...focusStyle("pw") }} required />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#94A3B8", cursor: "pointer", display: "flex", alignItems: "center", padding: "2px", transition: "color 150ms" }}
              onMouseEnter={e => e.currentTarget.style.color = "#475569"}
              onMouseLeave={e => e.currentTarget.style.color = "#94A3B8"}>
              <EyeIcon open={showPassword} />
            </button>
          </Field>

          {/* Remember / Forgot */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "2px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "13px", fontWeight: 400, color: "#475569", cursor: "pointer", fontFamily: f, userSelect: "none" }}>
              <input type="checkbox" style={{ accentColor: "#16A34A", width: "14px", height: "14px", borderRadius: "4px", cursor: "pointer" }} />
              Remember me
            </label>
            <button type="button" onClick={() => navigate("/forgot-password")}
              style={{ background: "none", border: "none", fontSize: "13px", fontWeight: 500, color: "#475569", cursor: "pointer", fontFamily: f, transition: "color 150ms" }}
              onMouseEnter={e => e.currentTarget.style.color = "#16A34A"}
              onMouseLeave={e => e.currentTarget.style.color = "#475569"}>
              Forgot password?
            </button>
          </div>

          {/* MFA Section */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", paddingTop: "4px" }}>
            <label style={{ fontSize: "11px", fontWeight: 500, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.07em", fontFamily: f }}>
              MFA Method
            </label>

            {/* Segmented toggle */}
            <div style={{ display: "flex", background: "#F1F5F9", borderRadius: "10px", padding: "3px", gap: "3px" }}>
              {[["EMAIL", "Email Box"], ["SMS", "Mobile SMS"]].map(([val, label]) => (
                <button key={val} type="button"
                  onClick={() => { setDeliveryMethod(val); setMfaDestination(""); }}
                  style={{
                    flex: 1, height: "36px",
                    borderRadius: "8px",
                    border: "none",
                    fontFamily: f, fontSize: "13px", fontWeight: 500,
                    cursor: "pointer",
                    transition: "all 180ms ease",
                    background: deliveryMethod === val ? "#FFFFFF" : "transparent",
                    color: deliveryMethod === val ? "#0F172A" : "#64748B",
                    boxShadow: deliveryMethod === val ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                  }}>
                  {label}
                </button>
              ))}
            </div>

            {/* MFA destination */}
            <Field icon={
              deliveryMethod === "EMAIL"
                ? <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L22 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                : <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
            }>
              <input
                type={deliveryMethod === "EMAIL" ? "email" : "tel"}
                placeholder={deliveryMethod === "EMAIL" ? "Verification email address" : "Verification mobile number"}
                value={mfaDestination}
                onChange={e => setMfaDestination(e.target.value)}
                onFocus={() => setFocus("mfa")} onBlur={() => setFocus("")}
                style={{ ...fieldInput(), ...focusStyle("mfa") }}
                required />
            </Field>
          </div>

          {/* Submit */}
          <button type="submit" disabled={loginLoading}
            style={{
              width: "100%", height: "46px",
              background: loginLoading ? "#86EFAC" : "#16A34A",
              color: "#ffffff",
              border: "none",
              borderRadius: "10px",
              fontFamily: f, fontSize: "14px", fontWeight: 600,
              cursor: loginLoading ? "not-allowed" : "pointer",
              marginTop: "6px",
              transition: "background 180ms, transform 150ms, box-shadow 180ms",
              boxShadow: "0 1px 3px rgba(22,163,74,0.20)",
            }}
            onMouseEnter={e => { if (!loginLoading) { e.currentTarget.style.background = "#15803D"; e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(22,163,74,0.28)"; } }}
            onMouseLeave={e => { e.currentTarget.style.background = loginLoading ? "#86EFAC" : "#16A34A"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(22,163,74,0.20)"; }}>
            {loginLoading ? "Authorizing…" : "Log In"}
          </button>
        </form>

        {/* Sign up */}
        <p style={{ textAlign: "center", fontSize: "13px", color: "#64748B", margin: "20px 0 0", fontFamily: f }}>
          Don't have an account?{" "}
          <button onClick={() => navigate("/signup")}
            style={{ background: "none", border: "none", color: "#16A34A", fontWeight: 600, fontSize: "13px", cursor: "pointer", fontFamily: f, padding: 0 }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.75"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
            Create one
          </button>
        </p>

        {/* Divider */}
        <Divider />

        {/* Social */}
        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
          <SocialBtn label="Continue with Facebook" color="#1877F2"><FaFacebook size={18} /></SocialBtn>
          <SocialBtn label="Continue with Google"><FcGoogle size={18} /></SocialBtn>
          <SocialBtn label="Continue with GitHub" color="#0F172A"><FaGithub size={18} /></SocialBtn>
        </div>

      </div>

      <OtpModal isOpen={showOtpModal} isLoading={otpLoading} onClose={() => setShowOtpModal(false)} onVerify={handleOtpVerification} />
    </div>
  );
}

/* ─── Shared UI primitives ─── */
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
