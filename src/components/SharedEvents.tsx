import React, { useEffect, useMemo, useState } from "react";
import TaskForm from "./TaskForm";
import { supabase } from "../lib/supabaseClient";

type ViewMode = "today" | "all" | "completed";
type TypeFilter = "All" | "Work" | "Personal" | "Pet";

export type EventRow = {
  id: string;
  user_id: string;
  title: string;
  start_time: string;
  created_at: string;
  calendar_id: string | null;
  completed: boolean;
  type: string;
};

function isSameLocalDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default function SharedEvents() {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(false);

  const [view, setView] = useState<ViewMode>("today");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("All");

  async function getUserId(): Promise<string | null> {
    const { data, error } = await supabase.auth.getUser();
    if (error) return null;
    return data.user?.id ?? null;
  }

  async function loadEvents() {
    setLoading(true);
    try {
      const uid = await getUserId();
      if (!uid) {
        setEvents([]);
        return;
      }

      const { data, error } = await supabase
        .from("events")
        .select("id,user_id,title,start_time,created_at,calendar_id,completed,type")
        .eq("user_id", uid)
        .order("start_time", { ascending: true });

      if (error) throw error;
      setEvents((data ?? []) as EventRow[]);
    } catch (e) {
      console.error("loadEvents failed:", e);
    } finally {
      setLoading(false);
    }
  }

  async function addEvent(title: string, type: string, start_time: string) {
    const uid = await getUserId();
    if (!uid) {
      alert("You must be logged in to add events.");
      return;
    }

    const { data: inserted, error } = await supabase
      .from("events")
      .insert({
        user_id: uid,
        title,
        type,
        start_time,
        completed: false,
      })
      .select("id,user_id,title,start_time,created_at,calendar_id,completed,type")
      .single();

    if (error) {
      alert(error.message);
      return;
    }

    setEvents((prev) => {
      const next = [...prev, inserted as EventRow];
      next.sort((a, b) => (a.start_time > b.start_time ? 1 : -1));
      return next;
    });
  }

  async function toggleCompleted(id: string, nextCompleted: boolean) {
    const { error } = await supabase.from("events").update({ completed: nextCompleted }).eq("id", id);
    if (error) {
      alert(error.message);
      return;
    }
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, completed: nextCompleted } : e)));
  }

  useEffect(() => {
    loadEvents();
  }, []);

  const filtered = useMemo(() => {
    const now = new Date();
    return events.filter((e) => {
      const dt = new Date(e.start_time);
      if (view === "today" && !isSameLocalDay(dt, now)) return false;
      if (view === "completed" && !e.completed) return false;
      if (typeFilter !== "All" && e.type !== typeFilter) return false;
      return true;
    });
  }, [events, view, typeFilter]);

  return (
    <div className="wlbPage">
      <div className="wlbLayout">
        <aside className="wlbSidebar">
          <section className="wlbCard">
            <div className="wlbCardTitle">Views</div>
            <div className="wlbRow">
              <button className={`wlbPill ${view === "today" ? "active" : ""}`} onClick={() => setView("today")}>Today</button>
              <button className={`wlbPill ${view === "all" ? "active" : ""}`} onClick={() => setView("all")}>All</button>
              <button className={`wlbPill ${view === "completed" ? "active" : ""}`} onClick={() => setView("completed")}>Completed</button>
            </div>
          </section>

          <section className="wlbCard">
            <div className="wlbCardTitle">Event types</div>
            <div className="wlbCol">
              {(["All", "Work", "Personal", "Pet"] as TypeFilter[]).map((t) => (
                <button
                  key={t}
                  className={`wlbTypeBtn ${typeFilter === t ? "active" : ""}`}
                  onClick={() => setTypeFilter(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </section>
        </aside>

        <main className="wlbMain">
          <div className="wlbHeader">
            <div className="wlbTitle">Shared Calendar</div>
          </div>

          <section className="wlbCard">
            <div className="wlbCardTitle">Quick add</div>
            <TaskForm onAdd={addEvent} />
          </section>

          <section className="wlbCard">
            <div className="wlbCardTitle">Events {loading ? "(Loading…)" : ""}</div>

            {!loading && filtered.length === 0 ? (
              <div className="wlbEmpty">No events</div>
            ) : (
              <ul className="wlbList">
                {filtered.map((e) => (
                  <li key={e.id} className="wlbListItem">
                    <label className="wlbCheckRow">
                      <input
                        type="checkbox"
                        checked={!!e.completed}
                        onChange={(ev) => toggleCompleted(e.id, ev.target.checked)}
                      />
                      <span className={`wlbEventTitle ${e.completed ? "done" : ""}`}>
                        {e.title}
                      </span>
                    </label>

                    <div className="wlbMeta">
                      <span className="wlbTag">{e.type}</span>
                      <span className="wlbDate">{new Date(e.start_time).toLocaleString()}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
