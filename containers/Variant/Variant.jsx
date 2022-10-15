import { useSelector, useDispatch } from "react-redux";
import { TagsInput, Icon } from "../../components";
import {
  addVariant,
  editVariant,
  deleteVariant,
} from "../../redux/reducer/variantSlice";
import { GiTrashCan } from "react-icons/gi";
import styles from "./variant.module.scss";

export default function Variants() {
  const variants = useSelector((state) => state.variant);
  const dispatch = useDispatch();
  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <label>Variant</label>
        <button
          className="main_btn"
          type="button"
          onClick={() => dispatch(addVariant())}
        >
          Add Variant
        </button>
      </div>
      {variants.map((variant, index) => {
        return (
          <div className={styles.variant} key={variant.id}>
            <input
              value={variant.name}
              onChange={(e) =>
                dispatch(editVariant({ index, name: e.target.value }))
              }
            ></input>

            <div className="flex w-full flex-wrap">
              <TagsInput
                className="flex-2"
                prevTags={variant.options}
                setPrevTags={(tags) => {
                  dispatch(editVariant({ index, options: tags }));
                }}
              ></TagsInput>
              <Icon
                className="flex-1"
                onClick={() => dispatch(deleteVariant(index))}
              >
                <GiTrashCan />
              </Icon>
            </div>
          </div>
        );
      })}
    </div>
  );
}
