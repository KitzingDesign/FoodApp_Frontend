import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div className="page-not-found">
      <h1>404</h1>
      <p>Page Not Found</p>
      <Link to="/">Go back to Home</Link>
    </div>
  );
};

export default PageNotFound;
