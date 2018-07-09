import React, { Component } from "react";
import UserCollection from "./UserCollection";
import SidebarNavigation from "./SidebarNavigation";

export default class Sidebar extends Component {
  render() {
    return (
      <aside>
        <h1 className="mainHeading">Ourbook</h1>
        <img className="profilePicture" src={this.props.img} alt="" />
        <p className="name">{this.props.displayName}</p>
        <button className="btn btn-warning" onClick={this.props.logout}>
          Log out
        </button>
        <SidebarNavigation />
        <div className="user-collection-container">
          <p>Your Documents</p>
          <UserCollection userCollection={this.props.userCollection} />
        </div>
      </aside>
    );
  }
}
