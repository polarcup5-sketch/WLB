import React, { useMemo, useState } from "react";
import type { Category, Task } from "../types";

function uid(): string {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

export function TaskForm(props: { onCreate: (task: Task) => void }) {
  const now = useMemo(() => new Date(), []);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Category>("work");
  const [dueLocal, setDueLocal] = useState(() => {
    const d = new Date(now.getTime() + 60 * 60_000);
    return toLocalDateTimeValue(d);
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const clean = title.trim();
    if (!clean) return;

    const task: Task = {
      id: uid(),
      title: clean,
      category,
      dueAt: new Date(dueLocal).toISOString(),
      completed: false,
      createdAt: new Date().toISOString(),
    };

    props.onCreate(task);
    setTitle("");
  }

  return (
    <form onSubmit={submit} style={styles.card}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What do you need to do?"
        style={styles.input}
      />

      <div style={styles.row}>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
          style={styles.select}
        >
          <option value="work">Work</option>
          <option value="life">Life</option>
          <option value="pet">Pet</option>
        </select>

        <input
          type="datetime-local"
          value={dueLocal}
          onChange={(e) => setDueLocal(e.target.value)}
          style={styles.dt}
        />

        <button type="submit" style={styles.addBtn}>
          + Add
        </button>
      </div>
    </form>
  );
}

function toLocalDateTimeValue(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(
    d.getHours()
  )}:${p(d.getMinutes())}`;
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    background: "#ffffff",
    borderRadius: 16,
    padding: 14,
    display: "grid",
    gap: 10,
  },
  input: {
    padding: 12,
    borderRadius: 12,
    border: "1px solid #e5e7eb",
    fontSize: 14,
  },
  row: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
  },
  select: {
    padding: 10,
    borderRadius: 12,
    border: "1px solid #e5e7eb",
  },
  dt: {
    padding: 10,
    borderRadius: 12,
    border: "1px solid #e5e7eb",
  },
  addBtn: {
    padding: "10px 14px",
    borderRadius: 12,
    border: "none",
    background: "var(--card)",
    color: "white",
    fontWeight: 800,
    cursor: "pointer",
  },
};
