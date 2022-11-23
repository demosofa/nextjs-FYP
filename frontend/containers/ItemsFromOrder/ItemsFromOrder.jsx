import { currencyFormat } from "../../../shared";

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
                <td>
                  <label>No.</label>
                  {index + 1}
                </td>
                <td>
                  <label>Image</label>
                  <img src={item.image} alt="order-item" />
                </td>
                <td>
                  <label>Title</label>
                  <p className="text-xs line-clamp-1 hover:line-clamp-none">
                    {item.title}
                  </p>
                </td>
                <td>
                  <label>Options</label>
                  {item.options.join(", ")}
                </td>
                <td>
                  <label>Quantity</label>
                  {item.quantity}
                </td>
                <td>
                  <label>Total</label>
                  {currencyFormat(item.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
