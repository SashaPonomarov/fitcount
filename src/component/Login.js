import React, { Component } from 'react';
import ListItem from 'material-ui/List/ListItem';
import Avatar from 'material-ui/Avatar';
import FlatButton from 'material-ui/FlatButton';

class Login extends Component {


  render() {
    const {user, handleLogin, handleLogout} = this.props
    const appbarStyle = {color: 'white'}
    let loginButton = user ?
       [<ListItem 
          key="0"
          disabled={true}
          style={appbarStyle} 
          leftAvatar={<Avatar src={user.photoURL} />}
        >
          {user.displayName}
        </ListItem>,
        <FlatButton key="1" style={appbarStyle} label="Log out" onClick={handleLogout} />]
      :
        <FlatButton style={appbarStyle} label="Log in" onClick={handleLogin} />

    return (
      <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
        {loginButton}
      </div>
    );
  }
}

export default Login;