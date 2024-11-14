import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  useRegisterMutation,
  useLoginWithGoogleMutation,
} from "../authApiSlice";
import { useDispatch } from "react-redux";
import { setCredentials } from "../authSlice";
import LogoIcon from "../../../../public/logo";
import styles from "./Register.module.css";

// firebase authentication
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../../../config/firebase";

const preloadImage = (src, callback) => {
  const img = new Image();
  img.src = src;
  img.onload = () => callback(src); // Set src after the image loads
};

const Register = () => {
  const firstNameRef = useRef();
  const errRef = useRef();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [preloadedImage, setPreloadedImage] = useState(""); // Store the preloaded image src

  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();
  const [loginWithGoogle, { isLoading: googleIsLoading }] =
    useLoginWithGoogleMutation();
  const dispatch = useDispatch();

  // Preload images for faster loading
  useEffect(() => {
    preloadImage("/loginImg.png", setPreloadedImage); // Preload the image and store src in state
  }, []);

  useEffect(() => {
    firstNameRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [email, password, firstName, lastName]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (email.trim() === "" || password.trim() === "") {
      setErrMsg("Email and password are required.");
      return;
    }

    if (password.length < 6) {
      setErrMsg("Password must be at least 6 characters long.");
      return;
    }

    try {
      // Firebase signup (create user in Firebase)
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseToken = await userCredential.user.getIdToken();
      console.log(userCredential);
      console.log(firebaseToken);

      // Send the firebaseToken and user details to your backend
      const userData = await register({
        firebaseToken,
        first_name: firstName,
        last_name: lastName,
      }).unwrap();

      // Handle successful signup and set user credentials in Redux
      dispatch(
        setCredentials({
          ...userData,
          token: userData.accessToken,
          email: userData.user.email,
          user_id: userData.user.user_id,
        })
      );

      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      navigate(`/welcome/${userData.user.user_id}`); // Navigate to the welcome page
    } catch (e) {
      console.log("Error object:", e); // Debugging log for the error object

      // Check if it's a Firebase error
      if (e.code) {
        switch (e.code) {
          case "auth/email-already-in-use":
            setErrMsg("Email is already in use");
            break;
          case "auth/invalid-email":
            setErrMsg("Invalid email");
            break;
          case "auth/weak-password":
            setErrMsg("Password is too weak");
            break;
          default:
            setErrMsg("Firebase authentication error: " + e.message);
            break;
        }
      }

      // Check if it's a backend error (likely from the 'register' call)
      else if (e.status) {
        if (e.status === 400) {
          setErrMsg("Missing email or password");
        } else if (e.status === 409) {
          setErrMsg("Duplicate email");
        } else if (e.status === 401) {
          setErrMsg("Unauthorized");
        } else {
          setErrMsg("Something went wrong with backend", e.message);
        }
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

  // input handlers
  const handleFirstNameInput = (e) => {
    setFirstName(e.target.value);
  };
  const handleLastNameInput = (e) => {
    setLastName(e.target.value);
  };
  const handleEmailInput = (e) => {
    setEmail(e.target.value);
  };
  const handlePasswordInput = (e) => {
    setPassword(e.target.value);
  };

  const content = isLoading ? (
    <div>Loading...</div>
  ) : (
    <div className={styles.outerContainer}>
      <Link to="/" className={styles.logo}>
        <LogoIcon />
      </Link>
      <main className={styles.container}>
        <div className={styles.innerContainer}>
          <div className={styles.imgContainer}>
            <img
              src={preloadedImage || "/loginImg.png"}
              alt="Login"
              className={styles.image}
            />
          </div>
          <div className={styles.containerLogin}>
            <h1>Register</h1>
            <div className={errMsg ? styles.errMsg : styles.noErrMsg}>
              <p ref={errRef}>{errMsg}</p>
            </div>
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.namesContainer}>
                <div className={styles.formDiv}>
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    ref={firstNameRef}
                    value={firstName}
                    onChange={handleFirstNameInput}
                    required
                  />
                </div>
                <div className={styles.formDiv}>
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    value={lastName}
                    onChange={handleLastNameInput}
                    required
                  />
                </div>
              </div>
              <div className={styles.formDiv}>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={handleEmailInput}
                  required
                />
              </div>
              <div className={styles.formDiv}>
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={handlePasswordInput}
                  required
                />
              </div>
              <div className={styles.buttonContainer}>
                <button className={styles.registerButton} type="submit">
                  Register
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
            <div className={styles.loginContainer}>
              <p>
                Already have an account? <Link to={"/login"}>Login!</Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );

  return content;
};

export default Register;
