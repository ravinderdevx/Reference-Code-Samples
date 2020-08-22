import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
// Custom components
import AccountSummary from "../../containers/home/account_summary";
import TodayAgenda from "../../containers/home/todayagenda";
import Reminders from "../../containers/home/reminders";
import RecentActivity from "../../containers/home/recentactivity";
import Announcements from "../../containers/home/announcements";
import * as actions from "../../store/actions";

class Home extends Component {
  render() {
    return (
      <div className="row">
        <div className="col-md-6 col-sm-12">
          <TodayAgenda />
        </div>
        <div className="col-md-6 col-sm-12">
          <Announcements />
        </div>
        <div className="col-md-6 col-sm-12">
          <AccountSummary />
        </div>
        <div className="col-md-6 col-sm-12">
          <Reminders />
        </div>
        <div className="col-md-6 col-sm-12">
          <RecentActivity />
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    actions: {
      loginSuccess: bindActionCreators(actions.loginSuccess, dispatch),
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Home);
