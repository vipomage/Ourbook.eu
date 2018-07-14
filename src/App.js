import React, { Component } from 'react';
import './App.css';
import { provider } from './firebase';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import 'react-quill/dist/quill.snow.css';
import 'react-notifications/lib/notifications.css';
import SignInForm from './components/SignInForm';
import Sidebar from './components/Sidebar';
import AppRouter from './AppRouter';
import {
	NotificationContainer,
	NotificationManager
} from 'react-notifications';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			uid: '',
			user: firebase.auth().currentUser,
			userCollection: {},
			sharedDocs: {},
			text: ''
		};
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

	setText = value => {
		this.setState({ text: value });
	};

	authHandler = authData => {
		let user = authData.user || authData;
		const userRef = firebase.database().ref('users/' + user.uid);
		userRef.once('value').then(data => {
			let userData = data.val();
			if (!userData) {
				let uid = user.uid;
				let obj = {};
				obj[uid] = {
					displayName: user.displayName,
					email: user.email,
					uid
				};
				firebase
					.database()
					.ref('users')
					.update(obj)
					.then(() => {
						firebase.database().goOnline();
						this.setState({
							uid: user.uid
						});
					})
					.catch(e => this.createNotification('error', e.message));
			} else {
				this.setState({
					uid: user.uid,isAdmin:userData.admin||false
				});
			}
		});
	};

	authenticate = () => {
		firebase
			.auth()
			.signInWithPopup(provider)
			.then(e => {
				this.createNotification('success', 'Login Success');
				this.authHandler(e);
			})
			.catch(e => this.createNotification('error', e.message));
	};

	logout = () => {
		firebase
			.auth()
			.signOut()
			.then(() => {
				firebase.database().goOffline();
				this.setState({
					uid: '',
					userCollection: '',
					user: firebase.auth().currentUser,
					text: ''
				});
			})
			.then(() => this.createNotification('info', 'Log Out Success'))
			.catch(e => this.createNotification('error', e.message));
	};

	getUserDocs = () => {
		let user = firebase.auth().currentUser;
		firebase
			.database()
			.ref(`documents/${user.uid}`)
			.on('value', userData => {
				let value = userData.val();
        this.setState({
					userCollection: value
				});
			});
	};

	getSharedDocs = () => {
		let user = firebase.auth().currentUser;
		firebase
			.database()
			.ref('documents')
			.on('value', updatedDocs => {
				let docs = updatedDocs.val();
				let sharedDocs = {};
				for (let valKey in docs) {
					let document = docs[valKey];
					for (let docKey in document) {
						// noinspection JSUnresolvedVariable
						let sharedIds = document[docKey].sharedWith;
						if (sharedIds && sharedIds.hasOwnProperty(user.uid)) {
							sharedDocs[docKey] = document[docKey];
						}
					}
				}
				this.setState({ sharedDocs });
			});
	};

	componentDidMount() {
		firebase.auth().onAuthStateChanged(user => {
			if (user) {
				this.authHandler(user);
				this.setState({ user: user });
				this.getUserDocs();
				this.getSharedDocs();
			}
		});
	}

	render() {
		if (!this.state.user) {
			return (
				<div>
					<NotificationContainer />
					<SignInForm {...this.state} login={this.authenticate} />
				</div>
			);
		} else {
			return (
				<div className="container">
					<Sidebar
						displayName={this.state.user.displayName}
						img={this.state.user.photoURL}
						logout={this.logout}
						userCollection={this.state.userCollection}
						sharedDocs={this.state.sharedDocs}
						uid={this.state.uid}
					/>
					<main>
						<NotificationContainer />
						<AppRouter
							createNotification={this.createNotification}
							textContainer={this.state.text}
							input={this.setText}
							uid={this.state.uid}
							user={this.state.user}
							userCollection={this.state.userCollection}
						/>
					</main>
				</div>
			);
		}
	}
}

export default App;
