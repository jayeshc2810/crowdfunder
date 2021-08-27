import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import fire from "../../config/Firebase";

class SignedInLinks extends Component {
  constructor() {
    super();
    this.state = {
      userType: "",
    };
  }

  state = {
    userType: "",
  };

  async componentDidMount() {
    console.log("SignedIn user: " + fire.auth().currentUser.email);
    const db = fire.firestore();
    db.collection("users")
      .doc(fire.auth().currentUser.email)
      .get()
      .then((doc) => {
        if (!doc.exists) {
          console.log("No such document!");
        } else {
          console.log("SignedIn Document data:", doc.data());
          this.setState({ userType: doc.data().userType });
        }
      })
      .catch((err) => {
        console.log("Error getting document", err);
      });
  }

  render() {
    return (
      <div>
        <ul className="right">
          <li>
            <NavLink to="/">Dashboard</NavLink>
          </li>
          {this.state.userType == "Developer" ? (
            <li>
              <NavLink to="/create">Post Project</NavLink>
            </li>
          ) : (
            ""
          )}
        </ul>
        <ul className="center">
          {this.state.userType == "Developer"
            ? "Welcome Developer!"
            : "Welcome Investor"}
        </ul>
      </div>
    );
  }
}
// const SignedInLinks = () => {

// };
export default SignedInLinks;
