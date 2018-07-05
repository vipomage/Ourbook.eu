import React, { Component } from "react";
import "./App.css";
import firebase, { auth, provider, db } from "./firebase";

import SignInForm from "./components/SignInForm";
import Sidebar from "./components/Sidebar";
import MyEditor from "./components/Editor";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentItem: "",
      username: "",
      items: [],
      user: localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))
        : null
    };
  }
  login = () => {
    auth.signInWithPopup(provider).then(result => {
      const user = result.user;
      let userObj = {
        name: user.displayName,
        uid: user.uid,
        profilePicture: user.photoURL,
        email: user.email
      };
      //todo prevent adding user to DB if exists in it
      db.collection("users")
        .add(userObj)
        .then(docRef => {
          user.docRef = docRef;
          this.setState({ user });
          localStorage.setItem("user", JSON.stringify(user));
        })
        .catch(function(error) {
          console.error("Error adding document: ", error);
        });
    });
  };
  logout = () => {
    auth.signOut().then(() => {
      this.setState({
        user: null
      });
      localStorage.clear();
    });
  };

  render() {
    const home = !this.state.user ? (
      <SignInForm parentState={this} login={this.login} />
    ) : (
      <div className="container">
        <Sidebar
          displayName={this.state.user.displayName}
          img={this.state.user.photoURL}
          logout={this.logout}
        />
        <main>
          <header />
          <MyEditor db={db} />
        </main>
      </div>
    );
    return <div className="App">{home}</div>;
  }
}

export default App;
