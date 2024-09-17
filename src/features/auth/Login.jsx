import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";
import { setCredentials } from "./authSlice";
import { useLoginMutation } from "./authApiSlice";
import classes from "./Login.module.css";

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
      dispatch(setCredentials({ ...userData, token: accessToken, email }));
      console.log("Credentials set in Redux:", { ...userData, email }); // Debugging log
      setEmail("");
      setPassword("");
      navigate("/welcome"); // in tutorial /welcome (change name to dashboard later)
      console.log("Navigated to /welcome"); // Debugging log
    } catch (e) {
      if (!e?.originalStatus) {
        console.log(!e?.originalStatus);
        setErrMsg("No Server Response");
      } else if (e.originalStatus === 400) {
        setErrMsg("Missing email or password");
      } else if (e.originalStatus === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg("Something went wrong");
      }
      errRef.current.focus();
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
    <div className={classes.login}>
      <section>
        <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"}>
          {errMsg}
        </p>{" "}
        // add css later
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            ref={emailRef}
            value={email}
            onChange={handleEmailInput}
            autoComplete="off"
            required
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordInput}
            required
          />
          <button type="submit">Login</button>
        </form>
      </section>
    </div>
  );

  return content;
};

export default Login;
