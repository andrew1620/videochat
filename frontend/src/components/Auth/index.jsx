import React, { useContext, useState } from "react";
import "antd/dist/antd.css";
import { Form, Input, Button, Alert, Spin } from "antd";
import { UserOutlined } from "@ant-design/icons";

import css from "./style.module.css";
import { authAPI } from "../../API";
import AppContext from "../../AppContext";
import { setUserData, setIsFetchingData } from "../../reducers/user";

const Auth = () => {
  const { userState, userDispatch } = useContext(AppContext);

  const [localError, setLocalError] = useState({
    hasError: false,
    message: null,
  });
  const clearLocalError = () => {
    setLocalError({ hasError: false, message: null });
  };

  const authorize = async (values) => {
    userDispatch(setIsFetchingData(true));
    const data = await authAPI.authorize(values.username);
    if (data.errorMessage) {
      setLocalError({ hasError: true, message: data.errorMessage });
    } else {
      const userData = { userId: data.data.id, name: data.data.name };
      userDispatch(setUserData(userData));
    }
    userDispatch(setIsFetchingData(false));
  };
  return (
    <div className={css.authBox}>
      <div className={css.formContainer}>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{
            remember: true,
          }}
          onFinish={authorize}
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: "Name is required" },
              // {
              //   validator: checkUsername,
              // },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Username"
            />
          </Form.Item>
          <Form.Item>
            <Spin spinning={userState.isFetchingData}>
              <Button
                type="primary"
                htmlType="submit"
                className={`login-form-button ${css.btnLogin}`}
                disabled={
                  localError.hasError &&
                  localError.message === "No input devices"
                }
              >
                Войти
              </Button>
            </Spin>
          </Form.Item>
          {localError.hasError && (
            <Alert
              message="Error"
              description={localError.message}
              type="error"
              showIcon
              closable
              afterClose={clearLocalError}
            />
          )}
        </Form>
      </div>
    </div>
  );
};

export default Auth;
