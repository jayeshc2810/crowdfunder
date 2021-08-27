import React, { Component } from "react";
import fire from "../../config/Firebase";
import { Message } from "semantic-ui-react";

class SignIn extends Component {
  state = {
    email: "",
    password: "",
    signeduser: false,
    errormsg: "",
  };
  handleChange = (e) => {
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
          console.log("No such user!");
          this.setState({ errormsg: "No Such User" });
        } else {
          console.log("User Exists");
          fire
            .auth()
            .signInWithEmailAndPassword(this.state.email, this.state.password)
            .then((u) => {
              console.log(this.state);
            })
            .catch((u) => {
              // console.log(error);
              this.setState({ errormsg: u.code });
            });
        }
      })
      .catch((err) => {
        console.log("Error getting document", err);
      });
  };
  render() {
    const waitingMessage = this.state.signeduser ? (
      <Message
        warning
        header="Notice!"
        content="Logging User! Please be patient."
      />
    ) : (
      ""
    );

    const successMessage = this.state.signeduser ? (
      <Message success header="Congrats!" content="User Signed In!" />
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
          <h1 className="grey-text text-darken-3">Sign In</h1>
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
            <button className="btn blue lighten-1 z-depth-3">Login</button>
          </div>
          {waitingMessage}
          {successMessage}
          {errorMessage}
        </form>
      </div>
    );
  }
}

export default SignIn;
