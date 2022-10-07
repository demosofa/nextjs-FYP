export default function isStringStartWith(str, arr) {
  return arr.some((value) => str.startsWith(value));
}
