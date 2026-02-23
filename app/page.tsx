"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setLoading(false);
      } else {
        router.push("/");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (loading) {
    return (
      <main className="loading-root">
        <div className="loading-spinner" aria-label="Loading" />
        <style jsx>{`
          .loading-root {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #0a0a0f;
          }
          .loading-spinner {
            width: 36px;
            height: 36px;
            border: 3px solid rgba(192,132,252,0.2);
            border-top-color: #c084fc;
            border-radius: 50%;
            animation: spin 0.7s linear infinite;
          }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </main>
    );
  }

  const displayName = user?.displayName || "User";
  const email = user?.email ?? "";

  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <main className="home-root">
      <div className="home-bg" aria-hidden>
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="grid-overlay" />
      </div>

      <div className="home-card">
        <div className="avatar">{initials}</div>

        <h1 className="greeting">
          Hey, <span className="name">{displayName}</span>!
        </h1>
        <p className="subtext">You&apos;re successfully logged in.</p>

        <div className="divider" />

        <div className="detail-row">
          <span className="detail-label">Email</span>
          <span className="detail-value">{email}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">User ID</span>
          <span className="detail-value detail-mono">{user?.uid}</span>
        </div>

        <button onClick={handleLogout} className="logout-btn">
          Sign Out
        </button>
      </div>

      <style jsx>{`
        .home-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0a0a0f;
          position: relative;
          overflow: hidden;
          font-family: 'Georgia', 'Times New Roman', serif;
        }
        .home-bg {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }
        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.15;
          animation: drift 14s ease-in-out infinite alternate;
        }
        .blob-1 {
          width: 500px; height: 500px;
          background: #7c3aed;
          top: -100px; right: -100px;
        }
        .blob-2 {
          width: 400px; height: 400px;
          background: #60a5fa;
          bottom: -80px; left: -80px;
          animation-duration: 18s;
        }
        @keyframes drift {
          from { transform: translate(0, 0) scale(1); }
          to   { transform: translate(30px, -20px) scale(1.06); }
        }
        .grid-overlay {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 48px 48px;
        }

        .home-card {
          position: relative;
          z-index: 1;
          width: min(460px, calc(100vw - 32px));
          background: rgba(15, 15, 25, 0.85);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 48px 40px 36px;
          backdrop-filter: blur(24px);
          box-shadow:
            0 0 0 1px rgba(192,132,252,0.08),
            0 32px 80px rgba(0,0,0,0.6),
            inset 0 1px 0 rgba(255,255,255,0.06);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .avatar {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: 700;
          color: #fff;
          letter-spacing: 0.05em;
          margin-bottom: 24px;
          box-shadow: 0 4px 24px rgba(124,58,237,0.45);
        }

        .greeting {
          font-size: 26px;
          font-weight: 700;
          color: #f1f5f9;
          margin-bottom: 8px;
          line-height: 1.3;
        }
        .name {
          background: linear-gradient(135deg, #e2e8f0 0%, #c084fc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .subtext {
          font-size: 14px;
          color: rgba(255,255,255,0.4);
          letter-spacing: 0.04em;
        }

        .divider {
          width: 100%;
          height: 1px;
          background: rgba(255,255,255,0.07);
          margin: 28px 0 20px;
        }

        .detail-row {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 14px;
          gap: 12px;
        }
        .detail-label {
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          flex-shrink: 0;
          padding-top: 2px;
        }
        .detail-value {
          font-size: 13px;
          color: #cbd5e1;
          text-align: right;
          word-break: break-all;
        }
        .detail-mono {
          font-family: 'Courier New', monospace;
          font-size: 11px;
          color: rgba(255,255,255,0.4);
        }

        .logout-btn {
          margin-top: 24px;
          width: 100%;
          padding: 12px;
          border: 1px solid rgba(239,68,68,0.25);
          border-radius: 10px;
          background: rgba(239,68,68,0.08);
          color: #fca5a5;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.06em;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'Georgia', serif;
        }
        .logout-btn:hover {
          background: rgba(239,68,68,0.15);
          border-color: rgba(239,68,68,0.4);
          transform: translateY(-1px);
        }
      `}</style>
    </main>
  );
}