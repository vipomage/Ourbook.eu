import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import Welcome from "./components/Welcome";
import ReactQuill from "react-quill";
import firebase from "./firebase";
import $ from "jquery";
import { NotificationManager } from "react-notifications";

export default class AppRouter extends Component {
  defaultState = {
    text: "",
    document: {
      name: "",
      data: "",
      author: "",
      createdOn: "",
      email: "",
      ownerId: ""
    },
    docId: null,
    shareEmail: ""
  };
  constructor(props) {
    super(props);
    this.state = this.defaultState;
  }

  renderEditor = () => {
    return (
      <div className="editor-container">
        <label htmlFor="docName">Document Name</label>
        <input
          onChange={e => {
            this.setState({ name: e.target.value });
          }}
          type="text"
          defaultValue={this.state.name}
        />
        <ReactQuill
          user={this.props.user}
          value={this.state.text}
          onChange={this.handleChange}
          modules={this.state.modules}
          formats={this.state.formats}
        />
        <button onClick={this.saveDocument}>Save Doc</button>
      </div>
    );
  };

  render() {
    return (
      <Switch>
        <Route
          path="/documents/:id"
          props={{ ...this }}
          component={EditorComponent}
        />
        <Route
          path="/editor/new"
          props={{ ...this }}
          component={EmptyEditorComponent}
        />
        <Route component={Welcome} />
      </Switch>
    );
  }
}

class EditorComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      document: {
        name: "",
        data: "",
        author: "",
        createdOn: "",
        email: "",
        ownerId: ""
      },
      docId: "",
      user: firebase.auth().currentUser
    };
    this.handleChange = this.handleChange.bind(this);
  }

  createNotification = (type, message) => {
    return (() => {
      switch (type) {
        case "info":
          NotificationManager.info(message);
          break;
        case "success":
          NotificationManager.success(message);
          break;
        case "warning":
          // noinspection JSUnresolvedFunction
          NotificationManager.warning(message);
          break;
        case "error":
          NotificationManager.error(message);
          break;
        default:
          NotificationManager.error("Something is Wrong");
      }
    })();
  };

  findUserId = email => {
    return new Promise((resolve, reject) => {
      let ref = firebase.database().ref("users");
      ref.once("value").then(data => {
        let users = data.val();
        for (const user in users) {
          if (users[user].email === email) {
            resolve(users[user].uid);
          }
        }
        reject(null);
      });
    });
  };

  toggleShareInput = () => {
    $("#share-input").toggle();
  };

  createShare = () => {
    let userEmail = this.state.shareEmail;
    this.findUserId(userEmail)
      .then(userId => {
        if (userId) {
          let obj = {};
          obj[userId] = userEmail;
          firebase
            .database()
            .ref(
              `documents/${this.state.user.uid}/${this.state.docId}/sharedWith`
            )
            .set(obj)
            .then(() => {
              this.toggleShareInput();
              this.createNotification("success", "Document Shared!");
            })
            .catch(e => this.createNotification("error", e.message));
        } else {
          this.createNotification("error", "User not found!");
        }
      })
      .catch(() => this.createNotification("error", "User not found!"));
  };

  getDocumentFromDB = props => {
    return new Promise(resolve => {
      firebase
        .database()
        .ref(`documents`)
        .on("value", dataSnap => {
          let users = dataSnap.val();
          for (let userKey in users) {
            let documents = users[userKey];
            for (let documentsKey in documents) {
              if (documentsKey === props.match.params.id) {
                let document = documents[documentsKey];
                this.handleChange(document.data);
                return resolve(document);
              }
            }
          }
        });
    });
  };

  saveDocument = () => {
    let obj = {
      ownerId: this.state.user.uid,
      author: this.state.user.displayName,
      createdOn: Date.now(),
      data: this.state.text,
      email: this.state.user.email,
      name: this.state.document.name
    };
    let docRef = `documents/${this.state.user.uid}`;
    if (!this.state.docId) {
      firebase
        .database()
        .ref(docRef)
        .push(obj)
        .catch(e => this.createNotification("error", e.message));
    } else {
      obj.createdOn = this.state.document.createdOn;
      obj.lastEdit = Date.now();
      firebase
        .database()
        .ref(`${docRef}/${this.state.docId}`)
        .update(obj)
        .catch(e => this.createNotification("error", e.message));
    }
  };

  componentDidMount() {
    this.getDocumentFromDB(this.props).then(document => {
      this.setState({
        text: document.data,
        document: document,
        docId: this.props.match.params.id
      });
    });
  }

  componentDidUpdate(prevP, prevS, snap) {
    if (JSON.stringify(prevP) !== JSON.stringify(this.props)) {
      this.getDocumentFromDB(this.props).then(document => {
        this.setState({
          text: document.data,
          document: document,
          docId: this.props.match.params.id
        });
      });
    }
  }

  handleChange(value) {
    this.setState({ text: value });
  }

  render() {
    return (
      <div className="editor-container">
        <div className="doc-details">
          <p>
            Name: <strong>{this.state.document.name}</strong>
          </p>
          <p>
            Created:{" "}
            <strong>
              {new Date(this.state.document.createdOn).toDateString()}
            </strong>
          </p>
          <p>
            Author: <strong>{this.state.document.email}</strong>
          </p>
          <p>
            Last Edit:{" "}
            <strong>
              {this.state.document.lastEdit
                ? new Date(this.state.document.lastEdit).toDateString()
                : "N/A"}
            </strong>
          </p>
        </div>
        <div className="buttons-container">
          <button className="btn btn-warning" onClick={this.toggleShareInput}>
            Share
          </button>
        </div>
        <div id="share-input">
          <input
            onChange={e => {
              this.setState({ shareEmail: e.target.value });
            }}
            type="email"
            placeholder="user email"
          />
          <button className="btn btn-primary" onClick={this.createShare}>
            Create Share
          </button>
        </div>
        <ReactQuill value={this.state.text} onChange={this.handleChange} />
        <button onClick={this.saveDocument}>Save Doc</button>
      </div>
    );
  }
}

class EmptyEditorComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      document: {
        name: "",
        data: "",
        author: "",
        createdOn: "",
        email: "",
        ownerId: ""
      },
      docId: "",
      user: firebase.auth().currentUser
    };
    this.handleChange = this.handleChange.bind(this);
  }

  saveDocument = () => {
    let obj = {
      ownerId: this.state.user.uid,
      author: this.state.user.displayName,
      createdOn: Date.now(),
      data: this.state.text,
      email: this.state.user.email,
      name: this.state.document.name
    };
    let docRef = `documents/${this.state.user.uid}`;
    if (!this.state.docId) {
      firebase
        .database()
        .ref(docRef)
        .push(obj)
        .then(() => {});
    } else {
      obj.createdOn = this.state.document.createdOn;
      obj.lastEdit = Date.now();
      firebase
        .database()
        .ref(`${docRef}/${this.state.docId}`)
        .update(obj)
        .then(() => {});
    }
  };

  handleChange(value) {
    this.setState({ text: value });
  }
  render() {
    return (
      <div className="editor-container">
        <input
          onChange={e => this.setState({ document: { name: e.target.value } })}
          placeholder="Document Name"
          defaultValue="Document Name"
          type="text"
        />

        <ReactQuill value={this.state.text} onChange={this.handleChange} />

        <button onClick={this.saveDocument}>Save Doc</button>
      </div>
    );
  }
}
//todo fix save edited doc on shared docs
