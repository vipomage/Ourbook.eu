import React, { Component } from "react";
import ReactQuill from "react-quill";
import firebase from "../firebase";

export default class QuillEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
    }; // You can also pass a Quill Delta here
  }

  saveDocToUsrCollectionAndDocumentCollection = () => {
    const userCollectionsRef = firebase
      .database()
      .ref(`users/${this.props.uid}/props/collections`);
    const globalCollectionRef = firebase.database().ref("documents");
    userCollectionsRef.once("value").then(data => {
      const newItemKey = globalCollectionRef.push().key;
      let parsed = JSON.parse(data.val());
      debugger;
      parsed.push(newItemKey);
      let obj = {};
      obj["data"] = this.state.text;
      obj["author"] = this.props.user.displayName;
      obj["email"] = this.props.user.email;
      obj["createdOn"] = Date.now();
      globalCollectionRef.push(obj).then(() => {
        userCollectionsRef.set(JSON.stringify(parsed)).then(() => {
          //todo annotate item saved
        });
      });
    });
  };

  getUserCollection = () => {
    firebase
      .database()
      .ref(`users/${this.props.uid}/props/collections`)
      .once("value")
      .then(data => data.val())
      .then(evaluatedData => JSON.parse(evaluatedData))
      .then(parsedData => {
        console.log(parsedData);
        return parsedData;
      });
  };
  
  getOneDocument=()=>{
    firebase.database().ref('documents').once('value').then(obj=>{
      console.log(obj)
      let data = obj.val();
      console.log(data)
      let text = data["-LGjKNjX0mQ8oq6kaFqh"];
      console.log(text)
      this.setState({text:text.data})
      
      //todo
    })
  };

  handleChange = value => {
    this.setState({ text: value });
  };

  render() {
    return (
      <div className="editor">
        <ReactQuill
          value={this.state.text}
          onChange={this.handleChange}
          modules={this.state.modules}
          formats={this.state.formats}
        />
        <button onClick={this.saveDocToUsrCollectionAndDocumentCollection}>
          Save Doc
        </button>
        <button onClick={this.getUserCollection}>Load</button>
        <button onClick={this.getOneDocument}>Load single</button>
      </div>
    );
  }
}
