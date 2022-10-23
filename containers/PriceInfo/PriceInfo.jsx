import { Timer } from "../../components";
import { currencyFormat } from "../../shared";

export default function PriceInfo({ saleEvent, price }) {
  const timeEvent = new Date(saleEvent.time).getTime();
  const check =
    saleEvent && saleEvent.sale && saleEvent.time && timeEvent > Date.now();
  return (
    <div className="flex flex-col items-center gap-4">
      {check ? <Timer value={timeEvent} /> : null}
      <div className="flex items-center gap-3">
        <span
          className={` ${
            check
              ? "text-base text-gray-600 line-through"
              : "text-3xl font-medium text-red-500"
          }`}
        >
          {currencyFormat(price)}
        </span>
        {check ? (
          <span className="text-3xl font-medium text-red-500">
            {currencyFormat(saleEvent.sale)}
          </span>
        ) : null}
      </div>
    </div>
  );
}
