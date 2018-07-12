import React, { Component } from "react";
import { Link } from "react-router-dom";
export default class UserCollection extends Component {
  render() {
    let collection = this.props.userCollection;
    let list = [];
    for (const key in collection) {
      if (collection.hasOwnProperty(key))
      // just for safety
        list.push(
          <li key={key}>
            <Link to={`/documents/${key}`}>{collection[key].name}</Link>
          </li>
        );
    }
    return <ol className="user-collection-list ADD_CSS">{list}</ol>;
  }
}
