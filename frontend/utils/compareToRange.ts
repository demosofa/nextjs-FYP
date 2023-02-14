export default function compareToRange(
  n: number,
  min: number,
  max: number
): number {
  return (n <= min && min) || (n > min && n < max && n) || (n >= max && max);
}
