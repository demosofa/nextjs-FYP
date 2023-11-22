import convertTime from '@shared/convertTime';

import getUnique from './getUnique';

type ExpireData = {
	payload: unknown;
	expire: string;
};

export default class expireStorage {
	static setItem(key: string, value: unknown, expire?: string): void {
		let newValue: ExpireData | unknown;
		const exist = this.getItem(key);
		if (exist) {
			const isUnique = getUnique([exist, value], true);
			if (!isUnique) return;
		}
		if (expire)
			newValue = {
				payload: value,
				expire: new Date(
					Date.now() + convertTime(expire).millisecond
				).toISOString()
			};
		else newValue = value;
		localStorage.setItem(key, JSON.stringify(newValue));
	}
	static getItem(key: string): unknown {
		const data: ExpireData | unknown = JSON.parse(localStorage.getItem(key));
		if (data) {
			if (
				typeof data == 'object' &&
				Object.prototype.hasOwnProperty.call(data, 'expire')
			) {
				const { expire, payload } = data as ExpireData;
				if (Date.now() >= new Date(expire).getTime()) {
					localStorage.removeItem(key);
					return null;
				}
				return payload;
			}
			return data;
		}
		return undefined;
	}
}
