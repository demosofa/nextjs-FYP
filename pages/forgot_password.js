import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Form } from "../components";
import { addNotification } from "../redux/reducer/notificationSlice";

const LocalApi = process.env.NEXT_PUBLIC_API;

export default function ForgotPassword() {
  const [input, setInput] = useState({ username: "", email: "" });
  const dispatch = useDispatch();
  const router = useRouter();
  useEffect(() => {
    if (localStorage.getItem("accessToken")) router.push("/");
  }, []);
  const handleSubmitSendEmail = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${LocalApi}/auth/forgotPwd`, input);
    } catch (error) {
      dispatch(addNotification({ message: error.message, type: "error" }));
    }
  };
  return (
    <div className="form_center">
      <Form onSubmit={handleSubmitSendEmail}>
        <Form.Title>
          Dont Worry! Just provide your email and we can do the rest
        </Form.Title>
        <Form.Item>
          <Form.Title>Username</Form.Title>
          <Form.Input
            value={input.username}
            onChange={(e) =>
              setInput((prev) => ({ ...prev, username: e.target.value }))
            }
          />
        </Form.Item>
        <Form.Item>
          <Form.Title>Email</Form.Title>
          <Form.Input
            value={input.email}
            onChange={(e) =>
              setInput((prev) => ({ ...prev, email: e.target.value }))
            }
          />
        </Form.Item>
        <Form.Submit>Submit</Form.Submit>
      </Form>
      <p>
        Did you remember?{" "}
        <Link href="/login">
          <a className="font-bold hover:text-orange-500">Login</a>
        </Link>
      </p>
      <p>
        New here?{" "}
        <Link href="/register">
          <a className="font-bold hover:text-orange-500">Register</a>
        </Link>
      </p>
    </div>
  );
}
