import React, { Component, Fragment } from 'react';

import PrivateRoute from '../functional/PrivateRoute';
import ProfileHeader from './headers/ProfileHeader';

class ProfileLayout extends Component {
    render() {
        debugger;
        const { match, routes, user } = this.props;

        return (
            <Fragment>
                <ProfileHeader match={match} user={user} />
                <main id="tg-main" className="tg-main tg-haslayout">
                    <div className="container">
                        {
                            routes.map((prop, key) =>
                                <PrivateRoute path={`${match.path}${prop.path}`} exact={prop.exact} component={prop.component} key={key} />
                            )
                        }
                    </div>
                </main>
            </Fragment>
        );
    }
}

export default ProfileLayout;