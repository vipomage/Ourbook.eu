import React, { Component } from "react";

export default class RegisterForm extends Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
      <form className="form form-register">
        <div className="text-center mb-4">
          <h1 className="h3 mb-3 font-weight-normal">Register</h1>
        </div>
        
        <div className="form-label-group">
          <input
            type="email"
            id="inputEmail"
            className="form-control"
            placeholder="Email address"
            required={true}
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
        <div className="form-label-group">
          <input
            type="password"
            id="repeatPassword"
            className="form-control"
            placeholder="Repeat Password"
            required={true}
          />
        </div>
        
        <button className="btn btn-lg btn-primary btn-block register-btn" type="submit">
          Register
        </button>
        <p className="mt-5 mb-3 text-muted text-center">© 2017-2018 Ourbook.eu</p>
      </form>
    );
  }
}
