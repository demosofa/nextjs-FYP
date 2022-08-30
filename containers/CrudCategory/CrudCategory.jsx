import axios from "axios";
import { useState } from "react";
import { useAuthLoad, useAxiosLoad } from "../../hooks";
import { Dropdown, Loading } from "../../components";
import { expireStorage, retryAxios } from "../../utils";
import { useDispatch } from "react-redux";
import { addNotification } from "../../redux/reducer/notificationSlice";
import { BiDotsVertical } from "react-icons/bi";
import { Role } from "../../shared";
import styles from "./crudcategory.module.scss";

const LocalApi = process.env.NEXT_PUBLIC_LOCAL_API;

export default function CrudCategory({ maxTree = 3 }) {
  const dispatch = useDispatch();
  const [categories, setCategories] = useState([]);
  const { loading } = useAuthLoad({
    async cb(axiosInstance) {
      const res = await axiosInstance({ url: `${LocalApi}/category` });
      setCategories(res.data);
    },
    roles: [Role.admin],
  });

  const handleAddCategory = async ({ name }) => {
    const accessToken = expireStorage.getItem("accessToken");
    retryAxios(axios);
    try {
      const response = await axios.post(
        `${LocalApi}/category`,
        { name, isFirstLevel: "true" },
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
    <div className={styles.wrapper}>
      <CategoryInput callback={handleAddCategory}></CategoryInput>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {categories.length &&
          categories.map((category) => {
            return (
              <SubCategory
                key={category.updatedAt}
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

function SubCategory({ data, maxTree, setDelete, ...props }) {
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
          url: `${LocalApi}/category/${currentCategory._id}`,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setCategories(response.data);
      }
    },
    deps: [toggle.more],
  });

  const handleEditSave = async ({ name }) => {
    retryAxios(axios);
    try {
      await axios.patch(
        `${LocalApi}/category/${currentCategory._id}`,
        { name },
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
      await axios.delete(`${LocalApi}/category/${currentCategory._id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setDelete();
    } catch (error) {
      dispatch(addNotification({ message: error.message }));
    }
  };

  const handleAddSubCategory = async ({ name }) => {
    retryAxios(axios);
    try {
      const response = await axios.put(
        `${LocalApi}/category/${currentCategory._id}`,
        { name },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setCategories((prev) => [...prev, response.data]);
      setToggle((prev) => ({ ...prev, add: false }));
    } catch (error) {
      dispatch(addNotification({ message: error.message }));
    }
  };

  return (
    <div {...props}>
      <div className={styles.container}>
        {(toggle.edit && (
          <CategoryInput
            data={currentCategory}
            callback={handleEditSave}
            setToggle={(boolean) =>
              setToggle((prev) => ({ ...prev, edit: boolean }))
            }
          />
        )) || (
          <div className={styles.tab_container}>
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
      {loading && <Loading.Text />}
      {toggle.more && (
        <div className={styles.sub_categories_container}>
          {categories.map((category) => (
            <SubCategory
              key={category.updatedAt}
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
  );
}

function CategoryInput({
  data = { name: "" },
  callback,
  setToggle = undefined,
}) {
  const [input, setInput] = useState(data);

  return (
    <div className="edit-container">
      <input
        value={input.name}
        onChange={(e) =>
          setInput((prev) => ({ ...prev, name: e.target.value }))
        }
      ></input>
      <div>
        <button onClick={() => callback(input)}>Save</button>
        {setToggle && <button onClick={() => setToggle(false)}>Cancel</button>}
      </div>
    </div>
  );
}
