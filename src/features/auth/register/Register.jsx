import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../authApiSlice";
import { useDispatch } from "react-redux";
import { setCredentials } from "../authSlice";

const Register = () => {
  const firstNameRef = useRef();
  const errRef = useRef();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    firstNameRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [email, password, firstName, lastName]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userData = await register({
        first_name: firstName,
        last_name: lastName,
        email,
        password,
      }).unwrap();
      console.log("User data received:", userData); // Debugging log

      const { accessToken } = userData;
      dispatch(setCredentials({ ...userData, token: accessToken, email }));

      console.log("Credentials set in Redux:", { ...userData, email }); // Debugging log
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      console.log("Attempting to navigate to /welcome"); // Debugging log
      navigate("/welcome"); // in tutorial /welcome (change name to dashboard later)
      console.log("Navigated to /welcome"); // Debugging log
      // Assume signup API call is successful
      console.log("User signed up:", { firstName, lastName, email, password });
    } catch (e) {
      console.log("Error object:", e); // Log the error object for debugging
      if (!e?.status) {
        setErrMsg("No Server Response");
      } else if (e.status === 400) {
        setErrMsg("Missing email or password");
      } else if (e.status === 409) {
        setErrMsg("Duplicate email");
      } else if (e.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg("Something went wrong");
      }
      if (errRef.current) {
        errRef.current.focus();
      }
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
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            ref={firstNameRef}
            value={firstName}
            onChange={handleFirstNameInput}
            required
          />
        </div>
        <div>
          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={handleLastNameInput}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailInput}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordInput}
            required
          />
        </div>
        <button type="submit">Sign Up</button>
      </form>
      {errMsg && (
        <p ref={errRef} className="errmsg">
          {errMsg}
        </p>
      )}
    </div>
  );

  return content;
};

export default Register;
