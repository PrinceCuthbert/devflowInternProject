import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import axios from "axios";

export default function GitHubCallback() {
  const [searchParams] = useSearchParams();
  const { completeLoginSession } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const code = searchParams.get("code");

    if (!code) {
      navigate("/login?error=oauth_cancelled");
      return;
    }

    // Forward verification payload to Express REST route
    axios
      .post("http://localhost:5000/api/auth/github", { code })
      .then((res) => {
        // Log user in using your standard auth context handler
        completeLoginSession({
          token: res.data.token,
          user: {
            id: res.data.id,
            username: res.data.username,
            role: res.data.role,
          },
        });
        navigate("/dashboard");
      })
      .catch((err) => {
        console.error(err);
        navigate("/login?error=github_auth_failed");
      });
  }, [searchParams, completeLoginSession, navigate]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#F1F5F9",
        fontFamily: "Inter, sans-serif",
      }}>
      <div
        style={{
          background: "#FFFFFF",
          padding: "30px",
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          textAlign: "center",
        }}>
        <h3 style={{ margin: "0 0 4px", color: "#0F172A" }}>
          Securing Session
        </h3>
        <p style={{ margin: 0, color: "#64748B", fontSize: "14px" }}>
          Syncing your GitHub credentials...
        </p>
      </div>
    </div>
  );
}
