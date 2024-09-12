import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  const handleRegisterUser = async (e) => {
    e.preventDefault();
    const { first_name, last_name, email, password } = data;
    try {
      const response = await axios.post("/register", {
        first_name,
        last_name,
        email,
        password,
      });
      const { data } = response;
      if (data.error) {
        return toast.error(data.error);
      } else {
        setData({
          first_name: "",
          last_name: "",
          email: "",
          password: "",
        }); // Clear the form
        toast.success("Register Successful");
        navigate("/login");
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("An error occurred. Please try again.");
      }
      console.log(err);
    }
  };

  return (
    <div>
      <form onSubmit={handleRegisterUser}>
        <label htmlFor="first_name">First Name</label>
        <input
          type="text"
          id="first_name"
          name="first_name"
          placeholder="Enter your first name"
          value={data.first_name}
          onChange={(e) => setData({ ...data, first_name: e.target.value })}
        />
        <label htmlFor="last_name">Last Name</label>
        <input
          type="text"
          id="last_name"
          name="last_name"
          placeholder="Enter your last name"
          value={data.last_name}
          onChange={(e) => setData({ ...data, last_name: e.target.value })}
        />
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Enter your email"
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Enter your password"
          value={data.password}
          onChange={(e) => setData({ ...data, password: e.target.value })}
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
