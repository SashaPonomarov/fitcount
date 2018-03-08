import React, { Component } from 'react';
import './Login.css';
import Paper from 'material-ui/Paper';
import ListItem from 'material-ui/List/ListItem';
import Avatar from 'material-ui/Avatar';
import FlatButton from 'material-ui/FlatButton';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showProfile: false
    }
  }

  toggleProfile = () => {
    this.setState({showProfile: !this.state.showProfile})
  }


  render() {
    const {user, handleLogin, handleLogout} = this.props
    let loginButton = user ?
       <ListItem 
          onClick={this.toggleProfile}
          rightAvatar={<Avatar src={user.photoURL} />}
        >
          <div className="username username-appbar inverted-palette">{user.displayName.split(' ')[0]}</div>
        </ListItem>
      :
        <FlatButton className="inverted-palette" label="Log in" onClick={handleLogin} />

    return (
      <div className="Login">
        {loginButton}
        {this.state.showProfile && 
        <Paper className="Profile">
          <div className="username">{user.displayName}</div>
          <div>{user.email}</div>
          <FlatButton label="Log out" onClick={() => {handleLogout(); this.toggleProfile()}} />
        </Paper>}
      </div>
    );
  }
}

export default Login;