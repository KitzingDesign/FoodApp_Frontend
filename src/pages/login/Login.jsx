import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Button from "../../UI/Button";
import classes from "./Login.module.css";
import Input from "../../UI/Input";

const Login = () => {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmit(true);
  };

  return (
    <>
      <div className={classes.bgImg}></div>
      <div className={classes.container}>
        {Object.keys(formErrors).length === 0 && isSubmit ? (
          <div className={classes.successMessage}>Signed in successfully</div>
        ) : (
          console.log("Entered Details", formValues)
        )}

        <form className={classes.form} onSubmit={handleSubmit}>
          <h1 className={classes.title}>Sign Up</h1>
          <div className={classes.divider}></div>
          <div>
            <Input
              label={"First Name"}
              type={"text"}
              placeholder="Your first name"
              value={formValues.firstname}
              onChange={handleChange}
              name="firstname"
            />

            <Input
              label={"Last Name"}
              type={"text"}
              placeholder="Your last name"
              value={formValues.lastname}
              onChange={handleChange}
              name="lastname"
            />

            <Input
              label={"Email"}
              type={"text"}
              placeholder="Email"
              value={formValues.email}
              onChange={handleChange}
              name="email"
            />

            <Input
              label={"Password"}
              type={"password"}
              placeholder="Password"
              value={formValues.password}
              onChange={handleChange}
              name="password"
            />

            {/* <div className={classes.field}>
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                value={formValues.confirmPassword}
                onChange={handleChange}
              />
            </div>
            <p>{formErrors.confirmPassword}</p> */}
            <Button size="large" variant="fill">
              Submit
            </Button>
          </div>
          <div className={classes.text}>
            Already have an account? <span>Login</span>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
