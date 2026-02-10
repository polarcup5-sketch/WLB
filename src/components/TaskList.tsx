import React from "react";
import { EventRow } from "./SharedEvents";

export default function TaskList({ events, onToggleComplete, reload }: {
  events: EventRow[];
  onToggleComplete: (id: string, completed: boolean) => Promise<void>;
  reload: () => void;
}) {
  return (
    <div className="task-list">
      {events.length === 0 ? (
        <div className="center muted">No events</div>
      ) : (
        <ul>
          {events.map((e) => (
            <li key={e.id} className={`task-row ${e.completed ? "done" : ""}`}>
              <div className="left">
                <input
                  type="checkbox"
                  checked={!!e.completed}
                  onChange={() => onToggleComplete(e.id, !e.completed)}
                />
              </div>
              <div className="main">
                <div className="title">{e.title}</div>
                <div className="meta">{e.type ?? "—"} • {e.start_time ? new Date(e.start_time).toLocaleString() : "No time"}</div>
              </div>
              <div className="actions">
                <button className="btn tiny" onClick={() => {
                  // quick edit: toggle completed and then reload
                  onToggleComplete(e.id, !e.completed);
                }}>Toggle</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
