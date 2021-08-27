import React, { Component } from "react";
import fire from "../../config/Firebase";
import { Link } from "react-router-dom";

import { Card, Button, Grid } from "semantic-ui-react";
import factory from "../../ethereum/factory-contract";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);

    this.ref = fire.firestore().collection("projects");
    this.unsubscribe = null;
    this.state = {
      useremail: fire.auth().currentUser.email,
      projects: [],
      ProjectsF: [],
    };
  }

  state = {
    useremail: fire.auth().currentUser.email,
    projects: [],
    ProjectsF: [],
  };

  async componentDidMount() {
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
    const ProjectsF = await factory.methods.getDeployedCampaigns().call();
    this.setState({ ProjectsF });
  }

  renderCards() {
    if (this.state.ProjectsF.length === 0) {
      return <h3>Loading...</h3>;
    }

    const items = this.state.ProjectsF.map((campaignAddress, index) => (
      <Card
        key={index}
        fluid
        header={campaignAddress}
        description={
          <Link to={`/campaigns/${campaignAddress}`}>Show Details</Link>
        }
      />
    ));
    return <Card.Group>{items}</Card.Group>;
  }

  RenderCards() {
    if (this.state.projects.length === 0) {
      return <h3>Loading...</h3>;
    }

    const items = this.state.projects.map((project) => (
      <Card
        fluid
        header={project.title}
        extra={
          "Description: " +
          project.description +
          " " +
          "Developer:" +
          project.developername
        }
        description={
          <Link to={`/campaigns/${project.key}`}> Show Details</Link>
        }
      />
    ));
    return <Card.Group>{items}</Card.Group>;
  }

  logout() {
    fire.auth().signOut();
  }

  onCollectionUpdate = (querySnapshot) => {
    const projects = [];
    querySnapshot.forEach((doc) => {
      const { title, description, developername } = doc.data();
      projects.push({
        key: doc.id,
        doc, // DocumentSnapshot
        title,
        description,
        developername,
      });
    });
    this.setState({
      projects,
    });
  };

  render() {
    return (
      <div className="dashboard container">
        <br />
        <h3>User Email: {this.state.useremail}</h3>
        <Button floated onClick={this.logout} primary>
          Logout
        </Button>
        <br />
        <br />
        <h3>Projects List</h3>
        {this.RenderCards()}
        {/* <Grid>
          <Grid.Row>
            <Grid.Column width={12}>{this.RenderCards()}</Grid.Column>
            <Grid.Column width={4}>
              <Link to={`/create`}>
                <Button floated="right" primary>
                  Post Project
                </Button>
              </Link>
            </Grid.Column>
          </Grid.Row>
        </Grid> */}

        <br />

        {/* <h3>Projects List</h3>
        {this.renderCards()} */}
      </div>
    );
  }
}

export default Dashboard;
