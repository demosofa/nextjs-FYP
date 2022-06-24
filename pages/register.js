import { useState } from "react";
import { Checkbox, Form, Slider } from "../components";
import { Validate } from "../utils";
import axios from "axios";
import { useRouter } from "next/router";

const LocalApi = process.env.NEXT_PUBLIC_LOCAL_API;

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
          config={{ slides: { preView: 1 }, drag: false }}
          setInstance={setInstance}
          style={{ maxWidth: "500px", borderRadius: "8px" }}
        >
          <FormInfo
            key={0}
            info={info}
            setInfo={setInfo}
            moveTo={() => instanceRef?.current.next()}
          />
          <FormAccount
            key={1}
            info={info}
            moveTo={() => instanceRef?.current.prev()}
          />
        </Slider>
      </div>
    </div>
  );
}

function FormInfo({ info, setInfo, moveTo, ...props }) {
  const handleContinue = (e) => {
    e.preventDefault();
    try {
      Object.entries(info).forEach((entry) => {
        switch (entry[0]) {
          case "fullname":
            new Validate(entry[1]).isEmpty().isNotSpecial();
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
      console.log(error.message);
    }
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
            setInfo((prev) => ({ ...prev, fullname: e.target.value }))
          }
        ></Form.Input>
      </Form.Item>
      <Form.Item>
        <Form.Title>phoneNumber</Form.Title>
        <Form.Input
          value={info.phoneNumber}
          onChange={(e) =>
            setInfo((prev) => ({ ...prev, phoneNumber: e.target.value }))
          }
        ></Form.Input>
      </Form.Item>
      <Form.Item>
        <Form.Title>email</Form.Title>
        <Form.Input
          value={info.email}
          onChange={(e) =>
            setInfo((prev) => ({ ...prev, email: e.target.value }))
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
          setChecked={(gender) => setInfo((prev) => ({ ...prev, gender }))}
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
            throw new Error();
        }
      });
      await axios.post(`${LocalApi}/register`, {
        account: input,
        userInfo: info,
      });
      router.back();
    } catch (error) {
      console.log(error.message);
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
