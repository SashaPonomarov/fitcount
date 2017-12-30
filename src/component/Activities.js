import './Activities.css';
import Activity from './Activity';
import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import {List} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';

class Activities extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false
    }
  }
  expand = (e) => {
    this.setState({expanded: +e.currentTarget.id});
  }

  render() {
    const {types, removeActivity, changeAmount} = this.props;
    let prevDate = '';
    let activities = [];
    let activitiesData = this.props.sortByTime(this.props.activities);
    activitiesData.forEach((activity, i) => {
      let time = new Date(activity.time);
      if (time.toDateString() !== prevDate) {
        prevDate = time.toDateString();
        activities.push(<Subheader key={"date"+i}>{prevDate}</Subheader>);
      }
      let activityProps = {
        key: i,
        id: i, 
        expanded: i===this.state.expanded,
        types, activity, time, 
        expand: this.expand,
        removeActivity, changeAmount
      }
      activities.push(<Activity {...activityProps} />);
    })
    return (
      <Paper className="Activities"> 
        <List>
          {activities}
        </List>
      </Paper>
    );
  }
}

export default Activities;