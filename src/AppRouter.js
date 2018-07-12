import React, { Component } from "react";
import { Route, Switch, Redirect, Link } from "react-router-dom";
import Welcome from "./components/Welcome";
import ReactQuill from "react-quill";
import firebase from "./firebase";

export default class AppRouter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userCollection: "",
      text: "",
      document: {
        name: "",
        data: "",
        author: "",
        createdOn: "",
        email: "",
        ownerId: ""
      }
    };
  }

  getDocumentFromDB = props => {
    firebase
      .database()
      .ref(`documents/${this.props.user.uid}/${props.match.params.id}`)
      .on("value", dataSnap => {
        if (
          JSON.stringify(this.state.text) !==
          JSON.stringify(dataSnap.val().data)
        ) {
          this.handleChange(dataSnap.val().data);
          this.setState({ document: dataSnap.val() });
        }
      });
  };

  renderEditor = () => {
    return (
      <div className="editor-container">
        <label htmlFor="docName">Document Name</label>
        <input
          onChange={e => {
            this.setState({ name: e.target.value });
          }}
          type="text"
          defaultValue={this.state.document.name}
        />
        <ReactQuill
          user={this.props.user}
          value={this.state.text}
          onChange={this.handleChange}
          modules={this.state.modules}
          formats={this.state.formats}
        />
        <button onClick={this.addDocument}>Save Doc</button>
      </div>
    );
  };

  addDocument = () => {
    let obj = {
      ownderId: this.props.user.uid,
      author: this.props.user.displayName,
      createdOn: Date.now(),
      data: this.state.text,
      email: this.props.user.email,
      name: this.state.name
    };
    const documentsRef = firebase
      .database()
      .ref("documents/" + this.props.user.uid);
    documentsRef.push(obj).then(res => {
      //anotate saved doc
    });
  };

  handleChange = value => {
    this.setState({ text: value });
  };

  someFunkyFunc = props => {
    this.getDocumentFromDB(props);
    return (
      <div className="editor-container">
        <label htmlFor="docName">Document Name</label>
        <input
          onChange={e => {
            this.setState({ name: e.target.value });
          }}
          type="text"
          defaultValue={this.state.document.name}
        />
        <ReactQuill
          user={this.props.user}
          value={this.state.text}
          onChange={this.handleChange}
          modules={this.state.modules}
          formats={this.state.formats}
        />
        <Link className="btn btn-primary" to="/editor">
          Edit This Document!
        </Link>
      </div>
    );
  };

  render() {
    return (
      <Switch>
        <Route path="/editor" render={this.renderEditor} />
        <Route path="/documents/:id" render={this.someFunkyFunc} />
        <Route component={Welcome} />
      </Switch>
    );
  }
}
