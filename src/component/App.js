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
      // activities: [{count: 10, type: 0, time: 1513590761061}, {count: 15, type: 0, time: 1513690761061}, 
      // {count: 15, type: 0, time: 1513710761061}, {count: 1, type: 1, time: 1513790761061}, {count: 3, type: 1, time: 1512690761061}]
      activities: []
    };
    this.timeLimit = 5000;
  }

  componentDidMount() {
    const activitiesRef = firebase.database().ref('activities');
    activitiesRef.on('value', snapshot => {
      this.setState({activities: Object.values(snapshot.val())})
    })
  }

  addActivity = (e) => {
    const activitiesRef = firebase.database().ref('activities');

    let time = new Date();
    let type = +e.currentTarget.id;
    let activities = this.sortByTime([...this.state.activities]);
    if (Math.abs(time - activities[0].time) < this.timeLimit && type === activities[0].type) {
      activities[0].count += 10;
      this.setState({activities});
    } else {
      let newActivity = {count: 10, type: type, time: time.getTime()};
      activitiesRef.push(newActivity);
      // this.setState({activities: [...activities, newActivity]});
    }
  }
  removeActivity = (id) => {
    this.setState({activities: this.state.activities.filter((a, i) => i !== id )});
  }
  changeAmount = (id, sign, amount) => {
    let newActivities = [...this.state.activities];
    if (sign === "minus") {amount = -amount}
    newActivities[id].count += +amount;
    if (newActivities[id].count < 0) {newActivities[id].count = 0}
    this.setState({activities: newActivities});
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
