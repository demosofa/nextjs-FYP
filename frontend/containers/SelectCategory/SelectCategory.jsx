import { useRouter } from "next/router";
import { useState } from "react";
import { Loading } from "../../components";
import { useAxiosLoad } from "../../hooks";

const LocalApi = process.env.NEXT_PUBLIC_API;

export default function SelectCategory({
  index = 0,
  parentId = undefined,
  setSelectedCategories,
  ...props
}) {
  const [selected, setSelected] = useState();
  const [categories, setCategories] = useState();
  const router = useRouter();
  const { loading } = useAxiosLoad({
    async callback(axiosInstance) {
      const url = parentId
        ? `${LocalApi}/category/${parentId}`
        : `${LocalApi}/category`;
      const response = await axiosInstance({ url });
      if (!response.data.length) router.push("/admin/category");
      else {
        setCategories(response.data);
        setSelectedCategories(index, null);
      }
    },
    deps: [parentId],
  });
  const handleSelected = (e) => {
    if (e.target.value < 0) {
      setSelected(null);
      setSelectedCategories(index, null);
      return;
    }
    const { _id, subCategories } = categories[e.target.value];
    setSelected({ index, _id, subCategories, i: e.target.value });
    setSelectedCategories(index, _id);
  };

  if (loading || categories === undefined) return <Loading.Text />;
  return (
    <div className="flex flex-wrap gap-2" {...props}>
      <select defaultValue={-1} onChange={handleSelected}>
        <option value={-1}>None</option>
        {categories.map((category, i) => (
          <option key={category._id} value={i}>
            {category.name}
          </option>
        ))}
      </select>
      {selected && selected.subCategories.length ? (
        <SelectCategory
          key={selected._id}
          index={index + 1}
          parentId={selected._id}
          setSelectedCategories={setSelectedCategories}
        />
      ) : null}
    </div>
  );
}
