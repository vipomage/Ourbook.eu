import React, { Component } from "react";
import "./App.css";
import firebase, { auth, provider } from "./firebase";
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
      this.setState({ user });
      localStorage.setItem("user", JSON.stringify(user));
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
      <div className='container'>
       <Sidebar displayName={this.state.user.displayName} img={this.state.user.photoURL} logout={this.logout}/>
        <main>
          <header>
          
          </header>
          <MyEditor/>
        </main>
        <div>
          //buttons
        </div>
      </div>
    );
    return <div className="App">{home}</div>;
  }
}

export default App;
