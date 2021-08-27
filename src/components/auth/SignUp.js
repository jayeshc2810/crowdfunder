import React, { Component } from "react";
import { Message } from "semantic-ui-react";

import fire from "../../config/Firebase";

class SignUp extends Component {
  state = {
    addinguser: false,
    errormsg: "",
    email: "",
    password: "",
    name: "",
    userType: "",
    mID: "",
  };
  handleChange = (e) => {
    this.setState({ addinguser: false });

    this.setState({
      [e.target.id]: e.target.value,
    });
  };
  handleSubmit = (e) => {
    e.preventDefault();

    const db = fire.firestore();
    db.collection("users")
      .doc(this.state.email)
      .get()
      .then((doc) => {
        if (!doc.exists) {
          console.log("User Not Found!  Adding User");

          const waitingMessage = this.state.addinguser ? (
            <Message
              warning
              header="Notice!"
              content="Adding User! Please be patient."
            />
          ) : (
            ""
          );

          fire
            .auth()
            .createUserWithEmailAndPassword(
              this.state.email,
              this.state.password
            )
            .then((u) => {
              console.log(this.state);

              const data = {
                email: this.state.email,
                name: this.state.name,
                userType: this.state.userType,
                mID: this.state.mID,
              };

              db.collection("users")
                .doc(fire.auth().currentUser.email)
                .set(data);
              this.setState({ addinguser: true });
              this.setState({ errormsg: "" });
              console.log("User Added!");
            })
            .catch((u) => {
              console.log(u.code);
              this.setState({ errormsg: u.code });
            });
        } else {
          console.log("User Exists!");
          this.setState({ errormsg: "User Exists! Please Log In!" });
        }
      })
      .catch((err) => {
        console.log("Error getting document", err);
      });
  };
  render() {
    const waitingMessage = this.state.addinguser ? (
      <Message
        warning
        header="Notice!"
        content="Adding User! Please be patient."
      />
    ) : (
      ""
    );

    const successMessage = this.state.addinguser ? (
      <Message success header="Congrats!" content="User Added!" />
    ) : (
      ""
    );

    const errorMessage = this.state.errormsg ? (
      <Message error header="Error!" content={this.state.errormsg} />
    ) : (
      ""
    );

    return (
      <div className="container">
        <form className="white" onSubmit={this.handleSubmit}>
          <h1 className="grey-text text-darken-3">Sign Up</h1>
          <br />
          <br />
          <div className="input-field">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              onChange={this.handleChange}
              required
            />
          </div>
          <div className="input-field">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              onChange={this.handleChange}
              required
            />
          </div>
          <div className="input-field">
            <label htmlFor="Name">Name</label>
            <input
              type="text"
              id="name"
              onChange={this.handleChange}
              required
            />
          </div>
          <div className="input-field">
            <label htmlFor="userType">Developer / Investor</label>
            <input
              type="text"
              id="userType"
              onChange={this.handleChange}
              required
            />
          </div>

          <div className="input-field">
            <label htmlFor="mID">Manager ID</label>
            <input type="text" id="mID" onChange={this.handleChange} required />
          </div>

          <div className="input-field">
            <button className="btn blue lighten-1 z-depth-3">Sign Up</button>
          </div>
          {waitingMessage}
          {successMessage}
          {errorMessage}
        </form>
      </div>
    );
  }
}

export default SignUp;
