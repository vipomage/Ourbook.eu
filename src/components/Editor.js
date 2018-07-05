import React, { Component } from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromRaw
} from "draft-js";


export default class MyEditor extends Component {
  constructor(props) {
    super(props);
    this.state = { editorState: EditorState.createEmpty() };
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
    this.fontSize = () => {
      this.onChange(RichUtils.tryToRemoveBlockStyle(this.state.editorState));
    };
  }
  saveDoc = data => {
    const rawData = convertToRaw(this.state.editorState.getCurrentContent());
    this.props.db.collection('users').add({
      first:'Ada',
      last:'Lovelace',
      born:1815
    }).then(docRef=>{
      console.log('Document written with ID ',docRef);
    }).catch(e=>{
      console.log('Error adding document: ',e)
    })

    fetch("");
  };
  render() {
    const raw = convertToRaw(this.state.editorState.getCurrentContent());
    return (
      <div className="editor border text p-4">
        <div className="actions border mb-3">
          <button className="btn m-1" onClick={this.makeBold}>
            Bold
          </button>
          <button className="btn m-1" onClick={this.makeItalic}>
            Italic
          </button>
          <button className="btn m-1" onClick={this.fontSize}>
            Clear Style
          </button>
        </div>
        <Editor
          editorState={this.state.editorState}
          onChange={this.onChange}
          placeholder="This is the editor"
        />
        <button className="btn" onClick={this.saveDoc}>
          Save Document
        </button>
      </div>
    );
  }
}
