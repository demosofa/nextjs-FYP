import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Loading } from "../../components";
import { useAuthLoad } from "../../hooks";

const LocalApi = process.env.NEXT_PUBLIC_LOCAL_API;

function MyProfile() {
  const router = useRouter();
  const { loading, isLoggined, isAuthorized, data } = useAuthLoad({
    config: {
      url: `${LocalApi}/profile`,
    },
    roles: ["guest"],
  });

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
  return (
    <div>
      <div>{data.fullname}</div>
      <div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div></div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(MyProfile), { ssr: false });
