import React from "react";
import { useParams } from "react-router-dom";
import styles from "./Chart.module.css";
import BarChart from "./BarChart";
import PieChart from "./PieChart";

export default function Chart({ type = null, datas = null }) {
  const params = useParams();
  type = type ?? params.type;
  datas = [
    {
      name: "Page A",
      value: 2400,
    },
    {
      name: "Page B",
      value: 1398,
    },
    {
      name: "Page C",
      value: 9800,
    },
    {
      name: "Page D",
      value: 3908,
    },
    {
      name: "Page E",
      value: 4800,
    },
    {
      name: "Page F",
      value: 3800,
    },
    {
      name: "Page G",
      value: 4300,
    },
  ];
  return (
    (type === "Bar" && <BarChart datas={datas}></BarChart>) ||
    (type === "Pie" && <PieChart datas={datas} size={200}></PieChart>) ||
    null
  );
}
