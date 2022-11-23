import { useEffect, useState } from "react";
import { Checkbox, Form, Slider } from "../frontend/components";
import { expireStorage, Validate } from "../frontend/utils";
import axios from "axios";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { addNotification } from "../frontend/redux/reducer/notificationSlice";
import { NotifyToast } from "../frontend/layouts";
import Head from "next/head";

const LocalApi = process.env.NEXT_PUBLIC_API;

export default function Register() {
  const [info, setInfo] = useState({
    fullname: "",
    gender: "",
    dateOfBirth: "",
    phoneNumber: "",
    email: "",
  });

  const [instance, setInstance] = useState();
  const router = useRouter();
  useEffect(() => {
    const isAuth = expireStorage.getItem("accessToken");
    if (isAuth) router.back();
  }, []);
  return (
    <div className="login-page">
      <Head>
        <title>Register</title>
      </Head>
      <div className="background" />
      <div className="login-container">
        <Slider
          config={{
            drag: false,
            created: (slide) => {
              setInstance(slide);
            },
          }}
        >
          <Slider.Content className="max-w-[500px] rounded-2xl">
            <FormInfo
              key={0}
              info={info}
              setInfo={setInfo}
              moveTo={() => instance?.next()}
            />
            <FormAccount key={1} info={info} moveTo={() => instance?.prev()} />
          </Slider.Content>
        </Slider>
      </div>
      <NotifyToast />
    </div>
  );
}

function FormInfo({ info, setInfo, moveTo, ...props }) {
  const dispatch = useDispatch();
  const handleContinue = (e) => {
    e.preventDefault();
    try {
      Object.entries(info).forEach((entry) => {
        switch (entry[0]) {
          case "fullname":
            new Validate(entry[1]).isEmpty().isNotSpecial();
            break;
          case "dateOfBirth":
            new Validate(entry[1]).isEmpty();
            break;
          case "email":
            new Validate(entry[1]).isEmpty().isEmail();
            break;
          case "phoneNumber":
            new Validate(entry[1]).isEmpty().isPhone();
            break;
        }
      });
      moveTo();
    } catch (error) {
      dispatch(addNotification({ message: error.message, type: "error" }));
    }
  };
  return (
    <Form onSubmit={handleContinue} {...props}>
      <Form.Title style={{ fontSize: "large", fontWeight: "600" }}>
        Register
      </Form.Title>

      <Form.Item>
        <Form.Title>Full Name</Form.Title>
        <Form.Input
          value={info.fullname}
          onChange={(e) =>
            setInfo((prev) => ({ ...prev, fullname: e.target.value }))
          }
        />
      </Form.Item>

      <Form.Item>
        <Form.Title>Date of Birth</Form.Title>
        <Form.Input
          type="date"
          onChange={(e) =>
            setInfo((prev) => ({ ...prev, dateOfBirth: e.target.value }))
          }
        />
      </Form.Item>

      <Form.Item>
        <Form.Title>Phone Number</Form.Title>
        <Form.Input
          value={info.phoneNumber}
          onChange={(e) =>
            setInfo((prev) => ({ ...prev, phoneNumber: e.target.value }))
          }
        />
      </Form.Item>

      <Form.Item>
        <Form.Title>Email</Form.Title>
        <Form.Input
          value={info.email}
          onChange={(e) =>
            setInfo((prev) => ({ ...prev, email: e.target.value }))
          }
        />
      </Form.Item>

      <Form.Item
        style={{
          justifyContent: "normal",
          gap: 0,
        }}
      >
        <Form.Title>Gender</Form.Title>
        <Checkbox
          type="radio"
          name="gender"
          style={{
            display: "flex",
            border: "none",
            justifyContent: "space-between",
            gap: "20px",
          }}
          setChecked={(gender) =>
            setInfo((prev) => ({ ...prev, gender: gender.join("") }))
          }
        >
          <div>
            <Checkbox.Item value="Male">Male</Checkbox.Item>
          </div>
          <div>
            <Checkbox.Item value="Female">Female</Checkbox.Item>
          </div>
        </Checkbox>
      </Form.Item>

      <Form.Submit>Next</Form.Submit>
    </Form>
  );
}

function FormAccount({ info, moveTo, ...props }) {
  const [input, setInput] = useState({
    username: "",
    password: "",
    passwordAgain: "",
  });
  const dispatch = useDispatch();
  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      Object.entries(input).forEach((entry) => {
        switch (entry[0]) {
          case "username":
            new Validate(entry[1]).isEmpty();
            break;
          case "password":
            new Validate(entry[1]).isEmpty().isPassWord();
            break;
          case "passwordAgain":
            if (input.password === entry[1]) break;
            throw new Error("please input the same password");
        }
      });
      const accessToken = await axios
        .post(`${LocalApi}/auth/register`, {
          account: input,
          userInfo: info,
        })
        .then((response) => response.data);
      expireStorage.setItem("accessToken", accessToken);
      dispatch(addNotification({ message: "Success Register" }));
      router.push("/");
    } catch (error) {
      dispatch(addNotification({ message: error.message, type: "error" }));
    }
  };
  return (
    <Form onSubmit={handleSubmit} {...props}>
      <Form.Title style={{ fontSize: "large", fontWeight: "600" }}>
        Register
      </Form.Title>
      <Form.Item>
        <Form.Title>UserName</Form.Title>
        <Form.Input
          value={input.username}
          onChange={(e) =>
            setInput((prev) => ({ ...prev, username: e.target.value }))
          }
        />
      </Form.Item>
      <Form.Item>
        <Form.Title>Password</Form.Title>
        <Form.Password
          value={input.password}
          onChange={(e) =>
            setInput((prev) => ({ ...prev, password: e.target.value }))
          }
        ></Form.Password>
      </Form.Item>
      <Form.Item>
        <Form.Title>Password Again</Form.Title>
        <Form.Password
          value={input.passwordAgain}
          onChange={(e) =>
            setInput((prev) => ({ ...prev, passwordAgain: e.target.value }))
          }
        ></Form.Password>
      </Form.Item>
      <Form.Button onClick={() => moveTo()}>Back</Form.Button>
      <Form.Submit>Register</Form.Submit>
    </Form>
  );
}
