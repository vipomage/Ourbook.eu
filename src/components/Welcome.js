import React, { Component } from 'react';
import {Link} from 'react-router-dom';

export default class Welcome extends Component {
	render() {
		return (
			<div className='welcome-screen-container'>
				<h1>Welcome aboard</h1>
        <h3>Create your first document!</h3>
				<Link className='btn btn-success button' to='/editor/new'>Start!</Link>
			</div>)
	}
}
