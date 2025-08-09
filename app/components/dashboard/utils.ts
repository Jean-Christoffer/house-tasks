export function formatDate(d: Date | string) {
  try {
    return new Date(d).toLocaleDateString("no-NO", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  } catch {
    return "";
  }
}
