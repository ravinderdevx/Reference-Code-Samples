import React, { Fragment } from "react";

const ContactDetails = ({ submitted, booking, onChange }) => {
    return (
        <Fragment>
            <fieldset className="tg-sectionborder">
                <div className="tg-box-head">
                    <div className="row">
                        <div className="col-sm-4">
                            <h3>Contact Details </h3>
                        </div>
                    </div>
                </div>
            </fieldset>

            <fieldset className="tg-sectionborder">
                <div className="row">
                    <div className="col-sm-6">
                        <div className={'form-group' + (submitted && !booking.firstName ? ' has-error' : '')}>
                            <input
                                type="text"
                                placeholder="First Name*"
                                name="firstName"
                                className="form-control"
                                value={booking.firstName}
                                onChange={onChange}
                            />
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className={'form-group' + (submitted && !booking.lastName ? ' has-error' : '')}>
                            <input
                                type="text"
                                placeholder="Last Name*"
                                name="lastName"
                                className="form-control"
                                value={booking.lastName}
                                onChange={onChange}
                            />
                        </div>
                    </div>
                </div>
            </fieldset>
        </Fragment>
    );
};

export default ContactDetails;
