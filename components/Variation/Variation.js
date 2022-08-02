import { useEffect } from "react";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GiTrashCan } from "react-icons/gi";
import { useVariantPermutation } from "../../hooks";
import {
  addVariation,
  editVariation,
  deleteVariation,
} from "../../redux/reducer/variationSlice";

export default function Variation() {
  const variants = useSelector((state) => state.variant);
  const dispatch = useDispatch();

  const arrVariant = useMemo(
    () => variants.reduce((prev, curr) => [...prev, curr.options], []),
    [variants]
  );
  const list = useVariantPermutation(arrVariant);
  const variations = useSelector((state) => state.variation);

  useEffect(() => {
    dispatch(addVariation(list));
  }, [variants]);

  return (
    <div style={{ padding: "5px" }}>
      <table>
        <thead>
          <tr>
            <th>No.</th>
            <th>Sku</th>
            <th>Type</th>
            <th>Price</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {variations.map((variation, index) => {
            if (!variation.types.length) return undefined;
            return (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>
                  <input
                    value={variation.sku}
                    onChange={(e) =>
                      dispatch(editVariation({ index, sku: e.target.value }))
                    }
                  ></input>
                </td>
                <td>{variation.types.join("/")}</td>
                <td>
                  <input
                    value={variation.price}
                    onChange={(e) =>
                      dispatch(editVariation({ index, price: e.target.value }))
                    }
                  ></input>
                </td>
                <td>
                  <input
                    value={variation.quantity}
                    onChange={(e) =>
                      dispatch(
                        editVariation({ index, quantity: e.target.value })
                      )
                    }
                  ></input>
                </td>
                <td onClick={() => dispatch(deleteVariation(index))}>
                  <GiTrashCan />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
