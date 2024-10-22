import React, { useRef } from "react";
import styles from "./ErrorMsg.module.css";

const ErrorMsg = ({ errMsg, errRef }) => {
  return (
    <div className={styles.errMsg}>
      <p ref={errRef}>{errMsg}</p>
    </div>
  );
};

export default ErrorMsg;
