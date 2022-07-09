import { useEffect, useMemo, useReducer } from "react";
import { TagsInput, Icon } from "..";
import reducer, { initialState } from "./reducer";
import { addVariant, editVariant, deleteVariant } from "./actions";
import { GiTrashCan } from "react-icons/gi";
import styles from "./variant.module.scss";
import useVariantPermutation from "../../hooks/useVariantPermutation";

export default function Variants({
  oldVariants = initialState,
  setNewVariants,
}) {
  const [variants, dispatch] = useReducer(reducer, oldVariants);

  const arrVariant = useMemo(
    () => variants.reduce((prev, curr) => [...prev, curr.options], []),
    [variants]
  );
  const check = useVariantPermutation(arrVariant);
  console.log(check);

  useEffect(() => setNewVariants(variants), [variants]);

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <label>Variant</label>
        <button type="button" onClick={() => dispatch(addVariant())}>
          Add Variant
        </button>
      </div>
      {variants.map((variant, index) => {
        return (
          <div className={styles.variant} key={index}>
            <input
              value={variant.name}
              onChange={(e) =>
                dispatch(editVariant({ index, name: e.target.value }))
              }
            ></input>

            <TagsInput
              prevTags={variant.options}
              setPrevTags={(tags) => {
                dispatch(editVariant({ index, options: tags }));
              }}
            ></TagsInput>

            {/* {JSON.stringify(variant.options)} */}
            <Icon onClick={() => dispatch(deleteVariant(index))}>
              <GiTrashCan />
            </Icon>
          </div>
        );
      })}
    </div>
  );
}
