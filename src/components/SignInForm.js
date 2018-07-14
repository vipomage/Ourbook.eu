import React, { Component } from 'react';

export default class SignInForm extends Component {
	render() {
		return (
			<div className="wrapper sign-in">
				<h1>Ourbook.eu</h1>
        <h4 className='web-info'>Ourbook is website for creating collaborative documents wich you can shoot across web or share with your friends or colleagues or whatever you name it </h4>
				<h6>Not so fancy ha? <br/>P.S. They update in real-time!</h6>
				<button
					onClick={this.props.login}
					className="btn btn-block btn-social btn-google"
				>
					<span className="fa fa-google"> </span> Sign in with Google
				</button>
				<p className="mt-5 mb-3 text-muted text-center">
					© 2017-2018 Ourbook.eu
				</p>
			</div>
		);
	}
}
