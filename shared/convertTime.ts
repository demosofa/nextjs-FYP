type TimeObject = {
  millisecond: number;
  second: number;
  minute: number;
  hour: number;
  day: number;
};

export default function convertTime(
  value: any,
  isCount: boolean = false
): TimeObject {
  let time = value instanceof String ? value : String(value);
  const unit = time.replace(/^[\s\d]+/, "").toLowerCase();
  const trueValue = parseInt(time.replace(unit, "").trim());
  let millisecond = trueValue;
  const toSecond = 1000,
    toMinute = toSecond * 60,
    toHour = toMinute * 60,
    toDay = toHour * 24;
  if (unit.startsWith("s", 0)) millisecond = trueValue * toSecond;
  else if (unit.startsWith("m", 0)) millisecond = trueValue * toMinute;
  else if (unit.startsWith("h", 0)) millisecond = trueValue * toHour;
  else if (unit.startsWith("d", 0)) millisecond = trueValue * toDay;
  return {
    millisecond,
    second: Math.floor(
      (isCount ? millisecond % toMinute : millisecond) / toSecond
    ),
    minute: Math.floor(
      (isCount ? millisecond % toHour : millisecond) / toMinute
    ),
    hour: Math.floor((isCount ? millisecond % toDay : millisecond) / toHour),
    day: Math.floor(millisecond / toDay),
  };
}
