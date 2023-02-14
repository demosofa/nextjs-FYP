export default function getURL(string: string): string {
  return (
    (string.includes("/:") && string.split("/:")[0]) ||
    (string.includes("?") && string.split("?")[0]) ||
    string
  );
}
