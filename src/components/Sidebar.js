import React, { Component } from "react";

export default class Sidebar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <aside>
        <h1 className="mainHeading">Ourbook</h1>
        <img
          className="profilePicture"
          src={this.props.img}
          alt="profile-picture"
        />
        <p className="name">{this.props.displayName}</p>
        <button className='btn btn-warning' onClick={this.props.logout}>Log out</button>
        <nav>
          <ul>
            <li>
              <a>
                <i className="fa fa-cogs" aria-hidden="true">
                  {" "}
                </i>{" "}
                Settings
              </a>
            </li>
            <li>
              <a>
                <i className="fa fa-user-circle-o" aria-hidden="true">
                  {" "}
                </i>{" "}
                Courses
              </a>
            </li>
            <li>
              <a>
                <i className="fa fa-users" aria-hidden="true" /> Colleagues
              </a>
            </li>
          </ul>
        </nav>
      </aside>
    );
  }
}
