export default function sortObject(obj: object): object {
	let sorted: object;
	let str: string[];
	let key: PropertyKey;

	for (key in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, key)) {
			str.push(encodeURIComponent(key));
		}
	}

	str.sort();
	for (key = 0; key < str.length; key++) {
		sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
	}
	return sorted;
}
