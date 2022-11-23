export default function timeAgo(time) {
  const diff = new Date(Date.now() - new Date(time).getTime());

  if (diff.getUTCDate() - 1 === 0) {
    if (diff.getUTCHours() > 1) return diff.getUTCHours() + " hours ago";
    if (diff.getUTCMinutes() > 1) return diff.getUTCMinutes() + " minutes ago";
    return diff.getUTCSeconds() + " seconds ago";
  }
  if (diff.getUTCDate() < 30) return diff.getUTCDate() + " days ago";
  return `${new Date(time).toLocaleString("en-us", { dateStyle: "full" })}`;
}
