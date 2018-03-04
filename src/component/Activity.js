import React, { Component } from 'react';
import './Activity.css';
import {ListItem} from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import IconDelete from 'material-ui/svg-icons/action/delete';
import IconIncrease from 'material-ui/svg-icons/content/add';
import IconDecrease from 'material-ui/svg-icons/content/remove';


class Activity extends Component {
  handleDelete = (e) => {
    e.stopPropagation();
    this.props.removeActivity(this.props.activity.id);
  }
  handleChange = (e) => {
    e.stopPropagation();
    const data = e.currentTarget.dataset
    this.props.changeAmount(this.props.activity.id, data.sign, data.amount);
  }

  render() {
    const {types, activity, time, expanded, expand, id} = this.props;

    return (
      <ListItem id={id} className={"Activity " + (expanded ? "expanded" : "")} onClick={expand}>
        <div className="activity-data">{activity.count} {types[activity.type].name} {time.getHours()}:{time.getMinutes()}</div>
        <div className="activity-actions">
          <IconButton tooltip="Increase" className="increase-button" data-sign="plus" data-amount="5" onClick={this.handleChange}>
            <IconIncrease />
          </IconButton>
          <IconButton tooltip="Decrease" className="decrease-button" data-sign="minus" data-amount="5" onClick={this.handleChange}>
            <IconDecrease />
          </IconButton>
          <IconButton tooltip="Delete" className="delete-button" onClick={this.handleDelete}>
            <IconDelete />
          </IconButton>
          </div>
      </ListItem>
    );
  }
}

export default Activity;