import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { addNotification } from "../../redux/reducer/notificationSlice";
import { expireStorage, retryAxios } from "../../utils";

const LocalApi = process.env.NEXT_PUBLIC_API;

export default function RouterAuth() {
  const router = useRouter();
  const dispatch = useDispatch();
  const handleLogout = async () => {
    retryAxios(axios);
    const accessToken = expireStorage.getItem("accessToken");
    try {
      await axios.post(`${LocalApi}/auth/logout`, "", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      localStorage.clear();
      router.reload();
    } catch (error) {
      dispatch(addNotification({ message: error.message }));
    }
  };

  return (
    <>
      {(typeof window !== "undefined" &&
        localStorage.getItem("accessToken") && (
          <>
            <a onClick={handleLogout} style={{ cursor: "pointer" }}>
              Logout
            </a>
          </>
        )) || (
        <>
          <Link href="/login">Login</Link>
          <Link href="/register">Register</Link>
        </>
      )}
    </>
  );
}
