import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Form } from "../frontend/components";
import { NotifyToast } from "../frontend/layouts";
import { useLoginMutation } from "../frontend/redux/api/publicApi";
import { addNotification } from "../frontend/redux/reducer/notificationSlice";
import { expireStorage, Validate } from "../frontend/utils";

export default function Login() {
  const [input, setInput] = useState({
    username: "",
    password: "",
  });
  const [login] = useLoginMutation();
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
      const accessToken = await login(input).unwrap();
      expireStorage.setItem("accessToken", accessToken);
      router.back();
    } catch (error) {
      dispatch(addNotification({ message: error.message, type: "error" }));
    }
  };
  useEffect(() => {
    const isAuth = expireStorage.getItem("accessToken");
    if (isAuth) router.back();
  }, []);
  return (
    <>
      <div className="login-page">
        <Head>
          <title>Login</title>
          <meta name="description" content="Login" />
        </Head>
        <div className="background" />
        <div className="login-container">
          <Form onSubmit={handleSubmit}>
            <Form.Title style={{ fontSize: "x-large", fontWeight: "600" }}>
              Login
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
            <Form.Submit>Login</Form.Submit>
          </Form>
          <p>
            Forgot Password?{" "}
            <Link
              className="font-bold hover:text-orange-500"
              href="/forgot_password"
            >
              Reset Password
            </Link>
          </p>
          <p>
            New here?{" "}
            <Link className="font-bold hover:text-orange-500" href="/register">
              Register
            </Link>
          </p>
        </div>
      </div>
      <NotifyToast />
    </>
  );
}
