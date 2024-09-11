import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({ email: "", password: "" });

  const handleLoginUser = async (e) => {
    e.preventDefault();
    const { email, password } = data;
    try {
      const response = await axios.post("/login", { email, password });
      const { data } = response;
      if (data.error) {
        return toast.error(data.error);
      } else {
        setData({ email: "", password: "" }); // Clear the form
        toast.success("Login Successful");
        navigate("/");
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        toast.error(err.response.data.error);
      } else {
        toast.error("An error occurred. Please try again.");
      }
      console.log(err);
    }
  };

  return (
    <div>
      <form onSubmit={handleLoginUser}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Enter your email"
          value={data.email}
          onChange={(e) => {
            setData({ ...data, email: e.target.value });
          }}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Enter your password"
          value={data.password}
          onChange={(e) => {
            setData({ ...data, password: e.target.value });
          }}
        />
        <label htmlFor="remember_me">
          <input type="checkbox" id="remember_me" name="remember_me" />
          Remember Me
        </label>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
