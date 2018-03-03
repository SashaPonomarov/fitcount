import React, { Component } from 'react';
import firebase, { auth, provider } from '../config/firebase';

import 'reset-css/reset.css'
import './App.css';
import Activities from './Activities';
import Login from './Login';
import RaisedButton from 'material-ui/RaisedButton';
import AppBar from 'material-ui/AppBar';
import LinearProgress from 'material-ui/LinearProgress';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';



class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      types: [
        {name: 'Pull-ups'},
        {name: 'Sit-ups'}
      ],
      activities: [],
      user: null,
      loading: true
    };
    this.timeLimit = 5000;
  }

  componentDidMount() {
    this.setState({ loading: true})
    auth.onAuthStateChanged((user) => {
      this.setState({ loading: false})
      if (user) {
        this.setState({ 
          user: {
            photoURL: user.photoURL,
            displayName: user.displayName
          }
        });
      } 
    });

    const activitiesRef = firebase.database().ref('activities');
    activitiesRef.on('value', snapshot => {
      let activities = snapshot.val();
      let activitiesArr = Object.keys(activities).map(id => {
        return {...activities[id], id}
      })
      this.setState({activities: activitiesArr})
    })
  }

  logout() {
    auth.signOut()
      .then(() => {
        this.setState({
          user: null
        });
      });
  }
  login() {
    auth.signInWithRedirect(provider)
  }

  addActivity = (e) => {
    const activitiesRef = firebase.database().ref('activities');

    let time = new Date();
    let type = +e.currentTarget.id;
    let activities = this.sortByTime([...this.state.activities]);
    if (Math.abs(time - activities[0].time) < this.timeLimit && type === activities[0].type) {
      const activityRef = firebase.database().ref(`/activities/${activities[0].id}`);
      activityRef.update({count: activities[0].count + 10});
    } else {
      let newActivity = {count: 10, type: type, time: time.getTime()};
      activitiesRef.push(newActivity);
    }
  }
  removeActivity = (id) => {
    const activityRef = firebase.database().ref(`/activities/${id}`);
    activityRef.remove();
  }
  changeAmount = (id, sign, increment) => {
    if (sign === "minus") {increment = -increment}
    const activityRef = firebase.database().ref(`/activities/${id}`);
    activityRef.once('value').then(snapshot => {
      activityRef.update({count: +increment + snapshot.val().count});
    });
    

  }
  sortByTime(arr) {
    return arr.sort((a, b) => b.time - a.time);
  }
  render() {
    let loginProps = {
      user: this.state.user,
      handleLogin: this.login,
      handleLogout: () => this.logout()
    }
    let activitiesProps = {
      activities: this.state.activities,
      types: this.state.types,
      sortByTime: this.sortByTime, 
      removeActivity: this.removeActivity,
      changeAmount: this.changeAmount
    }
    let addActivityButtons = this.state.types.map((type, i) => {
      return <RaisedButton key={i} id={i} label={type.name} className="AddActivity" onClick={this.addActivity} />
    })
    const mainStyle = {
      color: getMuiTheme().palette.textColor, 
      textAlign: 'center'
    }
    const welcomeBannerStyle = {
      fontSize: '30px', 
      marginTop: '50px'
    }
    return (
      <MuiThemeProvider>
        <div className="App">
          <AppBar title="Fitcount">
            <Login {...loginProps} />
          </AppBar>
          <main style={mainStyle}>
          {this.state.loading ? <LinearProgress mode="indeterminate" /> :
            this.state.user ?
              <section>
                {addActivityButtons}
                <Activities {...activitiesProps} />
              </section> 
              : 
              <h1 style={welcomeBannerStyle}>Welcome, try to login</h1>
          }
          </main>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
