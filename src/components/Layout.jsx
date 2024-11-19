import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="full-height-element">
      <Outlet />
    </div>
  );
};

export default Layout;
