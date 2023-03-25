import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/publicApi";
import { addNotification } from "../../redux/reducer/notificationSlice";

export default function RouterAuth() {
  const [logout] = useLogoutMutation();
  const router = useRouter();
  const dispatch = useDispatch();
  const handleLogout = async () => {
    try {
      await logout();
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
