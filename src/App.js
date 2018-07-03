import React, { Component } from 'react';
import './App.css';
import SignInForm from "./components/SignInForm";
import RegisterForm from "./components/RegisterForm";


class App extends Component {
  render() {
    return (
      <div className="App">
        <SignInForm/>
        <RegisterForm/>
      </div>
    );
  }
}

export default App;
