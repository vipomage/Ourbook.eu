import React, { Component } from "react";

import {db} from "./../firebase";
import { Editor, EditorState, RichUtils, convertToRaw } from "draft-js";

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
  }
  saveDoc = () => {
    let data = JSON.stringify(
      convertToRaw(this.state.editorState.getCurrentContent())
    );
    db.ref(this.props.uid + "/").set(data);
    console.log(data + "\nSaved");
  };

  render() {
    return (
      <div className="editor border text p-4">
        <div className="actions border mb-3">
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
        <button className="btn" onClick={this.saveDoc}>
          Save Document
        </button>
      </div>
    );
  }
}
