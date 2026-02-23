"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { useRouter } from "next/navigation";

type Mode = "login" | "register";

const ERROR_MESSAGES: Record<string, string> = {
  "auth/email-already-in-use": "An account with this email already exists.",
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/weak-password": "Password must be at least 6 characters.",
  "auth/wrong-password": "Incorrect password. Please try again.",
  "auth/user-not-found": "No account found with this email.",
  "auth/invalid-credential": "Invalid email or password.",
  "auth/too-many-requests": "Too many attempts. Please try again later.",
  "auth/network-request-failed": "Network error. Check your connection.",
};

function getErrorMessage(code: string): string {
  return ERROR_MESSAGES[code] ?? "Something went wrong. Please try again.";
}

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validate = () => {
    if (mode === "register" && !fullName.trim()) {
      setError("Full name is required.");
      return false;
    }
    if (!email.trim()) {
      setError("Email address is required.");
      return false;
    }
    if (!password) {
      setError("Password is required.");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!validate()) return;

    setLoading(true);
    try {
      if (mode === "register") {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(credential.user, { displayName: fullName.trim() });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      router.push("/home");
    } catch (err: any) {
      setError(getErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (next: Mode) => {
    setMode(next);
    setError("");
    setFullName("");
    setEmail("");
    setPassword("");
  };

  return (
    <main className="auth-root">
      <div className="auth-bg" aria-hidden>
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
        <div className="grid-overlay" />
      </div>

      <div className="auth-card">
        <div className="card-header">
          <div className="wordmark">BABYLON</div>
          <p className="tagline">Secure authentication portal</p>
        </div>

        <div className="tab-row">
          <button
            type="button"
            className={`tab ${mode === "login" ? "tab--active" : ""}`}
            onClick={() => switchMode("login")}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`tab ${mode === "register" ? "tab--active" : ""}`}
            onClick={() => switchMode("register")}
          >
            Create Account
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="auth-form">
          {mode === "register" && (
            <div className="field">
              <label htmlFor="fullName">Full Name</label>
              <input
                id="fullName"
                type="text"
                placeholder="Ada Lovelace"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoComplete="name"
              />
            </div>
          )}

          <div className="field">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="ada@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Min. 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === "register" ? "new-password" : "current-password"}
            />
          </div>

          {error && (
            <div className="error-box" role="alert">
              <span className="error-icon">!</span>
              {error}
            </div>
          )}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? (
              <span className="spinner" aria-label="Loading" />
            ) : mode === "login" ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <p className="switch-hint">
          {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            className="switch-link"
            onClick={() => switchMode(mode === "login" ? "register" : "login")}
          >
            {mode === "login" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>

      <style jsx>{`
        .auth-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0a0a0f;
          position: relative;
          overflow: hidden;
          font-family: 'Georgia', 'Times New Roman', serif;
        }

        /* ── Animated background ── */
        .auth-bg {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }
        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.18;
          animation: drift 14s ease-in-out infinite alternate;
        }
        .blob-1 {
          width: 500px; height: 500px;
          background: #c084fc;
          top: -120px; left: -100px;
          animation-duration: 16s;
        }
        .blob-2 {
          width: 400px; height: 400px;
          background: #60a5fa;
          bottom: -80px; right: -80px;
          animation-duration: 12s;
          animation-delay: -4s;
        }
        .blob-3 {
          width: 300px; height: 300px;
          background: #f472b6;
          top: 50%; left: 55%;
          animation-duration: 18s;
          animation-delay: -8s;
        }
        @keyframes drift {
          from { transform: translate(0, 0) scale(1); }
          to   { transform: translate(40px, -30px) scale(1.08); }
        }
        .grid-overlay {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 48px 48px;
        }

        /* ── Card ── */
        .auth-card {
          position: relative;
          z-index: 1;
          width: min(440px, calc(100vw - 32px));
          background: rgba(15, 15, 25, 0.85);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 40px 36px 32px;
          backdrop-filter: blur(24px);
          box-shadow:
            0 0 0 1px rgba(192,132,252,0.08),
            0 32px 80px rgba(0,0,0,0.6),
            inset 0 1px 0 rgba(255,255,255,0.06);
        }

        /* ── Header ── */
        .card-header {
          text-align: center;
          margin-bottom: 28px;
        }
        .wordmark {
          font-size: 28px;
          font-weight: 700;
          letter-spacing: 0.25em;
          color: #fff;
          font-family: 'Georgia', serif;
          background: linear-gradient(135deg, #e2e8f0 0%, #c084fc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .tagline {
          margin-top: 6px;
          font-size: 12px;
          letter-spacing: 0.12em;
          color: rgba(255,255,255,0.35);
          text-transform: uppercase;
          font-family: 'Georgia', serif;
        }

        /* ── Tabs ── */
        .tab-row {
          display: flex;
          gap: 0;
          background: rgba(255,255,255,0.04);
          border-radius: 10px;
          padding: 3px;
          margin-bottom: 28px;
        }
        .tab {
          flex: 1;
          padding: 9px 0;
          border: none;
          background: transparent;
          color: rgba(255,255,255,0.4);
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.04em;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'Georgia', serif;
        }
        .tab--active {
          background: rgba(192,132,252,0.15);
          color: #e2d9f3;
          box-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }
        .tab:hover:not(.tab--active) {
          color: rgba(255,255,255,0.65);
        }

        /* ── Form ── */
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        label {
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.06em;
          color: rgba(255,255,255,0.5);
          text-transform: uppercase;
          font-family: 'Georgia', serif;
        }
        input {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 11px 14px;
          color: #f1f5f9;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
          font-family: 'Georgia', serif;
        }
        input::placeholder {
          color: rgba(255,255,255,0.2);
        }
        input:focus {
          border-color: rgba(192,132,252,0.5);
          background: rgba(192,132,252,0.06);
        }

        /* ── Error ── */
        .error-box {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.25);
          border-radius: 8px;
          padding: 10px 12px;
          color: #fca5a5;
          font-size: 13px;
          font-family: 'Georgia', serif;
        }
        .error-icon {
          flex-shrink: 0;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: rgba(239,68,68,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 700;
          color: #f87171;
          line-height: 18px;
          text-align: center;
        }

        /* ── Submit ── */
        .submit-btn {
          margin-top: 4px;
          padding: 12px;
          border: none;
          border-radius: 10px;
          background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
          color: #fff;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.06em;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.15s;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 44px;
          font-family: 'Georgia', serif;
          box-shadow: 0 4px 20px rgba(124,58,237,0.35);
        }
        .submit-btn:hover:not(:disabled) {
          opacity: 0.9;
          transform: translateY(-1px);
        }
        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* ── Spinner ── */
        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          display: inline-block;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* ── Switch hint ── */
        .switch-hint {
          margin-top: 20px;
          text-align: center;
          font-size: 13px;
          color: rgba(255,255,255,0.35);
          font-family: 'Georgia', serif;
        }
        .switch-link {
          background: none;
          border: none;
          color: #c084fc;
          font-size: 13px;
          cursor: pointer;
          text-decoration: underline;
          font-family: 'Georgia', serif;
          transition: color 0.15s;
        }
        .switch-link:hover {
          color: #d8b4fe;
        }
      `}</style>
    </main>
  );
}