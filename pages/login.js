import { useRouter } from "next/router";
import { useState } from "react";
import { Form } from "../components";
import { Notification } from "../Layout";
import { expireStorage, Validate } from "../utils";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addNotification } from "../redux/reducer/notificationSlice";

const LocalApi = process.env.NEXT_PUBLIC_LOCAL_API;

export default function Login() {
  const [input, setInput] = useState({
    username: "",
    password: "",
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
        }
      });
      const accessToken = await axios
        .post(`${LocalApi}/auth/login`, input)
        .then((response) => response.data);
      expireStorage.setItem("accessToken", accessToken);
      router.back();
    } catch (error) {
      dispatch(addNotification({ message: error.message }));
    }
  };
  return (
    <>
      <div className="login-page">
        <div className="background"></div>
        <div className="login-container">
          <Form onSubmit={handleSubmit}>
            <Form.Title style={{ fontSize: "large", fontWeight: "600" }}>
              Login
            </Form.Title>
            <Form.Item>
              <Form.Title>UserName</Form.Title>
              <Form.Input
                value={input.username}
                onChange={(e) =>
                  setInput((prev) => ({ ...prev, username: e.target.value }))
                }
              ></Form.Input>
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
            <Form.Submit>Login</Form.Submit>
          </Form>
          <Form.Button onClick={() => router.push("/register")}>
            Register
          </Form.Button>
        </div>
      </div>
      <Notification />
    </>
  );
}
