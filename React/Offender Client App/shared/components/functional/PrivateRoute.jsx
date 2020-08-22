import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

import { localStorageService } from '../../../services';

const PrivateRoute = ({ component: Component, path, auth, ...rest }) => {
    return (
        <Route {...rest} render={props => (
            localStorageService.isAuthenticated()
                ? <Component {...props} auth={auth}/>
                : <Redirect to={{ pathname: '/account/login'}} />
        )} />
    );
}

const mapStateToProps = state => {
    return {
        auth: state.auth
    }
}


export default connect(mapStateToProps, null)(PrivateRoute);