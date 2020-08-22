import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { APP_URLS } from '../../../config/constants.config';
import { localStorageService } from '../../../services';

const PublicRoute = ({ component: Component, ...rest }) => {
    return (
        <Route {...rest} render={props => (
            localStorageService.isAuthenticated ?
                <Redirect to={APP_URLS.userDashboardUrl} />
                : <Component {...props} />
        )} />
    );
}

export default PublicRoute;