import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import ReminderGrid from '../reminders/reminder_grid';

import { apiService } from "../../services/api.service";
import * as actions from "../../store/actions";
import { bindActionCreators } from "redux";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`
  };
}

class ReminderTabs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      classes: makeStyles(theme => ({
        root: {
          flexGrow: 1,
          backgroundColor: theme.palette.background.paper
        }
      }
      )),
      remindersclienttasks: [],
      isLoading: true
    };
  }

  handleChange = (event, newValue) => {
    this.setState({ value: newValue });
  };

  handleShowAlert = data => {
    this.props.actions.showAlert(data);
  };
  GetClientTasks = () => {
    const { auth } = this.props;
    let data = { ClientId: auth.user.ClientId, Id: -1, Completed: "", DueDate: "" };
    apiService.post("GETCLIENTTASKS", data).then(
      response => {
        if (response.Success && response.ClientTasks) {
          var clienttasks = response.ClientTasks;
          this.setState({ remindersclienttasks: clienttasks });
        }
        this.setState({ isLoading: false });
      },
      error => {
        this.setState({ isLoading: false });
        this.props.actions.showAlert({ message: error, variant: "error" });
      }
    );
  };

  completeStatus = (e, event) => {
    const { auth } = this.props
    let data = { Id: event.Id, Completed: event.Completed === 'Y' ? 'N' : 'Y' };
    if (auth.user.IsStaffLogin)
            {
              data.ModifyBy = auth.user.StaffUserName;
            }
    apiService.post("UPDATECLIENTTASK", data).then(
      response => {
        if (response.Success) {
          this.setState({ isLoading: false });
          this.props.actions.showAlert({ message: "Record updated successfully", variant: "success" });
          this.GetClientTasks();
        }
        else {
          this.setState({ isLoading: false });
          this.props.actions.showAlert({ message: response.Message, variant: "error" });
        }
      },
      error => {
        this.setState({ isLoading: false });
        this.props.actions.showAlert({ message: error, variant: "error" });
      }
    );

  };

  componentDidMount() {
    this.GetClientTasks();
  }
  render() {
    const { value, classes, remindersclienttasks, isLoading } = this.state;
    var completedReminderData = [];
    var uncompletedReminderData = [];

    remindersclienttasks.map((item, key) =>
      remindersclienttasks[key].Completed === 'Y' ? completedReminderData.push(remindersclienttasks[key]) : ""
    );

    remindersclienttasks.map((item, key) =>
      remindersclienttasks[key].Completed === 'N' ? uncompletedReminderData.push(remindersclienttasks[key]) : ""
    );

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Tabs value={value} onChange={this.handleChange}>
            <Tab label="Not-Completed" {...a11yProps(0)} />
            <Tab label="Completed " {...a11yProps(1)} />
          </Tabs>
        </AppBar>
        <TabPanel value={value} index={0}>
          <ReminderGrid remindersclienttasks={uncompletedReminderData} oncheckboxchange={this.completeStatus} isLoading={isLoading} onShowAlert={this.handleShowAlert} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <ReminderGrid remindersclienttasks={completedReminderData} oncheckboxchange={this.completeStatus} isLoading={isLoading} onShowAlert={this.handleShowAlert} />
        </TabPanel>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth
  };
};
const mapDispatchToProps = dispatch => {
  return {
    actions: {
      showAlert: bindActionCreators(actions.showAlert, dispatch)
    }
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ReminderTabs);
