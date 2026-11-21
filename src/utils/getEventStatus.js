const getDateKey = (value) => {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  if (typeof value !== "string") return null;
  return value.match(/^\d{4}-\d{2}-\d{2}/)?.[0] || null;
};

export const getEventStatus = (event) => {
  const startDate =
    getDateKey(event.status_start_date) ||
    getDateKey(event.start_date) ||
    getDateKey(event.date) ||
    getDateKey(event.status_event_date) ||
    getDateKey(event.event_date);
  const endDate = getDateKey(event.status_end_date) || getDateKey(event.end_date) || startDate;

  if (!startDate || !endDate) return "Unknown";

  const today = new Date();
  const todayKey = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  if (todayKey < startDate) return "Upcoming";
  if (todayKey > endDate) return "Ended";
  return "Ongoing";
};
