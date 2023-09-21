"use client";

import styles from "./signup.module.scss";

import { IconButton } from "./button";
import MaxIcon from "../icons/max.svg";
import MinIcon from "../icons/min.svg";
import SidebarExpendIcon from "../icons/sidebar-expend.svg";
import SidebarCloseIcon from "../icons/sidebar-close.svg";

import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
  Fragment,
  FormEvent,
} from "react";

import {
  ChatMessage,
  SubmitKey,
  useChatStore,
  BOT_HELLO,
  createMessage,
  useAccessStore,
  Theme,
  useAppConfig,
  DEFAULT_TOPIC,
  ModelType,
} from "../store";

import {
  copyToClipboard,
  selectOrCopy,
  autoGrowTextArea,
  useMobileScreen,
} from "../utils";

import { getClientConfig } from "../config/client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, useForm } from "react-hook-form";
import PopupBtn from "./popupbtn";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { Console } from "console";

// 验证
// const schema = z.object({
//   email: z.string().email({ message: "请输入正确格式的邮箱地址" }),
//   password: z
//     .string()
//     .min(6, { message: "密码最小长度为6个字符" })
//     .max(16, { message: "密码最大长度为16个字符" }),
//   // user: z
//   //   .string()
//   //   .min(2, { message: "用户名最小长度为2个字符" })
//   //   .max(10, { message: "用户名最大长度为10个字符" }),
// });

// type FormData = z.infer<typeof schema>;

export function Signup() {
  const config = useAppConfig();
  const isMobileScreen = useMobileScreen();
  const clientConfig = useMemo(() => getClientConfig(), []);
  const showMaxIcon = !isMobileScreen && !clientConfig?.isApp;

  const {
    // register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    // resolver: zodResolver(schema)
  });

  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    const form = formRef.current;

    const handleSubmit = async (event: Event) => {
      event.preventDefault();

      if (form) {
        const email = form.email.value;
        const password = form.password.value;

        const response = await fetch("./api/register", {
          method: "POST",
          body: JSON.stringify({ email, password }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        try {
          const data = await response.json();

          if (response.ok) {
            console.log("成功");
          } else {
            if (Array.isArray(data)) {
              console.log("注册失败  " + data[0]);
            } else if (typeof data === "object" && data.error) {
              console.log("注册失败  " + data.error);
            } else {
              console.log("注册失败");
            }
          }
        } catch (error) {
          console.error("解析响应数据出错:", error);
        }
      }
    };

    if (form) {
      form.addEventListener("submit", handleSubmit);
    }

    return () => {
      if (form) {
        form.removeEventListener("submit", handleSubmit);
      }
    };
  }, [formRef.current]);

  return (
    <>
      <div className={styles["header"]}>
        <div className={styles["btn"]}>
          {/* <IconButton icon={<SidebarExpendIcon />} /> */}
        </div>
        <div className={styles["title"]}>注册您的账号</div>
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
        <form id="registerForm" ref={formRef}>
          <label htmlFor="email" className={styles["form-label"]}>
            邮箱地址
            <span>*</span>
            {/* {errors.email && <span>{errors.email.message}</span>} */}
          </label>
          <input
            // {...register("email")}
            id="email"
            type="text"
            className={styles["form-control"]}
            // value={email}
            // onChange={e=>setEmail(e.target.value)}
          />
          {/* <label htmlFor="user" className={styles["form-label"]}>
            用户名
            <span>*</span>
            {errors.user && <span>{errors.user.message}</span>}
          </label>
          <input
            // {...register("user")}
            id="user"
            type="text"
            className={styles["form-control"]}
          /> */}
          <label htmlFor="password" className={styles["form-label"]}>
            密码
            <span>*</span>
            {/* {errors.password && <span>{errors.password.message}</span>} */}
          </label>
          <input
            // {...register("password")}
            id="password"
            type="password"
            className={styles["form-control"]}
            // value={password}
            // onChange={e=>setPassword(e.target.value)}
          />
          {/* <button className={styles["form-submit"]}>注册</button> */}
          <PopupBtn isLoginPage={false} />
          <div className={styles["go-register"]}>
            <a href="#login">已有账号？去登录</a>
          </div>
        </form>
      </div>
    </>
  );
}
