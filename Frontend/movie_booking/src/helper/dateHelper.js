function extractTime(date) {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const amPm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  const formattedMinutes = String(minutes).padStart(2, "0");
  return `${hours}:${formattedMinutes}${amPm}`;
}
function extractDayMonth(date) {
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" });

  // Adding the appropriate suffix (st, nd, rd, th) to the day
  const daySuffix = (day) => {
    if (day > 3 && day < 21) return "th"; // Covers 11th to 20th
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  return `${day}${daySuffix(day)} ${month}`;
}

export function formatDateTime(dateTimeString) {
  const date = new Date(dateTimeString);
  const dayMonth = extractDayMonth(date);
  const timeOfDay = extractTime(date);
  return dayMonth + ", " + timeOfDay;
}
