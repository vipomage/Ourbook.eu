import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import QuillEditor from "./components/QuillEdit";
import MyEditor from "./components/DraftEditor";
import Welcome from "./components/Welcome";

export default class AppRouter extends Component {
  editorWithId = props => (
    <QuillEditor {...this.props}  id={props.match.params.id} />
  );
  editorWithUser = props => <QuillEditor {...this.props} id={""} />;
  draftEditor = () => <MyEditor {...this.props} />;

  render() {
    return (
      <Switch {...this.props}>
        <Route path="/editor" render={this.editorWithUser} />
        <Route path="/documents/:id" {...this} render={this.editorWithId} />
        <Route path="/draftEditor" render={this.draftEditor} />
        <Route path="/" component={Welcome} />
      </Switch>
    );
  }
}
