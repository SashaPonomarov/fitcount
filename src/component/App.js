import React, { Component } from 'react';
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
      activities: [{count: 10, type: 0, time: 1513590761061}, {count: 15, type: 0, time: 1513690761061}, 
      {count: 15, type: 0, time: 1513710761061}, {count: 1, type: 1, time: 1513790761061}, {count: 1, type: 1, time: 1512690761061}]
    }
  }
  addActivity = (e) => {
    let time = new Date();
    let newActivity = {count: 10, type: e.currentTarget.id, time: time.getTime()};
    this.setState({activities: [...this.state.activities, newActivity]});
    console.log(this.state)
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
            <Activities activities={this.state.activities} types={this.state.types} />
          </main>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
