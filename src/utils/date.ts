export function isToday(iso: string): boolean {
  const d = new Date(iso);
  const now = new Date();

  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString([], {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function addMinutes(iso: string, minutes: number): string {
  const d = new Date(iso);
  return new Date(d.getTime() + minutes * 60_000).toISOString();
}