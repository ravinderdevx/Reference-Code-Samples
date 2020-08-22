import React, { Component } from 'react';


class NotFound extends Component {
    state = {}
    openHome = () => {

        this.props.history.push('/');
    }

    render() {
        return (
            <div className="page-wrap d-flex flex-row">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-12 text-center">
                            <span className="display-1 d-block">404</span>
                            <div className="mb-4 lead">The page you are looking for was not found.</div>
                            <button className='link-button mobile-menu' id="mobile-collapse" onClick={() => this.openHome()}>Back to Home</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default NotFound;