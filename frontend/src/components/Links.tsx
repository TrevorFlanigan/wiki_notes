import { Auth } from "aws-amplify";
import React from "react";
import { Link } from "react-router-dom";
import { LogoutIcon } from "@heroicons/react/solid";
const Links = () => {
  return (
    <>
      <div className="flex flex-col lg:flex-row">
        <li>
          <Link to="/" className="rounded-btn">
            Home
          </Link>
        </li>
        <li>
          <Link to="/notes" className="rounded-btn">
            All Notes
          </Link>
        </li>
        <li>
          <Link to="/newNote" className="rounded-btn">
            New Note
          </Link>
        </li>
      </div>
      <li>
        <a
          onClick={() => Auth.signOut()}
          className="rounded-btn text-white text-left flex justify-between"
        >
          Log Out
          <LogoutIcon className="h-5 w-5 lg:pl-3 lg:h-8 lg:w-8" />
        </a>
      </li>
    </>
  );
};

export default Links;
