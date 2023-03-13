const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/**
 * return string about time ago which includes date based on parameters
 * @param {string | number | Date} date
 * @param {string | boolean} preformattedDate
 * @param {boolean} hideYear
 * @returns {string}
 */
function getFormattedDate(date, preformattedDate = false, hideYear = false) {
  let day = date.getDate();
  const month = MONTH_NAMES[date.getMonth()];
  const year = date.getFullYear();
  let hours = date.getHours();
  let minutes = date.getMinutes();

  if (minutes < 10) minutes = `0${minutes}`;
  if (hours < 10) hours = `0${hours}`;
  if (day < 10) day = `0${day}`;

  if (preformattedDate) {
    // Today at 10:20
    // Yesterday at 10:20
    return `${preformattedDate} at ${hours}:${minutes}`;
  }

  if (hideYear) {
    // 10. January at 10:20
    return `from ${day}, ${month} at ${hours}:${minutes}`;
  }

  // 10. January 2017. at 10:20
  return `from ${day}, ${month} ${year} at ${hours}:${minutes}`;
}

/**
 * return string about time ago based on dateParam
 * @param {string | number | Date} dateParam
 * @returns {string}
 */
// --- Main function
export default function timeAgo(dateParam) {
  if (!dateParam) {
    return null;
  }

  const date = typeof dateParam === "object" ? dateParam : new Date(dateParam);
  const DAY_IN_MS = 86400000; // 24 * 60 * 60 * 1000
  const today = new Date();
  const yesterday = new Date(today - DAY_IN_MS);
  const seconds = Math.round((today - date) / 1000);
  const minutes = Math.round(seconds / 60);
  const isToday = today.toDateString() === date.toDateString();
  const isYesterday = yesterday.toDateString() === date.toDateString();
  const isThisYear = today.getFullYear() === date.getFullYear();

  if (seconds < 5) {
    return "now";
  } else if (seconds < 60) {
    return `${seconds} seconds ago`;
  } else if (seconds < 90) {
    return "about a minute ago";
  } else if (minutes < 60) {
    return `${minutes} minutes ago`;
  } else if (isToday) {
    return getFormattedDate(date, "Today"); // Today at 10:20
  } else if (isYesterday) {
    return getFormattedDate(date, "Yesterday"); // Yesterday at 10:20
  } else if (isThisYear) {
    return getFormattedDate(date, false, true); // 10. January at 10:20
  }

  return getFormattedDate(date); // 10. January 2017. at 10:20
}
