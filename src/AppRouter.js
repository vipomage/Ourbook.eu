import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import QuillEditor from "./components/QuillEdit";
import Welcome from "./components/Welcome";
export default class AppRouter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userCollection: ""
    };
  }

  renderWithData = props => {
    let document = this.state.userCollection[props.match.params.id];
    return <QuillEditor {...this.props} data={document.data} name={document.name} />;
  };
  
  renderWithUser = ()=>{
    return <QuillEditor {...this.props} data={''}/>
  };

  componentWillReceiveProps() {
    this.setState({ userCollection: this.props.userCollection });
  }

  render() {
    return (
      <Switch>
        <Route
          path="/editor"
          render={this.renderWithUser}/>
        <Route
          path="/documents/:id"
          render={props => this.renderWithData(props)}
        />
        <Route
          path="/"
          component={Welcome} />
      </Switch>
    );
  }
}
