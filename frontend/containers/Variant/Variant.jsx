import { GiTrashCan } from "react-icons/gi";
import { useDispatch, useSelector } from "react-redux";
import { Icon, TagsInput } from "../../components";
import {
  addVariant,
  deleteVariant,
  editVariant,
} from "../../redux/reducer/variantSlice";
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
              value={variant.name || " "}
              onChange={(e) =>
                dispatch(editVariant({ index, name: e.target.value.trim() }))
              }
              placeholder="input variant name"
            />

            <div className="flex flex-2 items-center">
              <TagsInput
                className="flex-2"
                prevTags={variant.options}
                setPrevTags={(tags) => {
                  dispatch(editVariant({ index, options: tags }));
                }}
              />
              <Icon
                className="group ml-3 !h-fit !w-fit rounded-full bg-slate-200 hover:bg-slate-500"
                onClick={() => dispatch(deleteVariant(index))}
              >
                <GiTrashCan
                  className="group-hover:text-white"
                  size={25}
                  style={{ margin: 7 }}
                />
              </Icon>
            </div>
          </div>
        );
      })}
    </div>
  );
}
