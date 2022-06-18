export default function getUnique(arr = [], check = false) {
  let newArr = arr.map((obj) => JSON.stringify(obj));
  newArr = Array.from(new Set(newArr));
  return check
    ? arr.length === newArr.length
    : newArr.map((json) => JSON.parse(json));
}
