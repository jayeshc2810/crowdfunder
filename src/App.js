import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Dashboard from "./components/dashboard/Dashboard";
import SignIn from "./components/auth/SignIn";
import SignUp from "./components/auth/SignUp";
import CreateProject from "./components/projects/CreateProject";
import fire from "./config/Firebase";

import CampaignsDetails from "./components/campaigns/details";
import CampaignsRequests from "./components/requests/list";
import CampaignsCreateRequest from "./components/requests/create";

class App extends Component {
  constructor() {
    super();
    this.state = {
      user: null,
    };
    this.authListener = this.authListener.bind(this);
  }

  componentDidMount() {
    this.authListener();
  }

  authListener() {
    fire.auth().onAuthStateChanged((user) => {
      console.log(user);
      if (user) {
        this.setState({ user });
        localStorage.setItem("user", user.uid);
      } else {
        this.setState({ user: null });
        localStorage.removeItem("user");
      }
    });
  }

  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Navbar />
          <Switch>
            {this.state.user ? console.log("User") : console.log("No User")}
            <Route
              exact
              path="/"
              component={this.state.user ? Dashboard : SignIn}
            />
            <Route exact path="/signin" component={SignIn} />
            <Route exact path="/signup" component={SignUp} />
            <Route exact path="/create" component={CreateProject} />
            <Route
              exact
              path={`/campaigns/:address/requests/create`}
              component={CampaignsCreateRequest}
            />
            <Route
              exact
              path={`/campaigns/:address/requests`}
              component={CampaignsRequests}
            />
            <Route
              exact
              path={`/campaigns/:address`}
              component={CampaignsDetails}
            />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
