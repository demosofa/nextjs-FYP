import { useEffect } from "react";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useVariantPermutation } from "../../hooks";
import {
  addVariation,
  editVariation,
  deleteVariation,
} from "../../redux/reducer/variationSlice";
import Variant from "./Variant";

export default function Variation({
  oldVariants = initialState,
  setNewVariants,
}) {
  const variants = useSelector((state) => state.variant);
  const dispatch = useDispatch();
  const arrVariant = useMemo(
    () => variants.reduce((prev, curr) => [...prev, curr.options], []),
    [variants]
  );
  const list = useVariantPermutation(arrVariant);
  useEffect(() => {
    dispatch(addVariation(list));
  }, [variants]);

  const variations = useSelector((state) => state.variation);

  return (
    <div style={{ padding: "5px" }}>
      <Variant variants={variants} dispatch={dispatch} />
      <table>
        <thead>
          <tr>
            <th>No.</th>
            <th>Thumbnail</th>
            <th>Title</th>
            <th>Type</th>
            <th>Price</th>
            <th>Stock</th>
          </tr>
        </thead>
        <tbody>
          {variations.map((variation, index) => {
            return (
              <tr key={index}>
                <td>{index + 1}</td>
                <td></td>
                <td>
                  <input
                    value={variation.title}
                    onChange={(e) =>
                      dispatch(editVariation({ index, title: e.target.value }))
                    }
                  ></input>
                </td>
                <td>{variation.type.join("/")}</td>
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
                    value={variation.stock}
                    onChange={(e) =>
                      dispatch(editVariation({ index, stock: e.target.value }))
                    }
                  ></input>
                </td>
                <button
                  onClick={() => dispatch(deleteVariation(index))}
                ></button>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
