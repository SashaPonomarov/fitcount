import React, { Component } from 'react';
import firebase, { auth, provider } from '../config/firebase';

import 'reset-css/reset.css'
import './App.css';
import Activities from './Activities';
import Login from './Login';

import {deepOrange500, deepOrange700} from 'material-ui/styles/colors';

import RaisedButton from 'material-ui/RaisedButton';
import AppBar from 'material-ui/AppBar';
import LinearProgress from 'material-ui/LinearProgress';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: deepOrange500,
    primary2Color: deepOrange700
  }
})

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      types: [
        {name: 'Pull-ups', defaultCount: 30},
        {name: 'Sit-ups', defaultCount: 30},
        {name: 'Push-ups', defaultCount: 10}
      ],
      activities: [],
      user: null,
      userActivitiesRef: null,
      loading: true
    }
    this.timeLimit = 10000
  }

  componentDidMount() {
    this.setState({ loading: true})
    

    auth.onAuthStateChanged((user) => {
      this.setState({ loading: false})
      if (user) {
        this.setState({ 
          user: {
            photoURL: user.photoURL,
            displayName: user.displayName, 
            email: user.email,
            uid: user.uid
          }
        })
        let userActivitiesRef = firebase.database().ref('/activities/' + user.uid)
        this.setState({userActivitiesRef})
        userActivitiesRef.on('value', snapshot => {
          let activities = snapshot.val()
          if (!activities) {
            activities = {}
          }
          let activitiesArr = Object.keys(activities).map(id => {
            return {...activities[id], id}
          })
          this.setState({activities: activitiesArr})
        })
      }
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
    let time = new Date();
    let type = +e.currentTarget.id
    let count = this.state.types[type].defaultCount
    let activities = this.sortByTime([...this.state.activities])
    if ((activities.length) && 
        (Math.abs(time - activities[0].time) < this.timeLimit && 
        type === activities[0].type)) {
          this.state.userActivitiesRef.child(`${activities[0].id}/count`)
            .transaction(currentCount => currentCount + count)
    } 
    else {
      let newActivity = {count: count, type: type, time: time.getTime()}
      this.state.userActivitiesRef.push(newActivity);
    }
  }
  removeActivity = (id) => {
    this.state.userActivitiesRef.child(id).remove()
  }
  changeAmount = (id, sign, increment) => {
    if (sign === "minus") {increment = -increment}
    this.state.userActivitiesRef.child(`${id}/count`)
      .transaction(currentCount => {
        let newCount = +increment + currentCount
        if (newCount > 0) {return newCount}
        else {this.removeActivity(id)}
      })
      
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
      <MuiThemeProvider muiTheme={muiTheme}>
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
