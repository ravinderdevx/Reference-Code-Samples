import React, { Fragment } from "react";

const AddressDetails = ({ submitted, loader, booking, onChange }) => {
    return (
        <Fragment>
            <fieldset className="tg-sectionborder">
                <div className="tg-border-heading"><h3>Address Details</h3></div>
                <div className="row">
                    <div className="col-sm-12">
                        <div className={'form-group' + (submitted && !booking.country ? ' has-error' : '')}>
                            <input
                                type="text"
                                placeholder="Country *"
                                name="country"
                                className="form-control"
                                defaultValue={booking.country}
                                onChange={onChange}
                                disabled={loader}
                            />
                            <div className="help-block">Country is required</div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm-12">
                        <div className={'form-group' + (submitted && !booking.address ? ' has-error' : '')}>
                            <input
                                type="text"
                                placeholder="Address *"
                                name="address"
                                className="form-control"
                                defaultValue={booking.address}
                                onChange={onChange}
                                disabled={loader}
                            />
                            <div className="help-block">Booking address is required</div>

                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm-4">
                        <div className={'form-group' + (submitted && !booking.city ? ' has-error' : '')}>
                            <input
                                type="text"
                                placeholder="City *"
                                name="city"
                                className="form-control"
                                value={booking.city}
                                onChange={onChange}
                                disabled={loader}
                            />
                            <div className="help-block">City is required</div>
                        </div>
                    </div>
                    <div className="col-sm-4">
                        <div className={'form-group' + (submitted && !booking.stateProvince ? ' has-error' : '')}>
                            <input
                                type="text"
                                placeholder="State *"
                                name="stateProvince"
                                className="form-control"
                                value={booking.stateProvince}
                                onChange={onChange}
                                disabled={loader}
                            />
                            <div className="help-block">State is required</div>
                        </div>
                    </div>
                    <div className="col-sm-4">
                        <div className={'form-group' + (submitted && !booking.zipPostalCode ? ' has-error' : '')}>
                            <input
                                type="text"
                                placeholder="Postal Code *"
                                name="zipPostalCode"
                                className="form-control"
                                value={booking.zipPostalCode}
                                onChange={onChange}
                                disabled={loader}
                            />
                            <div className="help-block">Postal Code is required</div>
                        </div>
                    </div>
                </div>
            </fieldset>
        </Fragment>
    );
};

export default AddressDetails;
