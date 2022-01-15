import React from "react";
import { Link } from "react-router-dom";

const Links = () => {
  return (
    <>
      <li>
        <Link to="/" className="rounded-btn">
          Home
        </Link>
      </li>
      <li>
        <Link to="/notes" className="rounded-btn">
          Item 2
        </Link>
      </li>
    </>
  );
};

export default Links;
