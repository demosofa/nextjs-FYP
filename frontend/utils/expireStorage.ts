import convertTime from "../../shared/convertTime";
import getUnique from "./getUnique";

type ExpireData = {
  payload: any;
  expire: string;
};

export default class expireStorage {
  static setItem(key: string, value: any, expire?: string): void {
    let newValue: ExpireData;
    let exist = this.getItem(key);
    if (exist) {
      let isUnique = getUnique([exist, value], true);
      if (!isUnique) return;
    }
    if (expire)
      newValue = {
        payload: value,
        expire: new Date(
          Date.now() + convertTime(expire).milisecond
        ).toISOString(),
      };
    else newValue = value;
    localStorage.setItem(key, JSON.stringify(newValue));
  }
  static getItem(key: string): any {
    let data: ExpireData = JSON.parse(localStorage.getItem(key));
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
