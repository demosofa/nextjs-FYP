import convertTime from "../shared/convertTime";
import getUnique from "./getUnique";

export default class expireStorage {
  static setItem(key, value, expire = "") {
    let newValue;
    let exist = this.getItem(key);
    if (exist) {
      let isUnique = getUnique([exist, value], true);
      if (!isUnique) return;
    }
    if (expire)
      newValue = {
        payload: value,
        expire: new Date(Date.now() + convertTime(expire).milisecond),
      };
    else newValue = value;
    localStorage.setItem(key, JSON.stringify(newValue));
  }
  static getItem(key) {
    let data = JSON.parse(localStorage.getItem(key));
    if (data) {
      if (data.expire) {
        if (Date.now() >= new Date(data.expire).getTime()) {
          localStorage.removeItem(key);
          return null;
        }
        return data.payload;
      }
      return data;
    }
    return undefined;
  }
}
