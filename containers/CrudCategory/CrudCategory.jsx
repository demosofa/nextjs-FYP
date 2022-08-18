import axios from "axios";
import { useState } from "react";
import { useAuthLoad, useAxiosLoad } from "../../hooks";
import { Dropdown } from "../../components";
import { expireStorage, retryAxios } from "../../utils";
import { useDispatch } from "react-redux";
import { addNotification } from "../../redux/reducer/notificationSlice";
import { BiDotsVertical } from "react-icons/bi";

const LocalApi = process.env.NEXT_PUBLIC_LOCAL_API;

export default function CrudCategory({ maxTree = 3 }) {
  const {
    loading,
    data: categories,
    setData: setCategories,
  } = useAuthLoad({
    config: { url: `${LocalApi}/category` },
    roles: ["guest"],
  });

  const handleAddCategory = async ({ name, description }) => {
    const accessToken = expireStorage.getItem("accessToken");
    retryAxios(axios);
    try {
      const response = await axios.post(
        `${LocalApi}/category`,
        { name, description },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setCategories((prev) => [response.data, ...prev]);
    } catch (error) {
      dispatch(addNotification({ message: error.message }));
    }
  };

  if (loading) return <div>Loading</div>;

  return (
    <div style={{ width: "100%", maxWidth: "500px", minWidth: "320px" }}>
      <CategoryInput callback={handleAddCategory}></CategoryInput>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {categories.length &&
          categories.map((category) => {
            return (
              <SubCategory
                key={category._id}
                data={category}
                maxTree={maxTree}
                setDelete={() =>
                  setCategories((prev) =>
                    prev.filter((item) => item._id !== category._id)
                  )
                }
              ></SubCategory>
            );
          })}
      </div>
    </div>
  );
}

function SubCategory({ data, maxTree, parentCategoryId, setDelete }) {
  const accessToken = expireStorage.getItem("accessToken");
  const [toggle, setToggle] = useState({
    edit: false,
    add: false,
    more: false,
  });
  const [currentCategory, setCurrentCategory] = useState(data);
  const [offDropdown, setOffDropdown] = useState(false);
  const [categories, setCategories] = useState([]);
  const dispatch = useDispatch();
  const { loading } = useAxiosLoad({
    async callback(axiosInstance) {
      if (toggle.more) {
        retryAxios(axiosInstance);
        const response = await axiosInstance({
          url: `${LocalApi}/${currentCategory._id}`,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setCategories(response.data);
      }
    },
    deps: [toggle.more],
  });

  const handleEditSave = async ({ name, description }) => {
    retryAxios(axios);
    try {
      await axios.patch(
        `${LocalApi}/category/${data._id}`,
        { name, description },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setCurrentCategory((prev) => ({ ...prev, name }));
      setToggle((prev) => ({ ...prev, edit: false }));
    } catch (error) {
      dispatch(addNotification({ message: error.message }));
    }
  };

  const handleDelete = async () => {
    retryAxios(axios);
    try {
      await axios.delete(`${LocalApi}/category/${data._id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setDelete();
    } catch (error) {
      dispatch(addNotification({ message: error.message }));
    }
  };

  const handleAddSubCategory = async ({ name, description }) => {
    retryAxios(axios);
    try {
      const response = await axios.post(
        `${LocalApi}/category`,
        { name, description },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setCategories((prev) => [response.data, ...prev]);
    } catch (error) {
      dispatch(addNotification({ message: error.message }));
    }
  };

  return (
    <div>
      <div className="category-tab">
        {(toggle.edit && (
          <CategoryInput
            data={currentCategory}
            callback={handleEditSave}
            setToggle={(boolean) =>
              setToggle((prev) => ({ ...prev, edit: boolean }))
            }
          />
        )) || (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {currentCategory.name}
            {!toggle.edit && (
              <Dropdown
                icon={<BiDotsVertical />}
                toggle={offDropdown}
                setToggle={setOffDropdown}
                onMouseLeave={() => setOffDropdown(false)}
              >
                <div
                  onClick={() =>
                    setToggle((prev) => ({ ...prev, edit: !prev.edit }))
                  }
                >
                  Edit
                </div>
                <div onClick={handleDelete}>Delete</div>
              </Dropdown>
            )}
          </div>
        )}
      </div>
      {maxTree > 0 && (
        <div className="btn-container">
          <button
            onClick={() =>
              setToggle((prev) => ({ ...prev, add: !prev.add, more: true }))
            }
          >
            Add
          </button>
          {maxTree > 0 && (
            <button
              onClick={() =>
                setToggle((prev) => ({ ...prev, more: !prev.more }))
              }
            >
              More
            </button>
          )}
        </div>
      )}
      {toggle.add && <CategoryInput callback={handleAddSubCategory} />}
      <div>
        {toggle.more && loading && (
          <div className="{styles.sub_categories_container}">
            {categories.map((category) => (
              <SubCategory
                key={category._id}
                data={category}
                maxTree={maxTree - 1}
                setDelete={() =>
                  setCategories((prev) =>
                    prev.filter((item) => item._id !== category._id)
                  )
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CategoryInput({
  data = { name: "", description: "" },
  callback,
  setToggle = undefined,
}) {
  const [input, setInput] = useState(data);

  return (
    <div className="edit-container">
      <textarea
        value={input.name}
        onChange={(e) =>
          setInput((prev) => ({ ...prev, name: e.target.value }))
        }
      ></textarea>
      <textarea
        value={input.description}
        onChange={(e) =>
          setInput((prev) => ({ ...prev, description: e.target.value }))
        }
      ></textarea>
      <div>
        <button onClick={() => callback(input)}>Save</button>
        {setToggle && <button onClick={() => setToggle(false)}>Cancel</button>}
      </div>
    </div>
  );
}
