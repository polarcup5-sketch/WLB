export function toDatetimeLocalValue(d: Date) {
    const pad = (n: number) => String(n).padStart(2, "0");
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const min = pad(d.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
  }
  
  export function datetimeLocalToIso(local: string) {
    // "YYYY-MM-DDTHH:mm" interpreted in user's local timezone
    const d = new Date(local);
    return d.toISOString();
  }
  