import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { useMutation } from "@apollo/client/react";
import { LOGIN_WITH_EMAIL_PASSWORD, VERIFY_OTP } from "../service/graphqlQueries";

function EyeIcon({ open }) {
  return open ? (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  );
}

function Login() {
  const { completeLoginSession } = useAuth();
  const navigate = useNavigate();

  // UI Flow: 'LOGIN' | 'OTP'
  const [authStage, setAuthStage] = useState("LOGIN");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("EMAIL");
  const [otpCode, setOtpCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [stepToken, setStepToken] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [loginWithEmailPassword, { loading: loginLoading }] = useMutation(LOGIN_WITH_EMAIL_PASSWORD);
  const [verifyOtp, { loading: otpLoading }] = useMutation(VERIFY_OTP);

  const handleFormSubmission = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    try {
      if (authStage === "LOGIN") {
        const { data } = await loginWithEmailPassword({
          variables: { username, password, deliveryMethod },
        });
        if (data?.loginWithEmailPassword?.requiresOtp) {
          setStepToken(data.loginWithEmailPassword.stepToken);
          setAuthStage("OTP");
          setSuccessMessage(
            `Verification code sent to your ${deliveryMethod === "EMAIL" ? "email" : "phone"}.`
          );
        }
      } else if (authStage === "OTP") {
        const { data } = await verifyOtp({ variables: { stepToken, code: otpCode } });
        if (data?.verifyOtp && !data.verifyOtp.requiresOtp) {
          completeLoginSession(data.verifyOtp);
        }
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    }
  };

  /* ─── LOGIN SCREEN ─── */
  if (authStage === "LOGIN") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 font-sans">
        <div className="absolute inset-0 bg-linear-to-br from-blue-50 via-slate-50 to-indigo-50 -z-10" />

        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>
          <span className="text-[17px] font-bold text-slate-800 tracking-tight">WorkSpace</span>
        </div>

        <div className="bg-white w-full max-w-md rounded-3xl px-10 py-10 shadow-xl shadow-slate-200/60 border border-slate-100">
          <h1 className="text-[26px] font-extrabold text-slate-900 mb-1 tracking-tight">Welcome back</h1>
          <p className="text-slate-400 text-sm mb-7">Sign in to continue your journey</p>

          {error && (
            <div className="bg-red-50 text-red-600 p-3.5 rounded-xl text-sm font-medium mb-5 border border-red-100 flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}
          {successMessage && (
            <div className="bg-emerald-50 text-emerald-700 p-3.5 rounded-xl text-sm font-medium mb-5 border border-emerald-100">
              {successMessage}
            </div>
          )}

          {/* Google button */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 border border-slate-200 rounded-full py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all mb-6 shadow-sm">
            <GoogleIcon />
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-xs text-slate-400">or sign in with email</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          <form onSubmit={handleFormSubmission} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">Email or Username</label>
              <input
                type="text"
                placeholder="you@example.com"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 py-3 px-4 rounded-xl outline-none text-slate-800 text-sm placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:ring-3 focus:ring-blue-100 transition-all"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-700">Password</label>
                <button type="button" className="text-xs text-blue-600 font-semibold hover:underline">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 py-3 px-4 pr-11 rounded-xl outline-none text-slate-800 text-sm placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:ring-3 focus:ring-blue-100 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                  <EyeIcon open={showPassword} />
                </button>
              </div>
            </div>

            {/* MFA delivery picker */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Send verification code via
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDeliveryMethod("EMAIL")}
                  className={`py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                    deliveryMethod === "EMAIL"
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300"
                  }`}>
                  Email
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryMethod("SMS")}
                  className={`py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                    deliveryMethod === "SMS"
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300"
                  }`}>
                  SMS
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white py-3.5 rounded-xl font-bold text-sm transition-all duration-200 mt-1 shadow-md shadow-blue-200">
              {loginLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Signing in...
                </span>
              ) : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-blue-600 font-bold hover:underline">
              Create one free
            </button>
          </p>
        </div>
      </div>
    );
  }

  /* ─── OTP SCREEN ─── */
  return (
    <div className="min-h-screen flex items-center justify-center p-6 font-sans">
      <div className="absolute inset-0 bg-linear-to-br from-blue-50 via-slate-50 to-indigo-50 -z-10" />

      <div className="bg-white w-full max-w-md rounded-3xl px-10 py-10 shadow-xl shadow-slate-200/60 border border-slate-100 text-center">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto mb-6">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
            <line x1="12" y1="18" x2="12.01" y2="18"/>
          </svg>
        </div>

        <h1 className="text-[22px] font-extrabold text-slate-900 mb-1">
          Check your {deliveryMethod === "EMAIL" ? "email" : "phone"}
        </h1>
        <p className="text-slate-400 text-sm mb-7">Enter the 6-digit code we sent you</p>

        {error && (
          <div className="bg-red-50 text-red-600 p-3.5 rounded-xl text-sm font-medium mb-5 border border-red-100">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="bg-emerald-50 text-emerald-700 p-3.5 rounded-xl text-sm font-medium mb-5 border border-emerald-100">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleFormSubmission} className="flex flex-col gap-4">
          <input
            type="text"
            maxLength={6}
            placeholder="000000"
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
            className="w-full bg-slate-50 border border-slate-200 py-4 text-center text-2xl tracking-[0.6em] font-extrabold rounded-xl outline-none text-blue-600 focus:border-blue-500 focus:ring-3 focus:ring-blue-100 transition-all"
            required
          />
          <button
            type="submit"
            disabled={otpLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white py-3.5 rounded-xl font-bold text-sm transition-all duration-200 shadow-md shadow-blue-200">
            {otpLoading ? "Verifying..." : "Verify & Sign In"}
          </button>
        </form>

        <button
          onClick={() => { setAuthStage("LOGIN"); setOtpCode(""); setError(""); }}
          className="text-sm text-blue-600 font-semibold hover:underline mt-6 inline-block">
          ← Back to Sign In
        </button>
      </div>
    </div>
  );
}

export default Login;
