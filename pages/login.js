import { useState } from "react";
import { Form } from "../components";
import { Validate } from "../utils";
import "../styles/login.scss";

export default function Login() {
  const [input, setInput] = useState({
    username: "",
    password: "",
  });
  const handleSubmit = () => {
    try {
      Object.entries(input).forEach((entry) => {
        switch (entry[0]) {
          case "username":
            new Validate(entry[1]).isEmpty();
          case "password":
            new Validate(entry[1]).isEmpty().isPassWord();
        }
      });
    } catch (error) {}
  };
  return (
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
                setInput((prev) => {
                  return { ...prev, username: e.target.value };
                })
              }
            ></Form.Input>
          </Form.Item>
          <Form.Item>
            <Form.Title>Password</Form.Title>
            <Form.Input
              value={input.password}
              onChange={(e) =>
                setInput((prev) => {
                  return { ...prev, password: e.target.value };
                })
              }
            ></Form.Input>
          </Form.Item>
          <Form.Submit>Login</Form.Submit>
        </Form>
      </div>
    </div>
  );
}
