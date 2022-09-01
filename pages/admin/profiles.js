import axios from "axios";
import useSWR from "swr";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { Loading } from "../../components";
import { expireStorage, retryAxios } from "../../utils";
import { addNotification } from "../../redux/reducer/notificationSlice";
import Head from "next/head";

const LocalApi = process.env.NEXT_PUBLIC_LOCAL_API;

export default function ManageProfiles() {
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
      url: `${LocalApi}/admin/profiles`,
    },
    fetcher,
    {
      onError(err, key, config) {
        if (err.status === 300) return router.back();
        else if (err.status === 401) return router.push("/login");
        else return dispatch(addNotification({ message: err }));
      },
    }
  );
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
  const handleChangeRole = (e, index) => {
    mutate(async (data) => {
      retryAxios(axios);
      const accessToken = expireStorage.getItem("accessToken");
      try {
        await axios.patch(
          `${LocalApi}/admin/profiles/${data[index]._id}`,
          {
            role: e.target.value,
          },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        data[index].role = e.target.value;
        return data;
      } catch (error) {
        console.log(error);
        dispatch(addNotification({ message: error.message }));
      }
    });
  };
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
          </tr>
        </thead>
        <tbody>
          {data.map((profile, index) => (
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
                <div>phone Number: {profile.user.phoneNumber}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
