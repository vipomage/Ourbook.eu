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
  saveDocToUsrCollectionAndDocumentCollection = () => {
    const userCollectionsRef = firebase.database().ref(`users/${this.props.uid}/props/collections`);
    const globalCollectionRef = firebase.database().ref("documents");
    userCollectionsRef.once("value").then(data => {
      const newItemKey = globalCollectionRef.push().key;
      let parsed = JSON.parse(data.val());
      parsed.push(newItemKey);
      let obj = {};
      obj['data'] = JSON.stringify(convertToRaw(this.state.editorState.getCurrentContent()));
      obj['name'] = this.state.docName;
      obj['author'] = this.props.user.displayName;
      obj['email'] = this.props.user.email;
      obj['createdOn'] = Date.now();
      globalCollectionRef.push(obj).then(() => {
        userCollectionsRef.set(JSON.stringify(parsed)).then(() => {
          //todo annotate item saved
        });
      });
    });
  };
  
  addToCollection = ()=>{
    const userCollectionsRef = firebase.database().ref(`users/${this.props.uid}/props/collections`);
    const globalCollectionRef = firebase.database().ref("documents");
    globalCollectionRef.add({
      data:JSON.stringify(convertToRaw(this.state.editorState.getCurrentContent())),
      name:this.state.docName,
      author:this.props.user.displayName,
      email:this.props.user.email,
      createdOn:Date.now()
    }).then(res=>console.log(res))
  }
  
  render() {
    return (
      <div className="editor border text p-4">
        <div className="actions border mb-3">
          <div><p>Document Name: </p><input onChange={(e)=>{
            this.setState({docName:e.target.value})
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
        <button className="btn" onClick={this.saveDocToUsrCollectionAndDocumentCollection}>
          Save Document
        </button>
      </div>
    );
  }
}
