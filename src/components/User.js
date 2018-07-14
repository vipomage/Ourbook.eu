import React,{Component} from 'react';

export default class User extends Component {
  render() {
    let result = [];
    let userList = this.props.users;
    for (let user in userList) {
      result.push(
        <div key={user} className="user">
          <div className='user-name-container'>Name:<h3>{userList[user].displayName}</h3></div>
          <div className='user-email-container'>Email:<p>{userList[user].email}</p></div>
          <div className='user-uid-container'>UID:<p>{userList[user].uid}</p></div>
        </div>
      );
    }
    return <div className="user-list">{result}</div>;
  }
}