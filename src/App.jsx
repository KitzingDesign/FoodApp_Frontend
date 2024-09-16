import "./App.css";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Register from "./pages/Register";
import LoginPage from "./pages/login/LoginPage";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:3500";
axios.defaults.withCredentials = true;

function App() {
  return (
    <>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<LoginPage />} />
    </>
  );
}

export default App;
