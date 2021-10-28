import styled from "styled-components";
import { Card, Form, Input, Button, message } from "antd";
import { MailTwoTone, LockTwoTone, UserOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

const isLoggedIn = () => {
  const authToken = localStorage.getItem("authToken");
  if (authToken) {
    return true;
  }
  return false;
};

export const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100vw;
  overflow-x: hidden;
  overflow-y: auto;
`;

export default function Login() {
  // styling start

  const dynamicWidth =
    window.innerWidth >= 1024
      ? "30vw"
      : window.innerWidth >= 768
      ? "50vw"
      : "90vw";

  // styling stop

  // key to decice which tab is selected
  const [key, setKey] = useState({ key: "Login" });
  const [isLoading, setIsLoading] = useState(false);

  // onChange function to change the tabs
  const onTabChange = (key: string) => {
    console.log(key);
    setKey({ key: key });
  };

  // Tab List To Switch Tabs
  const tabList = [
    {
      key: "Login",
      tab: "Login",
    },
    {
      key: "Signup",
      tab: "Signup",
    },
  ];

  // Coading part Start

  // first checking if user already logged in or not
  const history = useHistory();
  if (isLoggedIn()) {
    history.replace("/notes");
  }
  interface item {
    msg: string;
  }

  // LOGIN FUNCTION
  const onLogin = async (values: any) => {
    const { email, password } = values;

    const url = "/api/auth/login"; // Proxy set to http://localhost:7000
    const headers = {
      "Content-Type": "application/json",
    };
    const body = {
      email,
      password,
    };
    setIsLoading(true);

    await axios
      .post(url, body, { headers })
      .then((response) => {
        setIsLoading(false);
        message.success("Login Success");
        localStorage.setItem("authToken", response.data.authToken);
        history.push("/");
      })
      .catch((err) => {
        setIsLoading(false);
        err.response.data.error
          ? message.error(err.response.data.error)
          : err.response.data.errors.map((item: item) =>
              message.error(item.msg)
            );
      });
  };
  const onSignUp = async (values: any) => {
    const { name, username, password } = values;
    const url = "/api/auth/createUser";
    const headers = {
      "content-type": "application/json",
    };
    const body = {
      name,
      email: username,
      password,
    };
    setIsLoading(true);
    await axios
      .post(url, body, { headers })
      .then((response) => {
        setIsLoading(false);
        message.success("Account Created Successfully");
        localStorage.setItem("authToken", response.data.authToken);
        history.push("/");
      })
      .catch((err) => {
        setIsLoading(false);
        err.response.data.error
          ? message.error(err.response.data.error)
          : err.response.data.errors.map((item: item) =>
              message.error(item.msg)
            );
      });
  };
  // Coading part End

  // Tab Card Contents
  const contentList = {
    Login: (
      <Form name="normal_login" className="login-form" onFinish={onLogin}>
        <Form.Item
          name="email"
          rules={[{ required: true, message: "Please input your Email!" }]}
        >
          <Input
            prefix={<MailTwoTone className="site-form-item-icon" />}
            placeholder="Email"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your Password!" }]}
        >
          <Input
            prefix={<LockTwoTone className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
            loading={isLoading}
          >
            Log in
          </Button>
        </Form.Item>
      </Form>
    ),
    Signup: (
      <Form name="normal_login" className="login-form" onFinish={onSignUp}>
        <Form.Item
          name="name"
          rules={[{ required: true, message: "Please input your Name!" }]}
        >
          <Input
            prefix={
              <UserOutlined
                className="site-form-item-icon"
                style={{ color: "#1890ff" }}
              />
            }
            placeholder="Name"
          />
        </Form.Item>
        <Form.Item
          name="username"
          rules={[{ required: true, message: "Please input your Email!" }]}
        >
          <Input
            prefix={<MailTwoTone className="site-form-item-icon" />}
            type="email"
            placeholder="Email"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your Password!" }]}
        >
          <Input
            prefix={<LockTwoTone className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
            loading={isLoading}
          >
            Create Account
          </Button>
        </Form.Item>
      </Form>
    ),
  };
  return (
    <MainContainer>
      <Card
        title="Authentication"
        tabList={tabList}
        style={{ width: `${dynamicWidth}` }}
        activeTabKey={key.key}
        onTabChange={(key) => {
          onTabChange(key);
        }}
      >
        {key.key === "Login" ? contentList.Login : contentList.Signup}
      </Card>
    </MainContainer>
  );
}
