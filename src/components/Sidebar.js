import React, { Component } from "react";
import {Link} from 'react-router-dom';
import UserCollection from "./UserCollection";
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
          <Link className='btn btn-primary' to='/'>Home</Link>
          <Link className='btn btn-primary' to='/editor'>Quill Editor</Link>
          <Link className='btn btn-primary' to='/draftEditor'>Draft Editor</Link>
        </nav>
        <div className="user-collection-container">
          <p>Your Documents</p>
          <UserCollection userCollection={this.props.userCollection}/>
        </div>
      </aside>
    );
  }
}
