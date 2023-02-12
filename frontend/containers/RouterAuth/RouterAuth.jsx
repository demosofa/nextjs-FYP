import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { fetcher } from "../../contexts/SWRContext";
import { addNotification } from "../../redux/reducer/notificationSlice";

const LocalApi = process.env.NEXT_PUBLIC_API;

export default function RouterAuth() {
  const router = useRouter();
  const dispatch = useDispatch();
  const handleLogout = async () => {
    try {
      await fetcher({ url: `${LocalApi}/auth/logout`, method: "post" });
      localStorage.clear();
      router.reload();
    } catch (error) {
      dispatch(addNotification({ message: error.message, type: "error" }));
    }
  };

  return (
    <>
      {typeof window !== "undefined" && localStorage.getItem("accessToken") ? (
        <>
          <a onClick={handleLogout} style={{ cursor: "pointer" }}>
            Logout
          </a>
        </>
      ) : (
        <>
          <Link href="/login">Login</Link>
          <Link href="/register">Register</Link>
        </>
      )}
    </>
  );
}
