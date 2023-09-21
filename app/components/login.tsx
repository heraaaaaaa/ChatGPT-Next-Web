"use client";

import styles from "./login.module.scss";

import { IconButton } from "./button";
import MaxIcon from "../icons/max.svg";
import MinIcon from "../icons/min.svg";

import React, { useMemo } from "react";

import { useAppConfig } from "../store";

import { useMobileScreen } from "../utils";

import { getClientConfig } from "../config/client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldPathValues, FieldValues, useForm } from "react-hook-form";

import PopupBtn from "./popupbtn";

// 验证
const schema = z.object({
  email: z.string().email({ message: "请输入正确格式的邮箱地址" }),
  password: z
    .string()
    .min(6, { message: "密码最小长度为6个字符" })
    .max(16, { message: "密码最大长度为16个字符" }),
});

type FormData = z.infer<typeof schema>;

export function Login() {
  // const router = useRouter();
  const config = useAppConfig();
  const isMobileScreen = useMobileScreen();
  const clientConfig = useMemo(() => getClientConfig(), []);
  const showMaxIcon = !isMobileScreen && !clientConfig?.isApp;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  //提交
  const onSubmit = async (data: FieldValues) => {
    console.log(data);

    const form = document.getElementById("loginForm") as HTMLFormElement;
    // event.preventDefault();

    const response = await fetch("./api/users", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await response.json();

    if (response.ok) {
      console.log("注册成功");
      //跳转页面
    } else {
      // if (Array.isArray(res)) {
      //   console.log("注册失败  " + res[0]);
      // } else if (typeof res === "object" && res.error) {
      //   console.log("注册失败  " + res.error);
      // } else {
      //   console.log("注册失败");
      // }
      console.log("注册失败,请重试");
    }
  };

  return (
    <>
      <div className={styles["header"]}>
        <div className={styles["btn"]}>
          {/* <IconButton icon={<SidebarExpendIcon />} /> */}
        </div>
        <div className={styles["title"]}>登录您的账号</div>
        <div className={styles["btn"]}>
          {showMaxIcon && (
            <div className="window-action-button">
              <IconButton
                icon={config.tightBorder ? <MinIcon /> : <MaxIcon />}
                bordered
                onClick={() => {
                  config.update(
                    (config) => (config.tightBorder = !config.tightBorder),
                  );
                }}
              />
            </div>
          )}
        </div>
      </div>
      <div className={styles["main"]}>
        <form id="loginForm" onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="email" className={styles["form-label"]}>
            邮箱地址
            <span>*</span>
            {errors.email && <span>{errors.email.message}</span>}
          </label>
          <input
            {...register("email")}
            id="email"
            type="text"
            className={styles["form-control"]}
          />
          <label htmlFor="password" className={styles["form-label"]}>
            密码
            <span>*</span>
            {errors.password && <span>{errors.password.message}</span>}
          </label>
          <input
            {...register("password")}
            id="password"
            type="text"
            className={styles["form-control"]}
          />
          {/* <button className={styles["form-submit"]}>登录</button> */}
          <PopupBtn isLoginPage={true} />
          <div className={styles["go-register"]}>
            <a href="#signup">没有账号？去注册</a>
          </div>
        </form>
      </div>
    </>
  );
}
