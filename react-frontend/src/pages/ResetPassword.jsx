import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@apollo/client/react";
import { EXECUTE_PASSWORD_RESET } from "../service/graphqlQueries";

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

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const font = "Inter, system-ui, sans-serif";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [executePasswordReset, { loading }] = useMutation(EXECUTE_PASSWORD_RESET);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!token) {
      setError("Reset token is missing from the URL link.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const { data } = await executePasswordReset({
        variables: { token, newPassword: password },
      });
      setMessage(data?.executePasswordReset || "Password successfully reset.");
      setTimeout(() => {
        navigate("/login");
      }, 2200);
    } catch (err) {
      setError(err.message || "Failed to reset password. The link may have expired.");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#F9FAFB",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      fontFamily: font,
    }}>
      <div className="auth-card animate-fade-slide-up">
        
        {/* Back button */}
        <button
          onClick={() => navigate("/login")}
          style={{
            position: "absolute", left: "24px", top: "24px",
            background: "none", border: "none",
            color: "#6B7280", cursor: "pointer",
            display: "flex", alignItems: "center",
            padding: "4px", borderRadius: "6px",
            transition: "color 150ms ease",
          }}
          onMouseEnter={e => e.currentTarget.style.color = "#111827"}
          onMouseLeave={e => e.currentTarget.style.color = "#6B7280"}
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Lock icon */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: "8px", marginBottom: "20px" }}>
          <div style={{
            width: "52px", height: "52px",
            borderRadius: "16px",
            background: "#F0FDF4",
            border: "1px solid #BBF7D0",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#16A34A" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
          </div>
        </div>

        {/* Heading */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1 style={{ margin: "0 0 8px 0", fontSize: "28px", fontWeight: 600, color: "#111827", letterSpacing: "-0.02em", fontFamily: font }}>
            Reset Password
          </h1>
          <p style={{ margin: 0, fontSize: "14px", fontWeight: 400, color: "#6B7280", lineHeight: 1.6, fontFamily: font }}>
            {!token ? "Missing verification token link." : "Enter and confirm your new secure password."}
          </p>
        </div>

        {/* Success message */}
        {message && (
          <div style={{
            background: "#F0FDF4", color: "#16A34A", border: "1px solid #BBF7D0",
            padding: "12px 16px", borderRadius: "10px", fontSize: "13px", fontWeight: 500,
            marginBottom: "20px", textAlign: "center", fontFamily: font,
          }}>
            {message}
          </div>
        )}

        {/* Error message */}
        {error && (
          <div style={{
            background: "#FEF2F2", color: "#DC2626", border: "1px solid #FECACA",
            padding: "12px 16px", borderRadius: "10px", fontSize: "13px", fontWeight: 500,
            marginBottom: "20px", textAlign: "center", fontFamily: font,
          }}>
            {error}
          </div>
        )}

        {!token ? (
          <div style={{ textAlign: "center", marginTop: "10px" }}>
            <button
              onClick={() => navigate("/forgot-password")}
              className="btn-primary"
            >
              Request New Reset Link
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            
            {/* New Password */}
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <span style={{
                position: "absolute", left: "14px",
                display: "flex", alignItems: "center",
                color: "#9CA3AF", pointerEvents: "none",
              }}>
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
              </span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                style={{ paddingRight: "42px" }}
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                style={{ position: "absolute", right: "12px", background: "none", border: "none", color: "#94A3B8", cursor: "pointer", display: "flex", alignItems: "center", padding: "2px", transition: "color 150ms" }}
                onMouseEnter={e => e.currentTarget.style.color = "#475569"}
                onMouseLeave={e => e.currentTarget.style.color = "#94A3B8"}>
                <EyeIcon open={showPassword} />
              </button>
            </div>

            {/* Confirm Password */}
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <span style={{
                position: "absolute", left: "14px",
                display: "flex", alignItems: "center",
                color: "#9CA3AF", pointerEvents: "none",
              }}>
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </span>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-field"
                style={{ paddingRight: "42px" }}
                required
              />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{ position: "absolute", right: "12px", background: "none", border: "none", color: "#94A3B8", cursor: "pointer", display: "flex", alignItems: "center", padding: "2px", transition: "color 150ms" }}
                onMouseEnter={e => e.currentTarget.style.color = "#475569"}
                onMouseLeave={e => e.currentTarget.style.color = "#94A3B8"}>
                <EyeIcon open={showConfirmPassword} />
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ marginTop: "6px" }}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

export default ResetPassword;
