import { useRouter } from "next/router";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Checkbox, Form } from "../../components";
import { retryAxios } from "../../utils";
import { withAuth } from "../../helpers";
import { addNotification } from "../../redux/reducer/notificationSlice";
import axios from "axios";
import Head from "next/head";

const LocalApi = process.env.NEXT_PUBLIC_LOCAL_API;

export const getServerSideProps = withAuth(async ({ req }, role) => {
  let profile = null;
  try {
    const response = await axios.get(`${LocalApi}/profile`, {
      headers: {
        Cookie: req.headers.cookie,
      },
    });
    profile = response.data;
  } catch (error) {
    console.log(error.message);
  }
  return {
    props: {
      profile,
      role,
    },
  };
});

export default function EditProfile({ profile }) {
  const [data, setData] = useState(profile._doc);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    retryAxios(axios);
    try {
      await axios.put(`${LocalApi}/profile`, data);
      router.back();
    } catch (error) {
      dispatch(addNotification({ message: error.message }));
    }
  };

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
