import React, { Component } from "react";
import { Message } from "semantic-ui-react";
import factory from "../../ethereum/factory-contract";
import { signAndSendTransaction } from "../../ethereum/helpers";
import PrivateKeyModal from "../private-key-modal/private-key-modal";
import { decode } from "../helpers";
import fire from "../../config/Firebase";

class CreateProject extends Component {
  state = {
    addingproject: false,
    errormsg: "",
    id: "",
    title: "",
    description: "",
    manager: "",
    developerid: "",
    developername: "",
    privatekey: "",
    mcontri: "",
    requests: 0,
    contributors: 0,
    balance: 0,

    value: "",
    error: "",
    success: false,
    loading: false,
    privateKeyModal: false,
  };

  validateInput() {
    return this.state.mcontri.match(/^[0-9]+$/g);
  }

  closeModal = () => this.setState({ privateKeyModal: false });

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
    });
  };

  handleSubmit = async (e) => {
    //Avoiding Refresh
    e.preventDefault();

    //Initailizing Firestore
    const db = fire.firestore();

    this.setState({ addingproject: false });

    this.setState({ success: false });

    if (!this.validateInput()) {
      this.setState({ error: "Please enter a correct number!" });
      console.log("Exiting..");
      return;
    }

    let privateKey = sessionStorage.getItem("pkencoded");

    if (!privateKey) {
      this.setState({ privateKeyModal: true });
      console.log("Private Key Null");
      return;
    } else {
      privateKey = decode(privateKey);
    }

    this.setState({ error: "", loading: true });

    try {
      const createCampaign = await factory.methods.createCampaign(
        this.state.mcontri
      );

      const options = {
        to: createCampaign._parent._address,
        data: createCampaign.encodeABI(),
        gas: "1000000",
      };

      await signAndSendTransaction(options, privateKey);

      const campaigns = await factory.methods.getDeployedCampaigns().call();
      this.setState({ campaigns });
      console.log(this.state.campaigns[this.state.campaigns.length - 1]);
      this.state.id = this.state.campaigns[this.state.campaigns.length - 1];

      //Getting Developer Details
      const cityRef = db.collection("users").doc(fire.auth().currentUser.email);
      cityRef
        .get()
        .then((doc) => {
          if (!doc.exists) {
            console.log("No such document!");
          } else {
            console.log("Document data:", doc.data());
            // this.setState(this.state.developerid, fire.auth().currentUser.uid);
            this.state.developername = doc.get("name");
            this.state.developerid = fire.auth().currentUser.uid;
            const project = {
              id: this.state.id,
              title: this.state.title,
              description: this.state.description,
              manager: this.state.manager,
              developerid: this.state.developerid,
              developername: this.state.developername,
              mcontri: parseInt(this.state.mcontri),
              requests: parseInt(this.state.requests),
              contributors: parseInt(this.state.contributors),
              balance: parseFloat(this.state.balance),
            };

            db.collection("projects")
              .doc(this.state.id)
              .set(project)
              .then((u) => {
                console.log(this.state);
                console.log("Added!");
                this.setState({ addingproject: true });
              })
              .catch((u) => {
                console.log("Not Added!");
                this.setState({ errormsg: u.code });
              });
          }
        })
        .catch((err) => {
          console.log("Error getting document", err);
        });

      this.setState({ success: true });
    } catch (error) {
      this.setState({ error: error.message });
    }

    this.setState({ loading: false });
  };

  render() {
    const waitingMessage = this.state.addingproject ? (
      <Message
        warning
        header="Notice!"
        content="Posting Project! Please be patient."
      />
    ) : (
      ""
    );

    const successMessage = this.state.success ? (
      <Message success header="Congrats!" content="Project Added" />
    ) : (
      ""
    );

    const errorMessage = this.state.errormsg ? (
      <Message error header="Error!" content={this.state.errormsg} />
    ) : (
      ""
    );

    const privateKeyModal = this.state.privateKeyModal ? (
      <PrivateKeyModal closeModal={this.closeModal} />
    ) : (
      ""
    );

    return (
      <div className="container">
        <form className="white" onSubmit={this.handleSubmit}>
          <h1 className="grey-text text-darken-3">Create a New Project</h1>
          <br />
          {/* <div className="input-field">
            <input type="text" id="id" onChange={this.handleChange} />
            <label htmlFor="id">Project ID</label>
          </div> */}
          <div className="input-field">
            <input type="text" id="title" onChange={this.handleChange} />
            <label htmlFor="title">Project Title</label>
          </div>
          <div className="input-field">
            <textarea
              id="description"
              className="materialize-textarea"
              onChange={this.handleChange}
            ></textarea>
            <label htmlFor="description">Project Description</label>
          </div>

          <div className="input-field">
            <input type="text" id="manager" onChange={this.handleChange} />
            <label htmlFor="manager">Manager ID</label>
          </div>

          {/* <div className="input-field">
            <input type="text" id="privatekey" onChange={this.handleChange} />
            <label htmlFor="privatekey">Private Key</label>
          </div> */}

          <div className="input-field">
            <input type="text" id="category" onChange={this.handleChange} />
            <label htmlFor="category">Category</label>
          </div>

          <div className="input-field">
            <input type="number" id="mcontri" onChange={this.handleChange} />
            <label htmlFor="mcontri">Minimum Contribution</label>
          </div>

          {/* <div className="input-field">
            <input type="number" id="requests" onChange={this.handleChange} />
            <label htmlFor="requests">Requests</label>
          </div>

          <div className="input-field">
            <input
              type="number"
              id="contributors"
              onChange={this.handleChange}
            />
            <label htmlFor="contributors">Contributors</label>
          </div>

          <div className="input-field">
            <input
              type="number"
              step="0.0000000001"
              id="balance"
              onChange={this.handleChange}
            />
            <label htmlFor="balance">Balance</label>
          </div> */}

          <div className="input-field">
            <button className="btn blue lighten-1 z-depth-3">Create</button>
          </div>
          {waitingMessage}
          {successMessage}
          {errorMessage}
          {privateKeyModal}
        </form>
      </div>
    );
  }
}

export default CreateProject;
