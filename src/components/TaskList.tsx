import React from "react";
import type { Task } from "../types";
import { formatDateTime } from "../utils/date";

function badgeColor(cat: Task["category"]) {
  if (cat === "work") return "var(--badgeWork)";
  if (cat === "life") return "var(--badgeLife)";
  return "var(--badgePet)";
}

export function TaskList(props: {
  tasks: Task[];
  onToggle: (id: string) => void;
  onSnooze15: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div style={{ display: "grid", gap: 14 }}>
      {props.tasks.map((t) => (
        <div
          key={t.id}
          style={{
            background: "rgba(255,255,255,0.92)",
            border: "1px solid var(--border)",
            borderRadius: 18,
            padding: 14,
            boxShadow: "0 10px 28px rgba(15,23,42,0.06)",
            opacity: t.completed ? 0.62 : 1,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontWeight: 950,
                  fontSize: 16,
                  letterSpacing: -0.2,
                  textDecoration: t.completed ? "line-through" : "none",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {t.title}
              </div>
              <div style={{ marginTop: 6, color: "var(--muted)", fontSize: 12, fontWeight: 700 }}>
                {formatDateTime(t.dueAt)}
              </div>
            </div>

            <div
              style={{
                padding: "6px 10px",
                borderRadius: 999,
                background: badgeColor(t.category),
                border: "1px solid var(--border)",
                fontWeight: 900,
                fontSize: 12,
                color: "var(--ink)",
                flex: "0 0 auto",
                height: "fit-content",
              }}
            >
              {t.category.toUpperCase()}
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
            <MotionButton onClick={() => props.onToggle(t.id)} kind="soft">
              {t.completed ? "Undo" : "Done"}
            </MotionButton>

            <MotionButton
              onClick={() => props.onSnooze15(t.id)}
              kind="soft"
              disabled={t.completed}
            >
              Snooze +15
            </MotionButton>

            <MotionButton onClick={() => props.onDelete(t.id)} kind="danger">
              Delete
            </MotionButton>
          </div>
        </div>
      ))}
    </div>
  );
}

function MotionButton(props: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  kind: "soft" | "danger";
}) {
  const [hover, setHover] = React.useState(false);
  const [down, setDown] = React.useState(false);

  const base: React.CSSProperties =
    props.kind === "danger"
      ? {
          background: "linear-gradient(135deg, var(--danger1), var(--danger2))",
          color: "white",
          border: "none",
          boxShadow: "0 10px 22px rgba(185,28,28,0.18)",
        }
      : {
          background: "rgba(248,250,252,0.9)",
          color: "var(--ink)",
          border: "1px solid var(--border)",
          boxShadow: hover ? "0 10px 22px rgba(15,23,42,0.08)" : "none",
        };

  const style: React.CSSProperties = {
    padding: "10px 14px",
    borderRadius: 14,
    fontWeight: 900,
    cursor: props.disabled ? "not-allowed" : "pointer",
    opacity: props.disabled ? 0.55 : 1,
    transform: down ? "translateY(1px) scale(0.99)" : hover ? "translateY(-1px)" : "none",
    transition: "transform 140ms ease, box-shadow 140ms ease, filter 140ms ease",
    filter: hover ? "saturate(1.05)" : "none",
    ...base,
  };

  return (
    <button
      disabled={props.disabled}
      onClick={props.onClick}
      style={style}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false);
        setDown(false);
      }}
      onMouseDown={() => setDown(true)}
      onMouseUp={() => setDown(false)}
    >
      {props.children}
    </button>
  );
}
