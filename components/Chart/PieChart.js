import { useCallback, useRef, useMemo } from "react";

export default function PieChart({ datas, size, ...props }) {
  const center = useRef(size / 2);
  const canvasref = useRef(null);
  const calcProp = useMemo(() => {
    let total = datas
      .map((item) => item.value)
      .reduce((prev, curr) => prev + curr, 0);
    let startAngle = 0;
    return datas.map((item) => {
      let value = item.value;
      let percent = (value * 100) / total;
      let angle = (percent * 360) / 100;
      let endAngle = startAngle + (Math.PI / 180) * angle;
      let itemProp = {
        name: item.name,
        value,
        percent,
        angle,
        startAngle,
        endAngle,
      };
      startAngle = endAngle;
      return itemProp;
    });
  }, [datas]);

  const canvasRef = useCallback(
    (canvas) => {
      if (canvas) {
        const ctxPie = canvas.getContext("2d");
        [...calcProp].forEach((slice) => {
          draw(ctxPie, center.current, slice.startAngle, slice.endAngle);
        });
        canvasref.current = canvas;
      }
    },
    [calcProp]
  );

  function draw(ctxPie, cirle, startAngle, endAngle) {
    ctxPie.fillStyle = "#" + Math.floor(Math.random() * 16777215).toString(16);
    ctxPie.strokeStyle = `black`;
    ctxPie.lineWidth = 1.5;
    ctxPie.beginPath();
    ctxPie.moveTo(cirle, cirle);
    ctxPie.arc(cirle, cirle, cirle, startAngle, endAngle, false);
    ctxPie.lineTo(cirle, cirle);
    ctxPie.stroke();
    ctxPie.fill();
  }
  function getMousePos(e, canvas) {
    var rect = canvas.getBoundingClientRect(), // abs. size of element
      scaleX = canvas.width / rect.width, // relationship bitmap vs. element for X
      scaleY = canvas.height / rect.height; // relationship bitmap vs. element for Y
    var x = (e.clientX - rect.left) * scaleX, // scale mouse coordinates after they have
      y = (e.clientY - rect.top) * scaleY; // been adjusted to be relative to element
    return [x, y];
  }

  return (
    <canvas
      ref={canvasRef}
      width={1000}
      height={1000}
      style={{ width: `${size}px`, height: `${size}px` }}
      onMouseMove={(e) => getMousePos(e, canvasref.current)}
      {...props}
    ></canvas>
  );
}
