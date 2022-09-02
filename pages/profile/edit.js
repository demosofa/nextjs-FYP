import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Checkbox, Form, Loading } from "../../components";
import { useAuthLoad } from "../../hooks";
import { retryAxios } from "../../utils";
import styles from "../../styles/Home.module.scss";
import { addNotification } from "../../redux/reducer/notificationSlice";
import { Role } from "../../shared";
import Head from "next/head";

const LocalApi = process.env.NEXT_PUBLIC_LOCAL_API;

function EditProfile() {
  const [data, setData] = useState();
  const router = useRouter();
  const dispatch = useDispatch();
  const {
    loading,
    isLoggined,
    isAuthorized,
    axiosInstance: axios,
  } = useAuthLoad({
    async cb(axiosInstance) {
      const res = await axiosInstance({
        url: `${LocalApi}/profile`,
      });
      setData(res.data._doc);
    },
    roles: [Role.admin, Role.guest, Role.shipper],
  });

  const handleSubmit = async () => {
    retryAxios(axios);
    try {
      await axios.put(`${LocalApi}/profile`, data);
      router.back();
    } catch (error) {
      dispatch(addNotification({ message: error.message }));
    }
  };

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
    <Form onSubmit={handleSubmit}>
      <Head>
        <title>Edit My Profile</title>
        <meta name="description" content="Edit My Profile" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Form.Title style={{ fontSize: "large" }}>{data.fullname}</Form.Title>
      <div className="card" style={{ maxWidth: "none" }}>
        <Form.Item>
          <Form.Title>Date of Birth</Form.Title>
          <Form.Input
            value={data.dateOfBirth}
            type="date"
            onChange={(e) =>
              setData((prev) => ({ ...prev, dateOfBirth: e.target.value }))
            }
          ></Form.Input>
        </Form.Item>
        <Form.Item>
          <Form.Title>Gender</Form.Title>
          <Checkbox
            type="radio"
            name="gender"
            checked={[data.gender]}
            setChecked={(value) =>
              setData((prev) => ({ ...prev, gender: value[0] }))
            }
          >
            <Checkbox.Item id="male" value="Male">
              <label htmlFor="male">Male</label>
            </Checkbox.Item>
            <Checkbox.Item id="female" value="Female">
              <label htmlFor="female">Female</label>
            </Checkbox.Item>
          </Checkbox>
        </Form.Item>
        <Form.Item>
          <Form.Title>Phone Number</Form.Title>
          <Form.Input
            value={data.phoneNumber}
            onChange={(e) =>
              setData((prev) => ({ ...prev, phoneNumber: e.target.value }))
            }
          ></Form.Input>
        </Form.Item>
        <Form.Item>
          <Form.Title>Email</Form.Title>
          <Form.Input
            value={data.email}
            type="email"
            onChange={(e) =>
              setData((prev) => ({ ...prev, email: e.target.value }))
            }
          ></Form.Input>
        </Form.Item>
      </div>
      <Form.Submit>Save</Form.Submit>
      <Form.Button onClick={() => router.back()}>Cancel</Form.Button>
    </Form>
  );
}

export default dynamic(() => Promise.resolve(EditProfile), { ssr: false });
