import { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import { useDispatch } from "react-redux";
import { setCredentials } from "../authSlice";
import { useLoginMutation } from "../authApiSlice";
import styles from "./Login.module.css";
import LogoIcon from "../../../../public/logo";

const Login = () => {
  const emailRef = useRef();
  const errRef = useRef();
  const [email, setEmail] = useState(""); // in tutorial its [user, setUser]
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    emailRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userData = await login({ email, password }).unwrap();
      console.log("User data received:", userData); // Debugging log
      const { accessToken } = userData;
      const { UserInfo } = jwtDecode(accessToken);
      const user_id = UserInfo.user_id;

      dispatch(
        setCredentials({
          ...userData,
          token: accessToken,
          email,
          user_id,
        })
      );
      console.log("Credentials set in Redux:", { ...userData, email }); // Debugging log
      setEmail("");
      setPassword("");
      navigate(`/welcome/${user_id}`); // in tutorial /welcome (change name to dashboard later)
      console.log("Navigated to /welcome"); // Debugging log
    } catch (e) {
      if (!e?.originalStatus) {
        setErrMsg("Wrong email or password");
      } else if (e.originalStatus === 400) {
        setErrMsg("Missing email or password");
      } else if (e.originalStatus === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg("Something went wrong");
      }
      if (errRef.current) {
        errRef.current.focus();
      }
    }
  };

  const handleEmailInput = (e) => {
    setEmail(e.target.value);
  };
  const handlePasswordInput = (e) => {
    setPassword(e.target.value);
  };

  const content = isLoading ? (
    <h1>Loading... </h1>
  ) : (
    <div className={styles.outerContainer}>
      <Link to="/" className={styles.logo}>
        <LogoIcon />
      </Link>
      <main className={styles.container}>
        <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"}>
          {errMsg}
        </p>{" "}
        <h1 className={styles.title}>Login</h1>
        <div className={styles.divider}></div>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputContainer}>
            <input
              type="email"
              id="email"
              ref={emailRef}
              value={email}
              onChange={handleEmailInput}
              className={styles.input}
              required
            />
            <label htmlFor="email">Email</label>
          </div>
          <div className={styles.inputContainer}>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordInput}
              className={styles.input}
              required
            />
            <div className={styles.inputTitleContainer}>
              <label htmlFor="password">Password</label>
              <a href="/#" className={styles.forgotPassword}>
                Forgot Password?
              </a>
            </div>
          </div>
          <div className={styles.buttonContainer}>
            <button type="submit" className={styles.loginButton}>
              Login
            </button>
          </div>
        </form>
        <div className={styles.registerContainer}>
          <div className={styles.divider}></div>
          <p>
            Don´t you have an account?<Link to={"/register"}> Signup!</Link>
          </p>
        </div>
      </main>
    </div>
  );

  return content;
};

export default Login;
