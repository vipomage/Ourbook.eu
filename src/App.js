import React, { Component } from "react";
import "./App.css";
import { provider } from "./firebase";
import database from "firebase/database";
import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";
import "react-quill/dist/quill.snow.css";
import SignInForm from "./components/SignInForm";
import Sidebar from "./components/Sidebar";
import AppRouter from "./AppRouter";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: "",
      user: firebase.auth().currentUser,
      userCollection: {},
      text: ""
    };
  }

  setText = value => {
    this.setState({ text: value });
  };

  authHandler = authData => {
    let user = authData.user || authData;
    //check if user with UID exist in users db
    const userRef = firebase.database().ref("users/" + this.state.uid);
    userRef.once("value").then(data => {
      let userData = data.val();
      // if not so create one
      if (!userData) {
        let uid = user.uid;
        let obj = {};
        obj[uid] = {
          displayName: user.displayName,
          email: user.email,
          uid
        };
        firebase
          .database()
          .ref("users")
          .set(obj)
          .then(() => {
            firebase.database().goOnline();
            this.setState({
              uid: user.uid
            });
          })
          .catch(e =>
            console.log("Error occurred\n" + JSON.stringify(e.message))
          );
      } else {
        this.setState({
          uid: user.uid
        });
      }
    });
  };

  authenticate = () => {
    firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.SESSION)
      .then(function() {
        return firebase.auth().signInWithPopup;
      });

    firebase
      .auth()
      .signInWithPopup(provider)
      .then(this.authHandler)
      .catch(e => console.log(e));
  };

  logout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        firebase.database().goOffline();
        this.setState({ user: null, uid: "", dbLocation: "" });
      })
      .catch();
    //An error occurred
  };

  getUserDocs = () => {
    firebase
      .database()
      .ref(`documents/${this.state.uid}`)
      .on("value", userData => {
        if (userData.val() !== null) {
          this.setState({ userCollection: userData.val()[this.state.uid] });
        } else {
          this.setState({ userCollection: {} });
        }
      });
  };

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.authHandler(user);
        this.setState({ user: user });
        this.getUserDocs();
      }
    });
  }

  render() {
    if (!this.state.user) {
      return <SignInForm {...this.state} login={this.authenticate} />;
    } else {
      return (
        <div className="container">
          <Sidebar
            displayName={this.state.user.displayName}
            img={this.state.user.photoURL}
            logout={this.logout}
            userCollection={this.state.userCollection}
          />
          <main>
            <AppRouter
              textContainer={this.state.text}
              input={this.setText}
              uid={this.state.uid}
              user={this.state.user}
              userCollection={this.state.userCollection}
            />
          </main>
        </div>
      );
    }
  }
}

export default App;
