import React, { Component } from "react";
import {Link} from 'react-router-dom';
export default class Sidebar extends Component {
  render() {
    return (
      <aside>
        <h1 className="mainHeading">Ourbook</h1>
        <img
          className="profilePicture"
          src={this.props.img}
          alt=""
        />
        <p className="name">{this.props.displayName}</p>
        <button className='btn btn-warning' onClick={this.props.logout}>Log out</button>
        <nav className='side-nav'>
          <Link to='/editor'>Editor</Link>
          <Link to='/'>Home</Link>
        </nav>
      </aside>
    );
  }
}
