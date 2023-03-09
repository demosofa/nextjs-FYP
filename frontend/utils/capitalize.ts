export default function capitalize(value: string, atIndex: number = 0): string {
  return value[atIndex].toUpperCase() + value.slice(atIndex + 1);
}
