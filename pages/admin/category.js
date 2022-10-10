import Head from "next/head";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAuthLoad, useAxiosLoad } from "../../hooks";
import { Dropdown, Loading } from "../../components";
import { expireStorage, retryAxios } from "../../utils";
import { useDispatch } from "react-redux";
import { addNotification } from "../../redux/reducer/notificationSlice";
import { BiDotsVertical } from "react-icons/bi";
import { Role } from "../../shared";
import styles from "../../styles/crudcategory.module.scss";
import { useRouter } from "next/router";

const LocalApi = process.env.NEXT_PUBLIC_API;

export default function CrudCategory({ maxTree = 3 }) {
  const dispatch = useDispatch();
  const [categories, setCategories] = useState([]);
  const { loading, isLoggined, isAuthorized } = useAuthLoad({
    async cb(axiosInstance) {
      const res = await axiosInstance({ url: `${LocalApi}/category` });
      setCategories(res.data);
    },
    roles: [Role.admin],
  });

  const router = useRouter();

  useEffect(() => {
    if (!loading && !isLoggined && !isAuthorized) router.push("/login");
    else if (!loading && !isAuthorized) router.back();
  }, [loading, isLoggined, isAuthorized]);

  if (loading || !isLoggined || !isAuthorized)
    return (
      <Loading
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%)`,
        }}
      ></Loading>
    );

  const handleAddCategory = async ({ name }) => {
    const accessToken = expireStorage.getItem("accessToken");
    retryAxios(axios);
    try {
      if (!name) throw new Error("Please fill category name");
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
      dispatch(addNotification({ message: error.message, type: "error" }));
    }
  };

  if (loading) return <Loading.Text />;

  return (
    <div className={styles.wrapper}>
      <Head>
        <title>Manage Category</title>
        <meta name="description" content="Manage Category" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
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
              />
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
      if (!name) throw new Error("Please fill category name");
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
      dispatch(addNotification({ message: error.message, type: "error" }));
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
      dispatch(addNotification({ message: error.message, type: "error" }));
    }
  };

  const handleAddSubCategory = async ({ name }) => {
    retryAxios(axios);
    try {
      if (!name) throw new Error("Please fill category name");
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
      dispatch(addNotification({ message: error.message, type: "error" }));
    }
  };

  return (
    <div
      {...props}
      className="mb-4 w-full rounded-lg border border-gray-500 bg-gray-200 p-2 shadow-md"
    >
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
              <Dropdown icon={<BiDotsVertical />} hoverable={true}>
                <Dropdown.Content className="right-0">
                  <div
                    onClick={() =>
                      setToggle((prev) => ({ ...prev, edit: !prev.edit }))
                    }
                  >
                    Edit
                  </div>
                  <div onClick={handleDelete}>Delete</div>
                </Dropdown.Content>
              </Dropdown>
            )}
          </div>
        )}
      </div>
      {maxTree > 0 && (
        <div className="flex items-center gap-6 border-t py-2 px-3 dark:border-gray-600 sm:gap-2">
          <button
            className={styles.btn}
            onClick={() =>
              setToggle((prev) => ({ ...prev, add: !prev.add, more: true }))
            }
          >
            Add
          </button>
          {maxTree > 0 && (
            <button
              className={styles.btn}
              onClick={() =>
                setToggle((prev) => ({ ...prev, more: !prev.more }))
              }
            >
              More
            </button>
          )}
        </div>
      )}
      {toggle.add && (
        <CategoryInput
          callback={handleAddSubCategory}
          setToggle={() => setToggle((prev) => ({ ...prev, add: false }))}
        />
      )}
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
    <div className="relative mb-4 inline-flex w-full flex-wrap justify-between rounded-lg border border-gray-500 bg-white">
      <input
        className="rounded-lg border-0 bg-white p-2.5 text-sm text-gray-900 focus:outline-none"
        value={input.name}
        onChange={(e) =>
          setInput((prev) => ({ ...prev, name: e.target.value }))
        }
      ></input>
      <div className="flex items-center gap-6 border-t py-2 px-3 sm:gap-2">
        <button className={styles.btn} onClick={() => callback(input)}>
          Save
        </button>
        {setToggle && (
          <button className={styles.btn} onClick={() => setToggle(false)}>
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
