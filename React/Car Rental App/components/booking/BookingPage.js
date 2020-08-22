import React, { Component } from "react";
import { connect } from 'react-redux';
import queryString from 'query-string';

import * as actions from "../../redux/actions";

import VehicleOwnerDetails from "../vehicles/VehicleOwnerDetails";
import AddressDetails from "./AddressDetails";
import PersonalDetails from "./PersonalDetails";

import EllipsisText from '../common/functional/EllipsisText';
import FormatDateTime from '../common/functional/FormatDateTime';


class BookingPage extends Component {
  state = {
    submitted: false
  };

  constructor(props) {
    super(props);

    let { vehicleId } = props.match.params;

    if (!vehicleId) {
      this.onRedirectToVehiclesPage();
    }

    const { vehicle } = this.props.vehicles;

    if (!vehicle || Object.keys(vehicle) == 0)
      this.props.actions.loadVehicle(vehicleId);


    const params = queryString.parse(this.props.location.search)
    const { startDateTime, endDateTime } = params;

    this.props.actions.updateMultipleBookingData({ vehicleId, startDateTime, endDateTime });
  }


  handleChange = e => {
    const { name, value } = e.target;
    this.props.actions.updateBookingData({ name, value });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.setState({ submitted: true });

    if (this.isFormValid()) {
      this.props.actions.saveBooking(this.props.booking, this.props.token).then(response => {
        if (response.status) {
          this.onRedirectToVehiclesPage();
        }
      });
    }
  }

  isFormValid = () => {
    let { booking } = this.props;
    let valid = true;

    const excludedFields = ["renterId", "renterIdentifier"];
    for (let key in booking) {
      if (excludedFields.indexOf(key) === -1 && !booking[key]) {
        valid = false;
        break;
      }
    }
    return valid;
  }

  onRedirectToVehiclesPage = () => {
    this.props.history.push('/vehicles');
  }

  render() {
    const { submitted } = this.state;
    const { vehicles, booking, loading } = this.props;
    const { vehicle } = vehicles;

    return (
      <main id="tg-main" className="tg-main tg-haslayout">
        <div className="container">
          <div className="row">
            <div className="col-sm-12">
              <div className="tg-section-head">
                <h2>
                  Checkout
                  </h2>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-8">
              <div className="tg-dashboard tg-dashboard-addlist">
                <form name="bookingForm" className="tg-form-addlist" onSubmit={this.handleSubmit}>
                  <AddressDetails booking={booking} submitted={submitted} loading={loading} onChange={this.handleChange} />
                  <PersonalDetails booking={booking} submitted={submitted} loading={loading} onChange={this.handleChange} />

                  <button className="tg-btn" disabled={loading}>
                    {loading && <i className="fa fa-circle-o-notch fa-spin"></i>}
                    <span> Book now</span>
                  </button>
                </form>
              </div>
            </div>

            <div className="col-sm-4">
              <aside id="tg-sidebar" className="tg-sidebar">
                <div className="tg-widget tg-widget-amenities">
                  <article className="tg-post">
                    <figure>
                      <img src={vehicle.images && vehicle.images.length > 0 ? vehicle.images[0] : 'https://st.motortrend.com/uploads/sites/5/2018/01/2019-Acura-RDX-Prototype-rear-three-quarter-02.jpg'} alt="" />
                    </figure>

                    <div className="tg-border-heading">
                      <h3><a href="javascript:void(0)">{vehicle.modelYear} {vehicle.makeName} {vehicle.model}</a></h3>
                      <div className="tg-post-matadata">
                        <label>
                          <strong>Start Datetime: </strong> <FormatDateTime date={booking.startDateTime} format="ddd MMM D, YYYY HH:mm A" />
                        </label>

                        <label>
                          <strong>End Datetime: </strong>
                          <FormatDateTime date={booking.endDateTime} format="ddd MMM D, YYYY HH:mm A" />
                        </label>

                      </div>
                    </div>

                    <div className="tg-description">
                      <p>{vehicle.dailyRate} LKR / DAY</p>
                      <p><EllipsisText text={vehicle.description} limit="100" /></p>
                    </div>
                  </article>
                </div>

                <VehicleOwnerDetails vehicle={vehicle} />
              </aside>
            </div>
          </div>
        </div>
      </main >
    );
  }
};

const mapStateToProps = state => {
  return {
    loading: state.loading,
    booking: state.bookings.booking,
    vehicles: state.vehicles
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: {
      loadVehicle: (vehicleId) => dispatch(actions.loadVehicle(vehicleId)),
      updateBookingData: (data) => dispatch(actions.updateBookingData(data)),
      updateMultipleBookingData: (data) => dispatch(actions.updateMultipleBookingData(data)),
      saveBooking: (booking, token) => dispatch(actions.saveBooking(booking, token))
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingPage);

