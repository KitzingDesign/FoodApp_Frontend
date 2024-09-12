import { useState } from "react";
import classes from "./Input.module.css";

const Input = ({
  type,
  label,
  value,
  onChange,
  placeholder,
  error,
  name,
  ...props
}) => {
  const [isActive, setIsActive] = useState(false);

  const handleFocus = () => {
    setIsActive(true);
  };

  const handleBlur = () => {
    setIsActive(false);
  };

  return (
    <div className={classes.inputContainer}>
      {name === "password" ? (
        <span>
          <label>{label}</label>
          <a href="/forgot-password" className={classes.forgotPassword}>
            Forgot?
          </a>
        </span>
      ) : (
        <label>{label}</label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        name={name}
        placeholder={placeholder}
        className={`${isActive ? classes.active : ""} ${classes.input}`}
      />
      <p>{error}</p>
    </div>
  );
};

export default Input;
