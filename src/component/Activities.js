import './Activities.css';
import React, { Component } from 'react';
import Paper from 'material-ui/Paper';


class Activities extends Component {

  sortByTime(arr) {
    return arr.sort((a, b) => b.time - a.time);
  }

  render() {
    const types = this.props.types;
    let prevDate = '';
    let activities = [];
    let activitiesData = this.sortByTime(this.props.activities);
    activitiesData.forEach((activity, i) => {
      let time = new Date(activity.time);
      if (time.toDateString() !== prevDate) {
        prevDate = time.toDateString();
        activities.push(<span key={"date"+i}>{prevDate}</span>);
      }
      activities.push(<li key={i}>{activity.count} {types[activity.type].name} {time.getHours()}:{time.getMinutes()}</li>);
    })
    return (
      <Paper className="Activities"> 
        <ul>
          {activities}
        </ul>
      </Paper>
    );
  }
}

export default Activities;