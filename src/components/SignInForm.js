import React, { Component } from "react";

export default class SignInForm extends Component {
  constructor(props) {
    super(props);
    
  }
  render() {
    return (
      <div className="wrapper sign-in">
        <button
          onClick={this.props.login}
          className="btn btn-block btn-social btn-google"
        >
          <span className="fa fa-google"> </span> Sign in with Google
        </button>
        <p className="mt-5 mb-3 text-muted text-center">
          © 2017-2018 Ourbook.eu
        </p>
      </div>
    );
  }
}
