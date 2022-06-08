import { useState } from "react";
import { Checkbox, Form, Slider } from "../components";
import { Validate } from "../utils";
import axios from "axios";
import { useRouter } from "next/router";

export default function Register() {
  const [info, setInfo] = useState({
    fullname: "",
    gender: "",
    dateOfBirth: "",
    address: {},
    phoneNumber: "",
    email: "",
  });

  const [instanceRef, setInstance] = useState();
  return (
    <div className="login-page">
      <div className="background"></div>
      <div className="login-container">
        <Slider
          config={{ slides: { preView: 1 } }}
          setInstance={setInstance}
          style={{ maxWidth: "500px", borderRadius: "8px" }}
        >
          <FormInfo
            info={info}
            setInfo={setInfo}
            moveTo={() => instanceRef?.current.next()}
          />
          <FormAccount info={info} moveTo={() => instanceRef?.current.prev()} />
        </Slider>
      </div>
    </div>
  );
}

function FormInfo({ info, setInfo, moveTo, ...props }) {
  const handleContinue = () => {
    try {
      Object.entries(info).forEach((entry) => {
        switch (entry[0]) {
          case "fullname":
            new Validate(entry[1]).isEmpty().isNotSpecial();
          case "email":
            new Validate(entry[1]).isEmpty().isEmail();
          case "phoneNumber":
            new Validate(entry[1]).isEmpty().isNumber().isPhone();
        }
      });
      moveTo(1);
    } catch (error) {}
  };
  return (
    <Form onSubmit={handleContinue} {...props}>
      <Form.Title style={{ fontSize: "large", fontWeight: "600" }}>
        Register
      </Form.Title>
      <Form.Item>
        <Form.Title>fullName</Form.Title>
        <Form.Input
          value={info.fullname}
          onChange={(e) =>
            setInfo((prev) => {
              return { ...prev, fullname: e.target.value };
            })
          }
        ></Form.Input>
      </Form.Item>
      <Form.Item>
        <Form.Title>phoneNumber</Form.Title>
        <Form.Input
          value={info.phoneNumber}
          onChange={(e) =>
            setInfo((prev) => {
              return { ...prev, phoneNumber: e.target.value };
            })
          }
        ></Form.Input>
      </Form.Item>
      <Form.Item>
        <Form.Title>email</Form.Title>
        <Form.Input
          value={info.email}
          onChange={(e) =>
            setInfo((prev) => {
              return { ...prev, email: e.target.value };
            })
          }
        ></Form.Input>
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
            setInfo((prev) => {
              return { ...prev, gender };
            })
          }
        >
          <div>
            <Checkbox.Item value="male">Male</Checkbox.Item>
          </div>
          <div>
            <Checkbox.Item value="female">Female</Checkbox.Item>
          </div>
        </Checkbox>
      </Form.Item>
      <Form.Item>
        <Form.Title>Address</Form.Title>
        <Form.Item
          style={{
            flexDirection: "column",
            justifyContent: "normal",
            gap: 0,
          }}
        >
          <Form.Title style={{ margin: 0 }}>Street</Form.Title>
          <Form.Input></Form.Input>
        </Form.Item>
        <Form.Item
          style={{
            flexDirection: "column",
            justifyContent: "normal",
            gap: 0,
          }}
        >
          <Form.Title style={{ margin: 0 }}>District</Form.Title>
          <Form.Input></Form.Input>
        </Form.Item>
        <Form.Item
          style={{
            flexDirection: "column",
            justifyContent: "normal",
            gap: 0,
          }}
        >
          <Form.Title style={{ margin: 0 }}>Ward</Form.Title>
          <Form.Input></Form.Input>
        </Form.Item>
      </Form.Item>
      <Form.Button onClick={() => moveTo()}>Next</Form.Button>
    </Form>
  );
}

function FormAccount({ info, moveTo, ...props }) {
  const [input, setInput] = useState({
    username: "",
    password: "",
    passwordAgain: "",
  });
  const handleSubmit = () => {
    try {
      Object.entries(input).forEach((entry) => {
        switch (entry[0]) {
          case "username":
            new Validate(entry[1]).isEmpty();
          case "password":
            new Validate(entry[1]).isEmpty().isPassWord();
          case "passwordAgain": {
            if (input.password === entry[1]) break;
            throw new Error();
          }
        }
      });
    } catch (error) {}
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
      <Form.Item>
        <Form.Title>Password Again</Form.Title>
        <Form.Input
          value={input.passwordAgain}
          onChange={(e) =>
            setInput((prev) => {
              return { ...prev, passwordAgain: e.target.value };
            })
          }
        ></Form.Input>
      </Form.Item>
      <Form.Button onClick={() => moveTo()}>Back</Form.Button>
      <Form.Submit>Register</Form.Submit>
    </Form>
  );
}
