export default function isStringStartWith(str: string, arr: string[]): boolean {
  return arr.some((value) => str.startsWith(value));
}
