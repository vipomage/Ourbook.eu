import React, { Component } from "react";
import "./App.css";
import firebase, { provider } from "./firebase";

import SignInForm from "./components/SignInForm";
import Sidebar from "./components/Sidebar";
import MyEditor from "./components/Editor";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dbLocation: "",
      uid: "",
      user: firebase.auth().currentUser
    };
  }

  componentWillMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.authHandler(user);
        this.setState({ user: user });
      }
    });
  }

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
          props: {
            displayName: user.displayName,
            email: user.email,
            shares: "{}",
            collections: "{}",
            files: "{}"
          }
        };
        firebase
          .database()
          .ref("users")
          .set(obj)
          .then(() => {
            this.setState({
              uid: user.uid
            });
          })
          .catch(e =>
            console.log("Error occurred\n" + JSON.stringify(e.message))
          );
      }else{
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
        this.setState({ user: null, uid: "", dbLocation: "" });
      })
      .catch
      //An error occurred
      ();
  };

  render() {
    if (!this.state.user) {
      return (
        <div className="App">
          <SignInForm {...this.state} login={this.authenticate} />
        </div>
      );
    } else {
      return (
        <div className="App">
          <div className="container">
            <Sidebar
              displayName={this.state.user.displayName}
              img={this.state.user.photoURL}
              logout={this.logout}
            />
            <main>
              <header />
              <MyEditor {...this.state} />
            </main>
          </div>
        </div>
      );
    }
  }
}

export default App;
