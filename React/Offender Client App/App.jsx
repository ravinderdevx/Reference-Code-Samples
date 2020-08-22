import React, { Component } from 'react';

import { history } from './helpers';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { apiService } from './services/api.service';
import * as actions from './store/actions';
import AppLayout from './shared/layouts/AppLayout';
import ReactGA from 'react-ga';
import { GOOGLE_ANALYTICS_TRACKINGID } from './config/api.config'
const withoutHeaderFooterRoutes = ['/account/login', '/account/changepassword'];

ReactGA.initialize(GOOGLE_ANALYTICS_TRACKINGID);
history.listen((location, action) => {
  ReactGA.pageview(location.pathname + location.search);
  ReactGA.set({ page: window.location.pathname + window.location.search });
});
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showHeaderFooter: withoutHeaderFooterRoutes.indexOf(window.location.pathname) === -1
    }
  }
  componentDidMount() {
    this.setState({ showHeaderFooter: withoutHeaderFooterRoutes.indexOf(window.location.pathname) === -1 });
    history.listen((location, action) => {
      this.setState({ showHeaderFooter: withoutHeaderFooterRoutes.indexOf(window.location.pathname) === -1 });
    });
    const { auth } = this.props;
    if (auth.loggedIn) {
      if (auth.user.IsStaffLogin) {
        window.addEventListener("beforeunload", (ev) => {
          ev.preventDefault();
          apiService.logout();
          this.props.actions.logout();
        });
    }
  }
}


  render() {
    const { showHeaderFooter } = this.state;
    return (
      <AppLayout showHeaderFooter={showHeaderFooter} />
    );
  }
}


const mapStateToProps = state => {
  return {
    alert: state.alert,
    auth: state.auth
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: {
      logout: bindActionCreators(
        actions.logout,
        dispatch
      ),
      hideAlert: bindActionCreators(
        actions.hideAlert,
        dispatch
      ),
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(App);

