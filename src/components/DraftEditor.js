import "draft-js-inline-toolbar-plugin/lib/plugin.css";
import Editor, { createEditorStateWithText } from "draft-js-plugins-editor";
import createInlineToolbarPlugin, {
  Separator
} from "draft-js-inline-toolbar-plugin";
import React, { Component } from "react";
import { convertToRaw, convertFromRaw, EditorState } from "draft-js";
import createUndoPlugin from "draft-js-undo-plugin";
import firebase from "../firebase";
import editorStyles from "./../styles/editorStyles.css";
import {
  BoldButton,
  createBlockStyleButton,
  HeadlineOneButton,
  HeadlineThreeButton,
  HeadlineTwoButton,
  ItalicButton,
  OrderedListButton,
  UnderlineButton,
  UnorderedListButton
} from "draft-js-buttons";
const undoPlugin = createUndoPlugin();
const { UndoButton, RedoButton } = undoPlugin;
const inlineToolbarPlugin = createInlineToolbarPlugin({
  structure: [
    HeadlineOneButton,
    HeadlineTwoButton,
    HeadlineThreeButton,
    Separator,
    createBlockStyleButton,
    BoldButton,
    ItalicButton,
    UnderlineButton,
    Separator,
    UnorderedListButton,
    OrderedListButton
  ]
});
const { InlineToolbar } = inlineToolbarPlugin;
const plugins = [inlineToolbarPlugin];
export default class MyEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: createEditorStateWithText("This is the editorr"),
      name: this.props.userCollection[this.props.id] || "Document Name",
      document: this.props.userCollection[this.props.id] || null
    };
  }
  getCollection = this.props.getCollection;

  onChange = editorState => this.setState({ editorState });

  focus = () => this.editor.focus();

  addDocument = () => {
    const documentsRef = firebase.database().ref("documents/" + this.props.uid);
    documentsRef
      .push({
        ownderId: this.props.uid,
        author: this.props.user.displayName,
        createdOn: Date.now(),
        data: JSON.stringify(
          convertToRaw(this.state.editorState.getCurrentContent())
        ),
        email: this.props.user.email,
        name: this.state.name
      })
      .then(() => {
        //anotate saved doc
        console.log("Document Saved");
      })
      .catch(e => console.log(e.message));
  };

  componentWillReceiveProps() {
    const editorStateAsJSONString = `{"entityMap":{},"blocks":[{"key":"1qh1g","text":"Header","type":"header-two","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"fthtl","text":"text text text","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}]}`;
    this.setState(
      { document: this.props.userCollection[this.props.id] },
      () => {
        if (this.state.document) {
          let rawData = this.state.document.data;
          console.log(JSON.parse(rawData));
          this.state = {
            editorState: EditorState.createWithContent(
              convertFromRaw(JSON.parse(rawData))
            )
          };
        }
      }
    );
  }

  render() {
    console.log("Editor render called!");
    return (
      <div className="editor-container border text p-4">
        <div className="actions border mb-3">
          <div>
            <input
              onChange={e => {
                this.setState({ name: e.target.value });
              }}
              type="text"
              value={this.state.name}
            />
          </div>
        </div>
        <div className={editorStyles.editor} onClick={this.focus}>
          <Editor
            editorState={this.state.editorState}
            onChange={this.onChange}
            plugins={plugins}
            ref={element => {
              this.editor = element;
            }}
          />
          <InlineToolbar />
          <UndoButton className="ADD_CSS" />
          <RedoButton className="ADD_CSS" />
        </div>
        <button className="btn" onClick={this.addDocument}>
          Save
        </button>
      </div>
    );
  }
}
