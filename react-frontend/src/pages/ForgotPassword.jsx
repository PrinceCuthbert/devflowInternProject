import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client/react";
import { REQUEST_PASSWORD_RESET } from "../service/graphqlQueries";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const font = "Inter, system-ui, sans-serif";
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [requestPasswordReset, { loading }] = useMutation(REQUEST_PASSWORD_RESET);

  const handleResetRequest = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const { data } = await requestPasswordReset({ variables: { email } });
      setMessage(data?.requestPasswordReset || "If an account exists with this email, a reset link has been sent.");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
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
          onClick={() => navigate(-1)}
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
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
          </div>
        </div>

        {/* Heading */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1 style={{ margin: "0 0 8px 0", fontSize: "28px", fontWeight: 600, color: "#111827", letterSpacing: "-0.02em", fontFamily: font }}>
            Forgot Password
          </h1>
          <p style={{ margin: 0, fontSize: "14px", fontWeight: 400, color: "#6B7280", lineHeight: 1.6, fontFamily: font }}>
            Enter your email to receive a password reset link.
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

        <form onSubmit={handleResetRequest} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

          {/* Email input */}
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <span style={{
              position: "absolute", left: "14px",
              display: "flex", alignItems: "center",
              color: "#9CA3AF", pointerEvents: "none",
            }}>
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L22 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </span>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ marginTop: "4px" }}
          >
            {loading ? "Processing..." : "Send Reset Link"}
          </button>
        </form>

        {/* Back to login */}
        <p style={{ textAlign: "center", fontSize: "13px", fontWeight: 500, color: "#6B7280", marginTop: "24px", marginBottom: 0, fontFamily: font }}>
          Remember your password?{" "}
          <button
            onClick={() => navigate("/login")}
            style={{
              background: "none", border: "none",
              color: "#16A34A", fontWeight: 600,
              fontSize: "13px", cursor: "pointer", fontFamily: font,
              transition: "opacity 150ms ease",
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.8"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            Back to Login
          </button>
        </p>

      </div>
    </div>
  );
};

export default ForgotPassword;