import React, { Component } from "react";
import ReactQuill from "react-quill";
import firebase from "../firebase";

export default class QuillEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      text: this.props.id !== ''? this.props.id: "",
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
    }; // You can also pass a Quill Delta here
  }

  handleChange = value => {
    this.setState({ text: value });
  };

  addDocument = () => {
    const documentsRef = firebase.database().ref("documents/" + this.props.uid);
    documentsRef
      .push({
        ownderId: this.props.uid,
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

  getOneDocument = (props) => {
    firebase
      .database()
      .ref(`documents/${this.props.user.uid}/${props.id}`)
      .once("value")
      .then(obj => {
        console.log(obj);
        let data = obj.val();
        console.log(data);
        this.setState({ text: data });
      });
  };
 
  render() {
    
    console.log("render() of Editor called");
    return (
      <div className="editor-container">
        <label htmlFor="docName">Document Name</label>
        <input
          onChange={e => {
            this.setState({
              name: e.target.value
            });
          }}
          id="docName"
          type="text"
          value={this.state.name}
        />
        <ReactQuill
          value={this.state.text}
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
