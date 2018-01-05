import React, { Component } from 'react';
import firebase from '../config/firebase';

import './App.css';
import Activities from './Activities';
import RaisedButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      types: [
        {name: 'Pull-ups'},
        {name: 'Sit-ups'}
      ],
      activities: []
    };
    this.timeLimit = 5000;
  }

  componentDidMount() {
    const activitiesRef = firebase.database().ref('activities');
    activitiesRef.on('value', snapshot => {
      let activities = snapshot.val();
      let activitiesArr = Object.keys(activities).map(id => {
        return {...activities[id], id}
      })
      this.setState({activities: activitiesArr})
    })
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
    return (
      <MuiThemeProvider>
        <div className="App">
          <header className="App-header">
            <h1 className="App-title">Fitcount</h1>
          </header>
          <main>
            <RaisedButton id="0" label="Pull-ups" className="AddActivity" onClick={this.addActivity} />
            <RaisedButton id="1" label="Sit-ups" className="AddActivity" onClick={this.addActivity} />
            <Activities activities={this.state.activities} types={this.state.types} 
                        sortByTime={this.sortByTime} removeActivity={this.removeActivity} changeAmount={this.changeAmount} />
          </main>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
