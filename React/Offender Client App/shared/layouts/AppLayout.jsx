import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Router, Switch, Route, Redirect } from "react-router-dom";
import { history } from "../../helpers/history";
import PrivateRoute from '../components/functional/PrivateRoute';
import IdleTimer from 'react-idle-timer';
import Alert from '../components/ui/alert'
import * as actions from '../../store/actions';
import AppHeader from './headers/AppHeader';
import AppFooter from './footers/AppFooter';
import appRoutes from '../../routes/app';
import { bindActionCreators } from 'redux';
import { apiService } from '../../services/api.service';
import { localStorageService } from '../../services';
import { TIMEOUT_IN_MINUTES } from '../../config/api.config';
import NotFound from "../../containers/errorpages/NotFound";

class AppLayout extends Component {
    constructor(props) {
        super(props)
        this.idleTimer = null
        this.onAction = this._onAction.bind(this)
        this.onActive = this._onActive.bind(this)
        this.onIdle = this._onIdle.bind(this)
        this.state = {
            showMenu: false,
            notifications: {}
        };
    }

    _onAction(e) {
        const { auth } = this.props;
        //console.log('user did something', e);
        if (auth.loggedIn) {
            localStorageService.SetExpiresAtInMinutes();
        }
    }

    _onActive(e) {
    }

    _onIdle(e) {
        //console.log('user is idle');
        this.handleLogout();
    }


    handleToggleMenu = (e) => {

        this.setState({
            showMenu: !this.state.showMenu,
        })
    }

    handleLogout = (e) => {
        apiService.logout();
        this.props.actions.logout();
        history.push("/account/login");
    }
    componentDidMount() {
        history.listen((location, action) => {
            this.setState({ showMenu: false });
        });

    }


    render() {
        const { auth, alert, actions, showHeaderFooter } = this.props;
        return (
            <Fragment>
                {
                    auth.loggedIn &&
                    !localStorageService.isRememberMeChecked() &&
                    (
                        <IdleTimer
                            ref={ref => { this.idleTimer = ref }}
                            element={document}
                            onActive={this.onActive}
                            onIdle={this.onIdle}
                            onAction={this.onAction}
                            debounce={250}
                            timeout={1000 * 60 * TIMEOUT_IN_MINUTES} />)
                }
                <Router history={history}  >
                    {
                        showHeaderFooter && auth.loggedIn &&
                        <AppHeader auth={auth} onLogout={this.handleLogout} showMenu={this.state.showMenu} onToggleMenu={this.handleToggleMenu} />
                    }
                    <main id="main" className={showHeaderFooter ? `pcoded-content ${this.state.showMenu ? 'full' : ''}` : ''}>
                        <div className="pcoded-inner-content">
                            <div className="main-body">
                                <div className="page-wrapper">
                                    <div className="page-body">
                                        <Switch>
                                            {
                                                appRoutes.map((prop, key) => {
                                                    if (prop.redirect)
                                                        return <Redirect from={prop.path} to={prop.to} key={key} />;

                                                    return (
                                                        prop.auth ?
                                                            <PrivateRoute {...prop} key={key} />
                                                            : <Route {...prop} key={key} />
                                                    );
                                                })

                                            }
                                            <Route path="*" component={NotFound} />
                                        </Switch>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                    {
                        showHeaderFooter && auth.loggedIn && <AppFooter />
                    }
                </Router>

                <Alert {...alert} onHideAlert={actions.hideAlert} />

            </Fragment>
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

export default connect(mapStateToProps, mapDispatchToProps)(AppLayout);
