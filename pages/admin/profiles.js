import axios from "axios";
import useSWR from "swr";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { Loading, Pagination } from "../../components";
import { expireStorage, retryAxios } from "../../utils";
import { addNotification } from "../../redux/reducer/notificationSlice";
import Head from "next/head";
import { useState } from "react";

const LocalApi = process.env.NEXT_PUBLIC_API;

export default function ManageProfiles() {
  const [query, setQuery] = useState({ page: 1, sort: "status", filter: "" });
  const dispatch = useDispatch();
  const router = useRouter();
  const fetcher = async (config) => {
    retryAxios(axios);
    const accessToken = expireStorage.getItem("accessToken");
    const response = await axios({
      ...config,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  };
  const { data, error, mutate } = useSWR(
    {
      url: `${LocalApi}/admin/profiles?page=${query.page}&sort=${query.sort}&filter=${query.filter}`,
    },
    fetcher,
    {
      onError(err, key, config) {
        if (err.response.status === 300) return router.back();
        else if (err.response.status === 401) return router.push("/login");
        else return dispatch(addNotification({ message: err.message }));
      },
    }
  );

  const handleChangeRole = (e, index) => {
    mutate(async (data) => {
      try {
        await fetcher({
          url: `${LocalApi}/admin/profiles/${data.lstProfile[index]._id}`,
          method: "patch",
          data: { role: e.target.value },
        });
        data.lstProfile[index].role = e.target.value;
        return data;
      } catch (error) {
        dispatch(addNotification({ message: error.message, type: "error" }));
      }
    });
  };

  const handleBlockUser = (index) => {
    mutate(async (data) => {
      retryAxios(axios);
      const accessToken = expireStorage.getItem("accessToken");
      try {
        await axios.put(
          `${LocalApi}/admin/profiles/${data.lstProfile[index]._id}`,
          {
            blocked: !data.lstProfile[index].blocked,
          },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        data.lstProfile[index].blocked = true;
        return data;
      } catch (error) {
        dispatch(addNotification({ message: error.message, type: "error" }));
      }
    });
  };
  const handleDeleteUser = (index) => {
    mutate(async (data) => {
      retryAxios(axios);
      const accessToken = expireStorage.getItem("accessToken");
      try {
        await axios.delete(
          `${LocalApi}/admin/profiles/${data.lstProfile[index]._id}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        data.lstProfile = data.lstProfile.filter((_, i) => i !== index);
        return data;
      } catch (error) {
        dispatch(addNotification({ message: error.message, type: "error" }));
      }
    });
  };

  if (!data || error)
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

  return (
    <div className="manage_table">
      <Head>
        <title>Manage Profiles</title>
        <meta name="description" content="Manage Profiles" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <table>
        <thead>
          <tr>
            <th>No.</th>
            <th>Id</th>
            <th>User Name</th>
            <th>Role</th>
            <th>Contact</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.lstProfile.length ? (
            data.lstProfile.map((profile, index) => (
              <tr key={profile._id}>
                <td>{index + 1}</td>
                <td>{profile._id}</td>
                <td>{profile.username}</td>
                <td>
                  <select
                    defaultValue={profile.role}
                    onChange={(e) => handleChangeRole(e, index)}
                  >
                    {["guest", "shipper"].map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <div>Email: {profile.user.email}</div>
                  <div>Phone Number: {profile.user.phoneNumber}</div>
                </td>
                <td>
                  <button onClick={() => handleBlockUser(index)}>
                    {profile.blocked ? "Unblock" : "Block"}
                  </button>
                  <button onClick={() => handleDeleteUser(index)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No guest has resgitered our page
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <Pagination
        className="mt-8"
        totalPageCount={data.pageCounted}
        currentPage={query.page}
        setCurrentPage={(page) => setQuery((prev) => ({ ...prev, page }))}
      >
        <Pagination.Arrow>
          <Pagination.Number />
        </Pagination.Arrow>
      </Pagination>
    </div>
  );
}
