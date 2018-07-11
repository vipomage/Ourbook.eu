import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class SidebarNavigation extends Component {
  render() {
    return (
      <nav className="side-nav ADD_CSS">
        <Link className="btn btn-primary" to="/">
          Home
        </Link>
        <Link className="btn btn-primary" to="/editor">
          Quill Editor
        </Link>
      </nav>
    );
  }
}
