import { currencyFormat } from "../../shared";

export default function ItemsFromOrder({ viewOrder, setViewOrder }) {
  return (
    <>
      <div className="backdrop" onClick={() => setViewOrder(null)} />
      <div className="form_center max-h-[500px] overflow-y-auto !p-0">
        <table className="table">
          <thead>
            <tr>
              <th>No.</th>
              <th>Image</th>
              <th>Title</th>
              <th>Options</th>
              <th>Quantity</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {viewOrder.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>
                  <img src={item.image} alt="order-item" />
                </td>
                <td>
                  <p className="text-xs line-clamp-1 hover:line-clamp-none">
                    {item.title}
                  </p>
                </td>
                <td>{item.options.join(", ")}</td>
                <td>{item.quantity}</td>
                <td>{currencyFormat(item.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
