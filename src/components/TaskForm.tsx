import React, { useEffect, useState } from "react";

function toDatetimeLocalValue(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

function datetimeLocalToIso(local: string) {
  return new Date(local).toISOString();
}

export default function TaskForm({
  onAdd,
}: {
  onAdd: (title: string, type: string, start_time: string) => Promise<void> | void;
}) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"Work" | "Personal" | "Pet">("Work");
  const [startLocal, setStartLocal] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const d = new Date();
    d.setMinutes(Math.ceil(d.getMinutes() / 30) * 30, 0, 0);
    setStartLocal(toDatetimeLocalValue(d));
  }, []);

  const canAdd = title.trim().length > 0 && startLocal.length > 0 && !submitting;

  const doAdd = async () => {
    if (!canAdd) return;
    setSubmitting(true);
    try {
      await onAdd(title.trim(), type, datetimeLocalToIso(startLocal));
      setTitle("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="taskform">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Event title"
      />

      <select value={type} onChange={(e) => setType(e.target.value as any)}>
        <option value="Work">Work</option>
        <option value="Personal">Personal</option>
        <option value="Pet">Pet</option>
      </select>

      <input
        type="datetime-local"
        value={startLocal}
        onChange={(e) => setStartLocal(e.target.value)}
      />

      <button
        type="button"
        className={`btn small ${canAdd ? "" : "disabled"}`}
        onClick={doAdd}
        disabled={!canAdd}
      >
        {submitting ? "Adding…" : "Add"}
      </button>
    </div>
  );
}
