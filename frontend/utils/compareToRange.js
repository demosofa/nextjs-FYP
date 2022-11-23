export default function compareToRange(n, min, max) {
  return (n <= min && min) || (n > min && n < max && n) || (n >= max && max);
}
