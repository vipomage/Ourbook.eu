import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class SidebarNavigation extends Component {
	render() {
		return (
			<nav className="side-nav">
				<Link className="btn btn-primary" to="/">
					Home
				</Link>
				<Link className="btn btn-primary" to="/editor/new">
					Blank Document
				</Link>
        {this.props.isAdmin ? <Link to='/adminPanel' className='btn btn-danger'>Admin CP</Link>:''}
			</nav>
		);
	}
}
