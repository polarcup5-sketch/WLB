import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "./supabaseClient";

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [sessionLoaded, setSessionLoaded] = useState(false);
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (!mounted) return;

      if (error) setStatus(`Auth error: ${error.message}`);
      setSession(data.session);
      setSessionLoaded(true);
    };

    init();

    const { data } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setSessionLoaded(true);
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    setStatus("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        // Works automatically on both localhost and Vercel
        redirectTo: window.location.origin,
      },
    });

    if (error) setStatus(`Auth error: ${error.message}`);
  };

  const signOut = async () => {
    setStatus("");
    const { error } = await supabase.auth.signOut();
    if (error) setStatus(`Auth error: ${error.message}`);
  };

  if (!sessionLoaded) {
    return <div style={{ padding: 24 }}>Loading…</div>;
  }

  // --- LOGIN (GOOGLE ONLY) ---
  if (!session?.user) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 24,
          background: "linear-gradient(180deg, #e9e4ff, #f7f6ff)",
        }}
      >
        <div
          style={{
            width: 420,
            maxWidth: "100%",
            background: "#fff",
            padding: 24,
            borderRadius: 18,
            boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
            textAlign: "center",
          }}
        >
          <h1 style={{ margin: 0, fontSize: 32 }}>Work Life Balancer</h1>
          <p style={{ marginTop: 10, color: "#555", lineHeight: 1.4 }}>
            Sign in with Google to use your shared lists.
          </p>

          <button
            onClick={signInWithGoogle}
            style={{
              marginTop: 14,
              width: "100%",
              padding: "14px 16px",
              borderRadius: 12,
              border: "1px solid rgba(0,0,0,0.12)",
              fontWeight: 800,
              cursor: "pointer",
              background: "#fff",
            }}
          >
            Continue with Google
          </button>

          {status && (
            <div style={{ marginTop: 14, color: "#c00", fontWeight: 600 }}>
              {status}
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- LOGGED IN: KEEP YOUR EXISTING APP UI BELOW ---
  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          marginBottom: 24,
        }}
      >
        <h2 style={{ margin: 0 }}>Work Life Balancer</h2>
        <button onClick={signOut} style={{ padding: "10px 12px" }}>
          Sign out
        </button>
      </div>

      {/* If your existing WLB app UI is in other components, render them here.
          Replace the placeholder below with your original components (lists/tasks/calendar). */}
      <div style={{ color: "#444" }}>
        Logged in as <strong>{session.user.email}</strong>
      </div>

      {/* Example: <Dashboard /> or <Home /> */}
    </div>
  );
}

