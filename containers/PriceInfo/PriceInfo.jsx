import { Timer } from "../../components";
import { currencyFormat } from "../../shared";
import styles from "./_priceInfo.module.scss";

export default function PriceInfo({ saleEvent, price }) {
  const timeEvent = new Date(saleEvent.time).getTime();
  const check =
    saleEvent && saleEvent.sale && saleEvent.time && timeEvent > Date.now();
  return (
    <div className="flex items-center gap-4 sm:flex-col">
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
          <>
            <span className="text-3xl font-medium text-red-500">
              {currencyFormat(saleEvent.sale)}
            </span>
            <div className={styles.discount_label}>
              <span>-{Math.ceil(100 - (saleEvent.sale / price) * 100)}%</span>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
