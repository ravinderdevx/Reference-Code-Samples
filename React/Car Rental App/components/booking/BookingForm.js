import React, { Component } from 'react';

class BookingForm extends Component {
    state = {
        submitted: false,
        startDateTime: null,
        endDateTime: null,
        bookingId: null
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.updateMode && nextProps.bookingId != prevState.bookingId) {
            return {
                bookingId: nextProps.bookingId,
                startDateTime: nextProps.startDateTime,
                endDateTime: nextProps.endDateTime,
                submitted: false
            };
        }
        return null;
    }


    handleBookNow = (e) => {
        e.preventDefault();

        this.setState({ submitted: true });

        const { startDateTime, endDateTime } = this.state;

        if (startDateTime && endDateTime) {
            this.props.onSubmit(this.state);
        }
    }

    handleChange = (e) => {
        debugger;
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    render() {
        const { updateMode, onCancel } = this.props;
        const { startDateTime, endDateTime, submitted } = this.state;

        return (
            <form name="bookingForm" onSubmit={this.handleBookNow}>
                <ul>
                    <li>
                        <div className={'form-group' + (submitted && !startDateTime ? ' has-error' : '')}>
                            <span htmlFor="startDateTime">Start Date:</span>
                            <input
                                type="datetime-local" className="form-control" name="startDateTime" defaultValue={startDateTime} onChange={this.handleChange} />
                            {submitted && !startDateTime &&
                                <div className="help-block">Start Datetime is required</div>
                            }
                        </div>
                    </li>
                    <li className="booking">
                        <div className={'form-group' + (submitted && !endDateTime ? ' has-error' : '')}>
                            <span htmlFor="endDateTime">End Date:</span>
                            <input
                                type="datetime-local" className="form-control" name="endDateTime" defaultValue={endDateTime} onChange={this.handleChange} />
                            {submitted && !endDateTime &&
                                <div className="help-block">End Datetime is required</div>
                            }
                        </div>
                    </li>
                </ul>
                <button className="tg-btn"><span>{updateMode ? 'Update Booking' : 'Book now'}</span></button>
                {
                    updateMode
                    && <a className="tg-btn pull-right" onClick={onCancel}><span>Cancel Booking</span></a>
                }

            </form>
        );
    }
}

export default BookingForm;