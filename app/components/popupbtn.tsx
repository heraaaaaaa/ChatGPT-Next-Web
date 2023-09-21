import React, { useState, useEffect } from "react";
import classNames from "classnames";
import styles from "./popupbtn.module.scss";
import { useLocation } from "react-router-dom";

interface popupProps {
  isLoginPage: boolean;
}

const PopupBtn = (porps: popupProps) => {
  const [showButton, setShowButton] = useState(false);
  const [btnTxt, setbtnTxt] = useState("登录");

  useEffect(() => {
    //加载页面时触发动画
    setShowButton(true);
    if (porps.isLoginPage) {
      setbtnTxt("登录");
    } else {
      setbtnTxt("注册");
    }
  }, []);

  const handleButtonClick = () => {
    // 处理按钮点击事件
  };

  const buttonClasses = classNames(styles.popupbtn, {
    [styles.show]: showButton,
    [styles.loginbtn]: porps.isLoginPage,
    [styles.signupbtn]: !porps.isLoginPage,
  });

  return (
    <button className={buttonClasses} onClick={handleButtonClick} type="submit">
      {btnTxt}
    </button>
  );
};

export default PopupBtn;
