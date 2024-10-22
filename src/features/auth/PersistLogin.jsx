import { Outlet, Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { setCredentials } from "./authSlice";
import { useRefreshMutation } from "./authApiSlice";
import usePersist from "../../hooks/usePersist";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "./authSlice";
import PulseLoader from "react-spinners/PulseLoader";
import styles from "./PersistLogin.module.css";
import Button from "../../UI/Button";
import LogoIcon from "../../../public/logo";

const PersistLogin = () => {
  const dispatch = useDispatch();
  const [persist] = usePersist();
  const token = useSelector(selectCurrentToken);
  const effectRan = useRef(false);

  const [trueSuccess, setTrueSuccess] = useState(false);

  const [refresh, { isUninitialized, isLoading, isSuccess, isError, error }] =
    useRefreshMutation();

  useEffect(() => {
    if (effectRan.current === true || process.env.NODE_ENV !== "development") {
      // React 18 Strict Mode

      const verifyRefreshToken = async () => {
        console.log("verifying refresh token");
        try {
          console.log("response");
          const response = await refresh();
          console.log("response", response.data);
          dispatch(setCredentials({ ...response.data }));
          setTrueSuccess(true);
        } catch (err) {
          console.error(err);
        }
      };

      if (!token && persist) verifyRefreshToken();
    }

    return () => (effectRan.current = true);

    // eslint-disable-next-line
  }, []);

  let content;
  if (!persist) {
    // persist: no
    console.log("no persist");
    content = <Outlet />;
  } else if (isLoading) {
    //persist: yes, token: no
    console.log("loading");
    content = <PulseLoader color={"#FFF"} />;
  } else if (isError) {
    //persist: yes, token: no
    console.log("error");
    content = (
      <div className={styles.outerContainer}>
        <Link to="/" className={styles.logo}>
          <LogoIcon />
        </Link>
        <div className={styles.container}>
          <p className={styles.error}>
            You have to Login again. Your session has expired.
          </p>
          <div className={styles.buttonContainer}>
            <Button variant="outline" size="medium" to="/login">
              Go to login
            </Button>
          </div>
        </div>
      </div>
    );
  } else if (isSuccess && trueSuccess) {
    //persist: yes, token: yes
    console.log("success");
    content = <Outlet />;
  } else if (token && isUninitialized) {
    //persist: yes, token: yes
    console.log("token and uninit");
    console.log(isUninitialized);
    content = <Outlet />;
  }

  return content;
};
export default PersistLogin;
