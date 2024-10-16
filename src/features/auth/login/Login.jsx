import { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import usePersist from "../../../hooks/usePersist";
import { setCredentials } from "../authSlice";
import { useLoginMutation, useLoginWithGoogleMutation } from "../authApiSlice";
import styles from "./Login.module.css";
import LogoIcon from "../../../../public/logo";

// Firebase login
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../../../config/firebase";

const Login = () => {
  const emailRef = useRef();
  const errRef = useRef();
  const [email, setEmail] = useState(""); // in tutorial its [user, setUser]
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [persist, setPersist] = usePersist();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();
  const [loginWithGoogle, { isLoading: googleIsLoading }] =
    useLoginWithGoogleMutation();

  useEffect(() => {
    emailRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("hej", userCredential); // Debugging log
      const firebaseToken = await userCredential.user.getIdToken();
      console.log("Firebase token received:", firebaseToken); // Debugging log
      const userData = await login({ firebaseToken }).unwrap();

      dispatch(
        setCredentials({
          ...userData,
          token: userData.accessToken,
          email: userData.user.email,
          user_id: userData.user.user_id,
        })
      );
      console.log(userData.accessToken);

      console.log("Credentials set in Redux:", { ...userData, email }); // Debugging log
      setEmail("");
      setPassword("");
      console.log("Navigating to /welcome", userData.user.user_id); // Debugging log
      navigate(`/welcome/${Number(userData.user.user_id)}`); // Redirect to /welcome
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

  // Handle Google Login
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseToken = await result.user.getIdToken();
      const userData = await loginWithGoogle({ firebaseToken }).unwrap();

      dispatch(
        setCredentials({
          ...userData,
          token: userData.accessToken,
          email: userData.user.email,
          user_id: userData.user.user_id,
        })
      );

      navigate(`/welcome/${Number(userData.user.user_id)}`);
    } catch (err) {
      setErrMsg("Google login failed");
      console.log(err);
    }
  };

  const handleEmailInput = (e) => setEmail(e.target.value);
  const handlePasswordInput = (e) => setPassword(e.target.value);
  const handleToggle = () => setPersist((prev) => !prev);

  const content = isLoading ? (
    <h1>Loading... </h1>
  ) : (
    <div className={styles.outerContainer}>
      <Link to="/" className={styles.logo}>
        <LogoIcon />
      </Link>
      <main className={styles.container}>
        <div className={styles.innerContainer}>
          <div className={styles.imgContainer}>
            <img src="/loginImg.png" alt="Login" className={styles.image} />
          </div>
          <div className={styles.containerLogin}>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"}>
              {errMsg}
            </p>{" "}
            <h1>Login</h1>
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
                  <Link to="/forgot-password" className={styles.forgotPassword}>
                    Forgot Password?
                  </Link>
                </div>
              </div>
              <label htmlFor="persist" className={styles.persist}>
                <input
                  className={styles.persistInput}
                  type="checkbox"
                  id="persist"
                  onChange={handleToggle}
                  checked={persist}
                />
                Remember me?
              </label>
              <div className={styles.buttonContainer}>
                <button type="submit" className={styles.loginButton}>
                  Login
                </button>
              </div>
            </form>
            <div className={styles.orContainer}>
              <div className={styles.divider} />
              <p>or</p>
              <div className={styles.divider} />
            </div>
            <button
              onClick={handleGoogleLogin}
              className={styles.googleLoginButton}
            >
              <span>
                <img src="/google_logo.svg" alt="Google Logo" />
              </span>
              Sign in with Google
            </button>
            <div className={styles.registerContainer}>
              <p>
                Don´t you have an account? <Link to={"/register"}>Signup!</Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );

  return content;
};

export default Login;
