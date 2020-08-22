import React, { Fragment } from "react";

const PersonalDetails = ({ submitted, loader, booking, onChange }) => {
    return (
        <Fragment>
            <fieldset className="tg-sectionborder">
                <div className="tg-border-heading"><h3>Personal Details</h3></div>
                <div className="row">
                    <div className="col-sm-4">
                        <div className={'form-group' + (submitted && !booking.firstName ? ' has-error' : '')}>
                            <input
                                type="text"
                                placeholder="First Name *"
                                name="firstName"
                                className="form-control"
                                value={booking.firstName}
                                onChange={onChange}
                                disabled={loader}
                            />
                            <div className="help-block">First name is required</div>
                        </div>
                    </div>
                    <div className="col-sm-4">
                        <div className={'form-group' + (submitted && !booking.lastName ? ' has-error' : '')}>
                            <input
                                type="text"
                                placeholder="Last Name *"
                                name="lastName"
                                className="form-control"
                                value={booking.lastName}
                                onChange={onChange}
                                disabled={loader}
                            />

                            <div className="help-block">Last name is required</div>
                        </div>
                    </div>

                    <div className="col-sm-4">
                        <div className={'form-group' + (submitted && !booking.email ? ' has-error' : '')}>
                            <input
                                type="text"
                                placeholder="Email *"
                                name="email"
                                className="form-control"
                                value={booking.email}
                                onChange={onChange}
                                disabled={loader}
                            />
                            <div className="help-block">Email is required</div>
                        </div>
                    </div>

                    <div className="col-sm-4">
                        <div className={'form-group' + (submitted && !booking.phone ? ' has-error' : '')}>
                            <input
                                type="text"
                                placeholder="Phone *"
                                name="phone"
                                className="form-control"
                                value={booking.phone}
                                onChange={onChange}
                                disabled={loader}
                            />
                            <div className="help-block">Phone is required</div>
                        </div>
                    </div>

                    <div className="col-sm-4">
                        <div className={'form-group' + (submitted && !booking.driversLicenseNumber ? ' has-error' : '')}>
                            <input
                                type="text"
                                placeholder="Drivers License Number *"
                                name="driversLicenseNumber"
                                className="form-control"
                                value={booking.driversLicenseNumber}
                                onChange={onChange}
                                disabled={loader}
                            />
                            <div className="help-block">Drivers license is required</div>
                        </div>
                    </div>
                </div>
            </fieldset>
        </Fragment>
    );
};

export default PersonalDetails;
