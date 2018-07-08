import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import QuillEditor from "./components/QuillEdit";
import MyEditor from "./components/DraftEditor";

export default class AppRouter extends Component {
 
  editorWithId = props => <MyEditor {...this.props} id={props.match.params.id} />;
  editorWithUser = props => <QuillEditor {...this.props} id={''}/>;
  draftEditor = props => <MyEditor {...this.props}/>;

  render() {
    return (
      <Switch>
        <Route path="/editor" render={this.editorWithUser} />
        <Route path="/documents/:id" render={this.editorWithId} />
        <Route path="/draftEditor" render={this.draftEditor} />
      </Switch>
    );
  }
}
