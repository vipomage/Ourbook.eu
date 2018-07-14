import React, { Component } from 'react';
import firebase from '../firebase';
import UserCollection from './UserCollection'
import User from './User'

export default class AdminPanel extends Component {
	constructor(props) {
		super(props);
		this.state = {
			collection: {}
		};
	}

	getEveryDocumentInDatabase = () => {
		firebase
			.database()
			.ref('documents')
			.on('value', data => {
				let out = [];
				let USERS = data.val();
				for (let userKey in USERS) {
					for (let userDoc in USERS[userKey]) {
						out[userDoc] = USERS[userKey][userDoc];
					}
				}
				this.setState({ collection: out });
			});
	};

	getEveryUser = () => {
		firebase
			.database()
			.ref('users')
			.on('value', data => {
				let users = data.val();
				this.setState({ users });
			});
	};

	componentDidMount() {
		this.getEveryDocumentInDatabase();
		this.getEveryUser();
	}

	render() {
		return (
			<div className="admin-panel-container">
				<div className="documents-container">
					<h3>Documents in DB</h3>
					<UserCollection userCollection={this.state.collection} />
				</div>
				<div className="user-container">
					<h3>Registered Users</h3>
					<User users={this.state.users} />
				</div>
			</div>
		);
	}
}
