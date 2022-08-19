import { useState } from "react";
import Select from "react-select";
import { Loading } from "../../components";
import { useAxiosLoad } from "../../hooks";

const LocalApi = process.env.NEXT_PUBLIC_LOCAL_API;

export default function SelectCategory({
  index = 0,
  parentId = undefined,
  setSelectedCategories,
}) {
  const [selected, setSelected] = useState();
  const [categories, setCategories] = useState();
  const { loading } = useAxiosLoad({
    async callback(axiosInstance) {
      const url = parentId
        ? `${LocalApi}/category/${parentId}`
        : `${LocalApi}/category`;
      const response = await axiosInstance({ url });
      setCategories(response.data);
      setSelectedCategories(index, null);
    },
    deps: [parentId],
  });
  const handleSelected = ({ value }) => {
    setSelected({ index, ...value });
    setSelectedCategories(index, value._id);
  };

  if (loading) return <Loading.Text></Loading.Text>;
  return (
    <>
      <Select
        defaultValue={{
          value: {
            _id: categories[0]._id,
            subCategories: categories[0].subCategories,
          },
          label: categories[0].name,
        }}
        onChange={handleSelected}
        options={categories.map((category) => ({
          value: { _id: category._id, subCategories: category.subCategories },
          label: category.name,
        }))}
      />
      {selected && selected.subCategories.length && (
        <SelectCategory
          index={index + 1}
          parentId={selected._id}
          setSelectedCategories={setSelectedCategories}
        />
      )}
    </>
  );
}
