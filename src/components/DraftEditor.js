import React, { Component } from "react";
import { Editor, EditorState, RichUtils, convertToRaw } from "draft-js";
import firebase from "../firebase";

export default class MyEditor extends Component {
  constructor(props) {
    super(props);
    this.state = { editorState: EditorState.createEmpty(),docName:''};
    this.onChange = editorState => this.setState({ editorState });

    this.makeBold = () => {
      this.onChange(
        RichUtils.toggleInlineStyle(this.state.editorState, "BOLD")
      );
    };
    this.makeItalic = () => {
      this.onChange(
        RichUtils.toggleInlineStyle(this.state.editorState, "ITALIC")
      );
    };
  }
  
  addDocument = () => {
    const documentsRef = firebase.database().ref("documents/" + this.props.uid);
    documentsRef
      .push({
        ownderId: this.props.uid,
        author: this.props.user.displayName,
        createdOn: Date.now(),
        data: JSON.stringify(convertToRaw(this.state.editorState.getCurrentContent())),
        email: this.props.user.email,
        name: this.state.name
      })
      .then(() => {
        //anotate saved doc
        console.log("Document Saved");
      }).catch(e=>console.log(e.message));
  };
  render() {
    return (
      <div className="editor border text p-4">
        <div className="actions border mb-3">
          <div><p>Document Name: </p><input onChange={(e)=>{
            this.setState({name:e.target.value})
          }} type="text"/></div>
          <button className="btn m-1" onClick={this.makeBold}>
            Bold
          </button>
          <button className="btn m-1" onClick={this.makeItalic}>
            Italic
          </button>
        </div>
        <Editor
          editorState={this.state.editorState}
          onChange={this.onChange}
          placeholder="This is the editor"
        />
        <button className="btn" onClick={this.addDocument}>
          Save Document
        </button>
      </div>
    );
  }
}
