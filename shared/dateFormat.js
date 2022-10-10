export default function dateFormat(date) {
  return new Date(date)
    .toISOString()
    .toLocaleString("en-US", {
      timeZone: "Asia/Ho_Chi_Minh",
    })
    .split("T")[0];
}
