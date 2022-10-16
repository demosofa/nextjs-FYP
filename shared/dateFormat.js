import { format } from "date-fns";

export default function dateFormat(date, includeTime = false) {
  date = format(new Date(date), "dd/MM/yyyy hh:mm aaaaa'm'");
  return includeTime ? date : date.split(" ")[0];
}
