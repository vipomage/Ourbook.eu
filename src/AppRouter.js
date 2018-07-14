import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import firebase from './firebase';
import $ from 'jquery';
import { NotificationManager } from 'react-notifications';
import Welcome from './components/Welcome';
import ReactQuill from 'react-quill';
import AdminPanel from './components/AdminPanel'


export default class AppRouter extends Component {
	constructor(props) {
		super(props);
		this.state = {
			text: '',
			document: {
				name: '',
				data: '',
				author: '',
				createdOn: '',
				email: '',
				ownerId: ''
			},
			docId: null,
			shareEmail: ''
		};
	}

	render() {
		return (
			<Switch className='switch'>
				<Route
					path="/documents/:id"
					props={{ ...this }}
					component={EditorComponent}
				/>
				<Route
					path="/editor/new"
					props={{ ...this }}
					component={EmptyEditorComponent}
				/>
				<Route path="/adminPanel" exact={true} component={AdminPanel} />
				<Route component={Welcome} />
			</Switch>
		);
	}
}

class EditorComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			text: '',
			document: {
				name: '',
				data: '',
				author: '',
				createdOn: '',
				email: '',
				ownerId: ''
			},
			docId: '',
			user: firebase.auth().currentUser
		};
		this.handleChange = this.handleChange.bind(this);
		this.toolbarOptions = [
			['bold', 'italic', 'underline', 'strike'], // toggled buttons
			['blockquote', 'code-block'],

			[{ header: 1 }, { header: 2 }], // custom button values
			[{ list: 'ordered' }, { list: 'bullet' }],
			[{ script: 'sub' }, { script: 'super' }], // superscript/subscript
			[{ indent: '-1' }, { indent: '+1' }], // outdent/indent
			[{ direction: 'rtl' }], // text direction

			[{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
			[{ header: [1, 2, 3, 4, 5, 6, false] }],

			[{ color: [] }, { background: [] }], // dropdown with defaults from theme
			[{ font: [] }],
			[{ align: [] }],

			['clean'] // remove formatting button
		];
	}

	createNotification = (type, message) => {
		return (() => {
			switch (type) {
				case 'info':
					NotificationManager.info(message);
					break;
				case 'success':
					NotificationManager.success(message);
					break;
				case 'warning':
					// noinspection JSUnresolvedFunction
					NotificationManager.warning(message);
					break;
				case 'error':
					NotificationManager.error(message);
					break;
				default:
					NotificationManager.error('Something is Wrong');
			}
		})();
	};

	findUserId = email => {
		return new Promise((resolve, reject) => {
			let ref = firebase.database().ref('users');
			ref.once('value').then(data => {
				let users = data.val();
				for (const user in users) {
					if (users[user].email === email) {
						resolve(users[user].uid);
					}
				}
				reject(null);
			});
		});
	};

	toggleShareInput = () => {
		$('#share-input').toggle();
	};

	createShare = () => {
		let userEmail = this.state.shareEmail;
		this.findUserId(userEmail)
			.then(userId => {
				if (userId) {
					let obj = {};
					obj[userId] = userEmail;
					firebase
						.database()
						.ref(
							`documents/${this.state.user.uid}/${this.state.docId}/sharedWith`
						)
						.set(obj)
						.then(() => {
							this.toggleShareInput();
							this.createNotification('success', 'Document Shared!');
						})
						.catch(e => this.createNotification('error', e.message));
				} else {
					this.createNotification('error', 'User not found!');
				}
			})
			.catch(() => this.createNotification('error', 'User not found!'));
	};

	getDocumentFromDB = props => {
		return new Promise(resolve => {
			firebase
				.database()
				.ref(`documents`)
				.on('value', dataSnap => {
					let users = dataSnap.val();
					for (let userKey in users) {
						let documents = users[userKey];
						for (let documentsKey in documents) {
							if (documentsKey === props.match.params.id) {
								let document = documents[documentsKey];
								this.handleChange(document.data);
								return resolve(document);
							}
						}
					}
				});
		});
	};

	saveDocument = () => {
		$('#new-name-input').hide();
		let obj = {
			ownerId: this.state.user.uid,
			author: this.state.user.displayName,
			createdOn: Date.now(),
			data: this.state.text,
			email: this.state.document.email,
			name: this.state.name ? this.state.name : this.state.document.name
		};
		if (this.state.document.name === '') {
			this.createNotification('error', 'Please provide document name');
			$('input#document-name').css({ outline: '1px solid red' });
		} else {
			$('input#document-name').css({ outline: '0px solid red' });
			let docRef = `documents/${this.state.user.uid}`;
			if (!this.state.docId) {
				firebase
					.database()
					.ref(docRef)
					.push(obj)
					.catch(e => this.createNotification('error', e.message));
			} else {
				obj.author = this.state.document.author;
				obj.createdOn = this.state.document.createdOn;
				obj.lastEdit = Date.now();
				obj.editor = this.state.user.email;

				firebase
					.database()
					.ref(`documents/${this.state.document.ownerId}/${this.state.docId}`)
					.update(obj)
					.catch(e =>
						this.createNotification(
							'error',
							'You are not allowed to save on this document!'
						)
					);
			}
		}
	};

	deleteItem = () => {
		let quest = window.confirm('Do you really want to delete the Document?');
		if (quest)
			firebase
				.database()
				.ref(`documents/${this.state.document.ownerId}/${this.state.docId}`)
				.remove(() => {
					this.createNotification('success', 'Document Deleted');
					window.history.back();
				})
				.catch(e =>
					this.createNotification('error', e.message || 'Something is Wrong')
				);
	};

	componentDidMount() {
		this.getDocumentFromDB(this.props).then(document => {
			this.setState({
				text: document.data,
				document: document,
				docId: this.props.match.params.id
			});
		});
	}

	componentDidUpdate(prevP, prevS, snap) {
		if (JSON.stringify(prevP) !== JSON.stringify(this.props)) {
			this.getDocumentFromDB(this.props).then(document => {
				this.setState({
					text: document.data,
					document: document,
					docId: this.props.match.params.id
				});
			});
		}
	}

	handleChange(value) {
		this.setState({ text: value });
	}

	render() {
		return (
			<div className="editor-container">
				<div className="doc-details">
					<p className='document-name'
						onClick={() => {
							$('#new-name-input').show();
						}}
					>
						Name: <strong>{this.state.document.name}</strong>
						<input
              className='new-name-input-field'
							id="new-name-input"
							style={{ display: 'none' }}
							onChange={e => {
								this.setState({ name: e.target.value });
							}}
							type="text"
							placeholder="New Name"
						/>
					</p>
					<p className='created-on-date'>
						Created:{' '}
						<strong>
							{new Date(this.state.document.createdOn).toDateString()}
						</strong>
					</p>
					<p className='author-email'>
						Author: <strong>{this.state.document.email}</strong>
					</p>
					<p className='last-edit editor-email'>
						Last Edit:<strong>
							{this.state.document.lastEdit
								? new Date(this.state.document.lastEdit).toDateString()
								: 'N/A'}
						</strong>
						<br />
						Editor:<strong>{this.state.document.editor?this.state.document.editor:'N/A'}</strong>
					</p>
          <div className="buttons-container">
            <button className="btn btn-warning button share-button" onClick={this.toggleShareInput}>
              Share
            </button>
            <button
              onClick={this.deleteItem}
              className="btn btn-danger button delete-button"
            >
              Delete
            </button>
          </div>
				</div>
				<div id="share-input">
					<input
						onChange={e => {
							this.setState({ shareEmail: e.target.value });
						}}
						type="email"
						placeholder="user email"
					/>
					<button className="btn btn-primary button create-share-button" onClick={this.createShare}>
						Create Share
					</button>
				</div>
				<ReactQuill
          className='react-quill-editor'
					modules={{ toolbar: this.toolbarOptions }}
					value={this.state.text}
					onChange={this.handleChange}
				/>
				<button className='btn btn-primary button save-button' onClick={this.saveDocument}>Save Doc</button>
			</div>
		);
	}
}

class EmptyEditorComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			text: '',
			document: {
				name: '',
				data: '',
				author: '',
				createdOn: '',
				email: '',
				ownerId: ''
			},
			docId: '',
			user: firebase.auth().currentUser
		};
		this.handleChange = this.handleChange.bind(this);
		this.toolbarOptions = [
			['bold', 'italic', 'underline', 'strike'], // toggled buttons
			['blockquote', 'code-block'],

			[{ header: 1 }, { header: 2 }], // custom button values
			[{ list: 'ordered' }, { list: 'bullet' }],
			[{ script: 'sub' }, { script: 'super' }], // superscript/subscript
			[{ indent: '-1' }, { indent: '+1' }], // outdent/indent
			[{ direction: 'rtl' }], // text direction

			[{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
			[{ header: [1, 2, 3, 4, 5, 6, false] }],

			[{ color: [] }, { background: [] }], // dropdown with defaults from theme
			[{ font: [] }],
			[{ align: [] }],

			['clean'] // remove formatting button
		];
	}

	createNotification = (type, message) => {
		return (() => {
			switch (type) {
				case 'info':
					NotificationManager.info(message);
					break;
				case 'success':
					NotificationManager.success(message);
					break;
				case 'warning':
					// noinspection JSUnresolvedFunction
					NotificationManager.warning(message);
					break;
				case 'error':
					NotificationManager.error(message);
					break;
				default:
					NotificationManager.error('Something is Wrong');
			}
		})();
	};

	saveDocument = () => {
		let obj = {
			ownerId: this.state.user.uid,
			author: this.state.user.displayName,
			createdOn: Date.now(),
			data: this.state.text,
			email: this.state.user.email,
			name: this.state.document.name
		};
		let docRef = `documents/${this.state.user.uid}`;
		if (this.state.document.name === '') {
			this.createNotification('error', 'Please provide document name');
			$('input#document-name').css({ outline: '1px solid red' });
		} else {
			$('input#document-name').css({ outline: '0px solid red' });
			if (!this.state.docId) {
				firebase
					.database()
					.ref(docRef)
					.push(obj)
					.then(() => {});
			} else {
				obj.createdOn = this.state.document.createdOn;
				obj.lastEdit = Date.now();
				firebase
					.database()
					.ref(`${docRef}/${this.state.docId}`)
					.update(obj)
					.then(() => {});
			}
		}
	};

	handleChange(value) {
		this.setState({ text: value });
	}

	render() {
		return (
			<div className="editor-container">
				
				<input
          className='document-name-input'
					id="document-name"
					onChange={e => this.setState({ document: { name: e.target.value } })}
					placeholder="Document Name"
					type="text"
				/>

				<ReactQuill
          className='react-quill-editor'
					modules={{ toolbar: this.toolbarOptions }}
					value={this.state.text}
					onChange={this.handleChange}
				/>
				<button className='btn btn-primary button save-document-button' onClick={this.saveDocument}>Save Doc</button>
			</div>
		);
	}
}