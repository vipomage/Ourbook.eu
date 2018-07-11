import React, { Component } from "react";
import ReactQuill from "react-quill";
import firebase from "../firebase";

export default class QuillEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      text: "",
      modules: {
        toolbar: [
          [{ header: [1, 2, false] }],
          ["bold", "italic", "underline", "strike", "blockquote"],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" }
          ],
          ["link", "image"],
          ["clean"]
        ]
      },
      formats: [
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "blockquote",
        "list",
        "bullet",
        "indent",
        "link",
        "image"
      ]
    };
    // You can also pass a Quill Delta here
  }

  handleChange = value => {
    this.setState({ text: value });
  };

  addDocument = () => {
    const documentsRef = firebase
      .database()
      .ref("documents/" + this.props.user.uid);
    documentsRef
      .push({
        ownderId: this.props.user.uid,
        author: this.props.user.displayName,
        createdOn: Date.now(),
        data: this.state.text,
        email: this.props.user.email,
        name: this.state.name
      })
      .then(() => {
        //anotate saved doc
        console.log("Document Saved");
      });
  };

  render() {
    return (
      <div className="editor-container">
        <label htmlFor="docName">Document Name</label>
        <input
          onChange={e => {
            this.setState({ name: e.target.value });
          }}
          type="text"
          value={this.props.name}
        />
        <ReactQuill
          user={this.props.user}
          value={this.props.data}
          onChange={this.handleChange}
          modules={this.state.modules}
          formats={this.state.formats}
        />
        <button onClick={this.addDocument}>Save Doc</button>
        <button onClick={this.getOneDocument}>Load single</button>
      </div>
    );
  }
}
