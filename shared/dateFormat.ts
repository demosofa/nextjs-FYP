import { format } from 'date-fns';

export default function dateFormat(
	date: string | number | Date,
	includeTime = false
): string {
	date = format(date, "dd/MM/yyyy hh:mm aaaaa'm'");
	return includeTime ? date : date.split(' ')[0];
}
