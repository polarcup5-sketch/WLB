import { useEffect, useState } from "react";
import "./index.css";
import { supabase } from "./lib/supabaseClient";
import SharedEvents from "./components/SharedEvents";
import ThemeSelector from "./components/ThemeSelector";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [fatal, setFatal] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        if (!mounted) return;
        setFatal(error.message ?? String(error));
      } else {
        if (!mounted) return;
        setEmail(data.session?.user?.email ?? null);
      }
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    setFatal(null);
    const { error } = await supabase.auth.signInWithOAuth({ provider: "google" });
    if (error) setFatal(error.message);
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) setFatal(error.message);
    else setEmail(null);
  };

  return (
    <div className="app-root">
      <header className="app-header">
        <h1>Work Life Balancer</h1>
        <div className="header-controls">
        <ThemeSelector />

{loading ? null : email ? (
  <>
    <div className="small">Logged in as <b>{email}</b></div>
    <button className="btn" onClick={signOut}>Sign out</button>
  </>
) : (
  <button className="btn primary" onClick={signInWithGoogle}>Continue with Google</button>
)}
        </div>
      </header>

      <main className="app-main">
        {fatal && <div className="error">{fatal}</div>}
        {loading ? <div className="center">Loading…</div> : <SharedEvents />}
      </main>

      <footer className="app-footer">
        <small>Made with ❤ — shared calendar for you + your loved ones</small>
      </footer>
    </div>
  );
}
