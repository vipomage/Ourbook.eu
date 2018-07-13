import React, { Component } from "react";
import "./App.css";
import { provider } from "./firebase";
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
      sharedDocs: {},
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
          .update(obj)
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
        this.setState({
          uid: "",
          userCollection: "",
          user: firebase.auth().currentUser,
          text: ""
        });
      }).then(()=>{
      window.location.assign('/')
    }).catch();
    //An error occurred
  };
  
  getUserDocs = () => {
    let user = firebase.auth().currentUser;
    firebase
      .database()
      .ref(`documents/${user.uid}`)
      .on("value", userData => {
        let value = userData.val();
        if (value) {
          this.setState({
            userCollection: value
          });
        }
      });
  };
  
  getSharedDocs = () => {
    let user = firebase.auth().currentUser;
    firebase.database().ref('documents').on('value',updatedDocs=>{
      let docs = updatedDocs.val();
      let sharedDocs = {};
      for ( let valKey in docs ) {
        let document= docs[valKey]
        for ( let docKey in document ) {
          let sharedIds = document[docKey].sharedWith;
          if ( sharedIds && sharedIds.hasOwnProperty(user.uid)) {
              sharedDocs[docKey] = document[docKey];
          }
        }
      }
      this.setState({sharedDocs})
    });
  };

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.authHandler(user);
        this.setState({ user: user });
        this.getUserDocs();
        this.getSharedDocs();
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
            sharedDocs={this.state.sharedDocs}
            uid={this.state.uid}
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
