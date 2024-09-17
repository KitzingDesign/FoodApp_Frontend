import { useSelector } from "react-redux";
import { selectCurrentUser, selectCurrentToken } from "../authSlice";
import { Link } from "react-router-dom";
import SideBar from "../../../components/SideBar";
import styles from "./Welcome.module.css";

const Welcome = () => {
  const user = useSelector(selectCurrentUser);
  const token = useSelector(selectCurrentToken);

  const welcome = user ? `Welcome ${user}!` : "Welcome!";
  const tokenAbbr = `${token.slice(0, 9)}...`;

  const content = (
    <main className={styles.container}>
      <SideBar />
      <div className={styles.content}>
        <h1>{welcome}</h1>
        <p>Token: {tokenAbbr}</p>
        <p>
          <Link to="/userslist">Go to the Users List</Link>
        </p>
      </div>
    </main>
  );
  return content;
};

export default Welcome;
