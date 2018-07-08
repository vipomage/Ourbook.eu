import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import QuillEditor from "./components/Editor2";
import Welcome from "./components/Welcome";

export default class AppRouter extends Component {
  constructor(props){
    super(props);
  }
  render() {
    return (
      <Switch>
        <Route path='/editor' component={QuillEditor}/>
        <Route path='/' component={Welcome}/>
      </Switch>
    );
  }
}
