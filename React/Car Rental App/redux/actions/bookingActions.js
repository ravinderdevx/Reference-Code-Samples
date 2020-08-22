import * as types from "../types";

import * as toaster from '../../utils/toaster';
import * as api from "../../api";
import initialState from "../initialState";

export const updateBookingData = (data) => {
    return { type: types.UPDATE_BOOKING_DATA, data };
};

export const updateMultipleBookingData = (data) => {
    return { type: types.UPDATE_MULTIPLE_BOOKING_DATA, data };
};

export const saveBooking = (data, token) => {
    return (dispatch) => {
        dispatch({ type: types.SHOW_LOADING });
        return api
            .saveBooking(data, token)
            .then(response => {
                dispatch({ type: types.STOP_LOADING });
                toaster.toastSuccess('Vehicle booked succesfully');
                return response;
            }).catch(error => {
                dispatch({ type: types.STOP_LOADING });
                dispatch({ type: types.ALERT_ERROR, message: error.message });
                toaster.toastError('Error, while booking vehicle.');
                return { status: false };
            });
    };
}

export const loadOwnerUpcomingTrips = (filters, token) => {
    return (dispatch) => {
        return api
            .getBookings(filters, token)
            .then(bookings => {
                dispatch(loadOwnerUpcomingTripsSuccess(bookings));
            })
            .catch(error => {
                dispatch(loadOwnerUpcomingTripsSuccess({ list: [], pagination: {} }));
            });
    };
}

export const loadOwnerUpcomingTripsSuccess = (data) => {
    return { type: types.LOAD_OWNER_UPCOMING_TRIPS_SUCCESS, data };
}


export const loadRenterUpcomingTrips = (filters, token) => {
    return (dispatch) => {
        return api
            .getBookings(filters, token)
            .then(bookings => {
                dispatch(loadRenterUpcomingTripsSuccess(bookings));
            })
            .catch(error => {
                dispatch(loadRenterUpcomingTripsSuccess({ list: [], pagination: {} }));
            });
    };
}

export const loadRenterUpcomingTripsSuccess = (data) => {
    return { type: types.LOAD_RENTER_UPCOMING_TRIPS_SUCCESS, data };
}


export const loadOwnerPastTrips = (filters, token) => {
    return (dispatch) => {
        return api
            .getBookings(filters, token)
            .then(bookings => {
                dispatch(loadOwnerPastTripsSuccess(bookings));
            })
            .catch(error => {
                dispatch(loadOwnerPastTripsSuccess({ list: [], pagination: {} }));
            });
    };
}

export const loadOwnerPastTripsSuccess = (data) => {
    return { type: types.LOAD_OWNER_PAST_TRIPS_SUCCESS, data };
}


export const loadRenterPastTrips = (filters, token) => {
    return (dispatch) => {
        return api
            .getBookings(filters, token)
            .then(bookings => {
                dispatch(loadRenterPastTripsSuccess(bookings));
            })
            .catch(error => {
                dispatch(loadRenterPastTripsSuccess({ list: [], pagination: {} }));
            });
    };
}

export const loadRenterPastTripsSuccess = (data) => {
    return { type: types.LOAD_RENTER_PAST_TRIPS_SUCCESS, data };
}

export const updateBooking = (renterPerspective, booking, token) => {
    return (dispatch) => {
        return api
            .updateBooking(booking, token)
            .then(response => {
                if (renterPerspective)
                    dispatch(updateRenterBookingSuccess(booking));
                else
                    dispatch(updateOwnerBookingSuccess(booking));

                dispatch({ type: types.ALERT_SUCCESS, message: 'Your trip is updated successfully' });
                return response;
            })
            .catch(error => {
                dispatch({ type: types.ALERT_ERROR, message: error.message });
                return { status: false };
            });
    };
}

export const updateRenterBookingSuccess = (data) => {
    return { type: types.UPDATE_RENTER_BOOKING_SUCCESS, data };
}

export const updateOwnerBookingSuccess = (data) => {
    return { type: types.UPDATE_OWNER_BOOKING_SUCCESS, data };
}

export const cancelBooking = (renterPerspective, booking, token) => {
    return (dispatch) => {
        return api
            .updateBooking(booking, token)
            .then(response => {
                if (renterPerspective)
                    dispatch(cancelRenterBookingSuccess(booking));
                else
                    dispatch(cancelOwnerBookingSuccess(booking));

                dispatch({ type: types.ALERT_SUCCESS, message: 'Your trip is cancelled successfully' });
                return response;
            })
            .catch(error => {
                dispatch({ type: types.ALERT_ERROR, message: error.message });
                return { status: false };
            });
    };
}

export const cancelRenterBookingSuccess = (data) => {
    return { type: types.CANCEL_RENTER_BOOKING_SUCCESS, data };
}

export const cancelOwnerBookingSuccess = (data) => {
    return { type: types.CANCEL_OWNER_BOOKING_SUCCESS, data };
}


export const getRenterTrips = (filters, token) => {
    return function (dispatch) {
        const combineFilters = Object.assign(
            {},
            initialState.bookings.filters,
            filters
        );

        return api
            .getBookings(combineFilters, token)
            .then(response => {
                return response;
            })
            .catch(error => {
                return { list: [], pagination: {} };
            });
    };
}
