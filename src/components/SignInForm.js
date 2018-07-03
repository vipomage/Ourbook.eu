import React, { Component } from "react";

export default class SignInForm extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <form className="form form-signin">
        <div className="text-center mb-4">
          <h1 className="h3 mb-3 font-weight-normal">Please Login</h1>
        </div>

        <div className="form-label-group">
          <input
            type="email"
            id="inputEmail"
            className="form-control"
            placeholder="Email address"
            required=""
            autoFocus={true}
          />
        </div>

        <div className="form-label-group">
          <input
            type="password"
            id="inputPassword"
            className="form-control"
            placeholder="Password"
            required={true}
          />
        </div>

        <div className="checkbox mb-3">
          <label>
            <input id="remember-me" type="checkbox" value="remember-me" />
            <label htmlFor="remember-me"> Remember me</label>
          </label>
        </div>
        
        <button className="btn btn-lg btn-primary btn-block sign-in-btn" type="submit">
          Sign in
        </button>
        <p className="mt-5 mb-3 text-muted text-center">© 2017-2018 Ourbook.eu</p>
      </form>
    );
  }
}
