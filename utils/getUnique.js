export default function getUnique(arr = []) {
  let newArr = arr.map((obj) => JSON.stringify(obj));
  newArr = Array.from(new Set(newArr));
  return newArr.map((json) => JSON.parse(json));
}
