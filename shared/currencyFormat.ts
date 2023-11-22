export default function currencyFormat(value: number | bigint): string {
	const formatter = new Intl.NumberFormat('vi-VN', {
		style: 'currency',
		currency: 'VND'
	});
	return formatter.format(value);
}
