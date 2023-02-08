type TimeObject = {
  milisecond: number;
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
  let milisecond = trueValue;
  const toSecond = 1000,
    toMinute = toSecond * 60,
    toHour = toMinute * 60,
    toDay = toHour * 24;
  if (unit.startsWith("s", 0)) milisecond = trueValue * toSecond;
  else if (unit.startsWith("m", 0)) milisecond = trueValue * toMinute;
  else if (unit.startsWith("h", 0)) milisecond = trueValue * toHour;
  else if (unit.startsWith("d", 0)) milisecond = trueValue * toDay;
  return {
    milisecond,
    second: Math.floor(
      (isCount ? milisecond % toMinute : milisecond) / toSecond
    ),
    minute: Math.floor((isCount ? milisecond % toHour : milisecond) / toMinute),
    hour: Math.floor((isCount ? milisecond % toDay : milisecond) / toHour),
    day: Math.floor(milisecond / toDay),
  };
}
