import React, { Component, Fragment } from 'react';
import { Router, Switch, Route, Redirect } from "react-router-dom";
import history from "../../../utils/history";
import PrivateRoute from '../functional/PrivateRoute';

import Header from "./headers/Header";
import Footer from "./footers/Footer";

import appRoutes from '../../../routes/appRoutes';

class AppLayout extends Component {
    componentDidMount() {
        history.listen((location, action) => {
            window.scrollTo(0, 0);
        });
    }

    render() {
        return (
            <div className="tg-haslayout">
                <Router history={history}>
                    <Header />
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
                    </Switch>
                    <Footer />
                </Router>
            </div>
        );
    }
}

export default AppLayout;