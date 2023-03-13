import { format } from "date-fns";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Checkbox, Form, Loading } from "../../frontend/components";
import { useAuthLoad } from "../../frontend/hooks";
import { addNotification } from "../../frontend/redux/reducer/notificationSlice";
import { retryAxios, Validate } from "../../frontend/utils";
import { Role } from "../../shared";

const LocalApi = process.env.NEXT_PUBLIC_API;

function EditProfile() {
  const [data, setData] = useState();
  const router = useRouter();
  const dispatch = useDispatch();
  const {
    loading,
    isLogged,
    authorized,
    axiosInstance: axios,
  } = useAuthLoad({
    async cb(axiosInstance) {
      const res = await axiosInstance({
        url: `${LocalApi}/profile`,
      });
      setData(res.data);
    },
    roles: [Role.admin, Role.customer, Role.shipper, Role.seller],
  });

  const validateInput = () => {
    const { dateOfBirth, phoneNumber, email } = data;
    Object.entries({
      dateOfBirth,
      phoneNumber,
      email,
    }).forEach((entry) => {
      switch (entry[0]) {
        case "dateOfBirth":
          new Validate(entry[1]).isEmpty();
          break;
        case "phoneNumber":
          new Validate(entry[1]).isEmpty().isPhone();
          break;
        case "email":
          new Validate(entry[1]).isEmpty().isEmail();
          break;
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    retryAxios(axios);
    try {
      validateInput();
      await axios.put(`${LocalApi}/profile`, data);
      router.back();
    } catch (error) {
      dispatch(addNotification({ message: error.message, type: "error" }));
    }
  };

  useEffect(() => {
    if (!loading && !isLogged && !authorized) router.push("/login");
    else if (!loading && !authorized) router.back();
  }, [loading, isLogged, authorized]);

  if (loading || !isLogged || !authorized)
    return (
      <Loading
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%)`,
        }}
      />
    );

  return (
    <Form onSubmit={handleSubmit} style={{ margin: "0 auto" }}>
      <Head>
        <title>Edit My Profile</title>
        <meta name="description" content="Edit My Profile" />
      </Head>
      <Form.Title style={{ fontSize: "large" }}>{data.fullname}</Form.Title>
      <div className="card" style={{ maxWidth: "none" }}>
        <Form.Item>
          <Form.Title>Date of Birth</Form.Title>
          <Form.Input
            value={
              data.dateOfBirth
                ? format(new Date(data.dateOfBirth), "yyyy-MM-dd")
                : ""
            }
            type="date"
            onChange={(e) =>
              setData((prev) => ({ ...prev, dateOfBirth: e.target.value }))
            }
          />
        </Form.Item>
        <Form.Item>
          <Form.Title>Gender</Form.Title>
          <Checkbox
            className="flex gap-4"
            type="radio"
            name="gender"
            checked={[data.gender]}
            setChecked={(value) =>
              setData((prev) => ({ ...prev, gender: value[0] }))
            }
          >
            <div className="flex items-center gap-1">
              <Checkbox.Item id="male" value="Male" />
              <label htmlFor="male">Male</label>
            </div>
            <div className="flex items-center gap-1">
              <Checkbox.Item id="female" value="Female" />
              <label htmlFor="female">Female</label>
            </div>
          </Checkbox>
        </Form.Item>
        <Form.Item>
          <Form.Title>Phone Number</Form.Title>
          <Form.Input
            value={data.phoneNumber}
            onChange={(e) =>
              setData((prev) => ({ ...prev, phoneNumber: e.target.value }))
            }
          />
        </Form.Item>
        <Form.Item>
          <Form.Title>Email</Form.Title>
          <Form.Input
            value={data.email}
            type="email"
            onChange={(e) =>
              setData((prev) => ({ ...prev, email: e.target.value }))
            }
          />
        </Form.Item>
      </div>
      <Form.Submit>Save</Form.Submit>
      <Form.Button onClick={() => router.back()}>Cancel</Form.Button>
    </Form>
  );
}

export default dynamic(() => Promise.resolve(EditProfile), { ssr: false });
