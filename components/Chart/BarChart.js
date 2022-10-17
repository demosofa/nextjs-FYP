import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import styles from "./Chart.module.css";

export default function BarChart({ datas, row = null }) {
  const [widthCol, setWidthCol] = useState(0);
  const [heightForCalc, setHeightForCalc] = useState(0);
  const refRow = useRef(0);

  const calcInterval = () => {
    const arrayData = datas.map((data) => data.value);
    let maxValue = Math.max(...arrayData),
      minValue = Math.min(...arrayData);
    let interval = (maxValue - minValue) / 5;
    let decimalInterval = parseFloat("0." + interval);
    let unitInterval = Math.floor(interval / decimalInterval / 10);
    decimalInterval = parseFloat((decimalInterval + 0.0044).toFixed(1));
    interval = decimalInterval * unitInterval * 10;
    return [maxValue, interval];
  };

  const createCell = (maxValue, interval) => {
    let cellArr = [];
    for (let i = 0; i <= maxValue; i += interval) {
      cellArr.push(i);
      if (i + interval > maxValue) cellArr.push(i + interval);
    }
    return cellArr;
  };

  const Cells = useMemo(() => {
    let [maxValue, interval] = calcInterval();
    let cellArr = createCell(maxValue, interval);
    if (row && (cellArr.pop() - cellArr[1]) % (row - 2) === 0) {
      interval = (cellArr.pop() - cellArr[1]) / (row - 2);
      maxValue = cellArr.pop();
      cellArr = createCell(maxValue, interval);
    }
    return cellArr.reverse();
  }, [datas, row]);

  const handleWidthCol = useCallback(
    (node) => {
      if (node) {
        setWidthCol(Math.round((node.offsetWidth / datas.length) * 0.75));
      }
    },
    [datas.length]
  );

  useEffect(() => {
    if (refRow.current.children.length) {
      setHeightForCalc(
        refRow.current.lastElementChild.offsetTop -
          refRow.current.firstElementChild.offsetTop
      );
    }
  }, [Cells]);

  return (
    <div className={styles.bar}>
      <div
        className={`${styles.background} ${styles.containerRange}`}
        ref={refRow}
      >
        {Cells.map((cell) => {
          return <span key={`${cell}_1`}>{cell}</span>;
        })}
      </div>

      <div className={`${styles.background} ${styles.containerRow}`}>
        {Cells.map((row) => {
          return (
            <div key={`${row}_2`} className={styles.row}>
              <hr></hr>
            </div>
          );
        })}
      </div>

      <div
        className={`${styles.background} ${styles.containerColumn}`}
        ref={handleWidthCol}
      >
        {datas.map((data, index) => {
          let heightCol =
            Cells.length && Math.round((heightForCalc * data.value) / Cells[0]);
          return (
            <div
              key={index}
              className={`${styles.column} ${data.value}`}
              style={{
                "--height": `${heightCol}px`,
                backgroundColor: `${
                  "#" + Math.floor(Math.random() * 16777215).toString(16)
                }`,
                maxWidth: `${widthCol}px`,
              }}
            />
          );
        })}
      </div>

      <div className={`${styles.background} ${styles.containerValue}`}>
        {datas.map((data) => {
          return <span key={data.name}>{data.name}</span>;
        })}
      </div>
    </div>
  );
}
