import React from "react";
import { Link } from "react-router-dom";
import SignedInLinks from "./SignedInLinks";
import SignedOutLinks from "./SignedOutLinks";
import fire from "../../config/Firebase";

const Navbar = () => {
  return (
    <nav className="nav-wrapper grey darken-3">
      <div className="container">
        <Link to="/" className="brand-logo">
          Crowdfunder
        </Link>
        {fire.auth().currentUser ? <SignedInLinks /> : <SignedOutLinks />}
        {/* <SignedInLinks />
        <SignedOutLinks /> */}
      </div>
    </nav>
  );
};

export default Navbar;
