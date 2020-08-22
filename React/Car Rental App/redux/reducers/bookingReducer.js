import * as types from "../types";
import initialState from "../initialState";

const bookingReducer = (state = initialState.bookings, { type, data }) => {
    switch (type) {
        case types.UPDATE_BOOKING_DATA:
            return {
                ...state,
                booking: { ...state.booking, [data.name]: data.value }
            };

        case types.UPDATE_MULTIPLE_BOOKING_DATA:
            return {
                ...state,
                booking: {
                    ...state.booking,
                    ...data
                }
            };

        case types.ADD_USER_PROFILE_DATA:
            return {
                ...state,
                booking: {
                    ...state.booking,
                    renterIdentifier: data.sub
                }
            };

        case types.GET_USER_PROFILE_SUCCESS:
            for (let key in state.booking) {
                if (data[key]) state.booking[key] = data[key];
            }

            return {
                ...state,
                booking: {
                    ...state.booking,
                    renterId: data.id
                }
            };

        case types.LOAD_OWNER_UPCOMING_TRIPS_SUCCESS:
            return {
                ...state,
                ownerUpcomingTrips: data
            };

        case types.LOAD_RENTER_UPCOMING_TRIPS_SUCCESS:
            return {
                ...state,
                renterUpcomingTrips: data
            };

        case types.LOAD_OWNER_PAST_TRIPS_SUCCESS:
            return {
                ...state,
                ownerPastTrips: data
            };


        case types.LOAD_RENTER_PAST_TRIPS_SUCCESS:
            return {
                ...state,
                renterPastTrips: data
            };

        case types.UPDATE_REVIEW_SUCCESS:

            return {
                ...state,
                renterPastTrips: {
                    ...state.renterPastTrips,
                    list: state.renterPastTrips.list.map(trip => trip.bookingId === data.bookingId ?
                        // transform the one with a matching id
                        { ...trip, rating: data.rating } :
                        // otherwise return original todo
                        trip
                    )
                }
            };

        case types.CANCEL_OWNER_BOOKING_SUCCESS:
            return {
                ...state,
                ownerUpcomingTrips: {
                    ...state.ownerUpcomingTrips,
                    list: state.ownerUpcomingTrips.list.map(trip => trip.bookingId === data.bookingId ?
                        // transform the one with a matching id
                        { ...trip, cancelled: true } :
                        // otherwise return original todo
                        trip
                    )
                }
            };

        case types.CANCEL_RENTER_BOOKING_SUCCESS:
            return {
                ...state,
                renterUpcomingTrips: {
                    ...state.renterUpcomingTrips,
                    list: state.renterUpcomingTrips.list.map(trip => trip.bookingId === data.bookingId ?
                        // transform the one with a matching id
                        { ...trip, cancelled: true } :
                        // otherwise return original todo
                        trip
                    )
                }
            };


        case types.UPDATE_OWNER_BOOKING_SUCCESS:
            return {
                ...state,
                ownerUpcomingTrips: {
                    ...state.ownerUpcomingTrips,
                    list: state.ownerUpcomingTrips.list.map(trip => trip.bookingId === data.bookingId ?
                        {
                            ...trip,
                            startDateTime: data.startDateTime,
                            endDateTime: data.endDateTime,
                        }
                        : trip
                    )
                }
            };

        case types.UPDATE_RENTER_BOOKING_SUCCESS:
            return {
                ...state,
                renterUpcomingTrips: {
                    ...state.renterUpcomingTrips,
                    list: state.renterUpcomingTrips.list.map(trip => trip.bookingId === data.bookingId ?
                        {
                            ...trip,
                            startDateTime: data.startDateTime,
                            endDateTime: data.endDateTime,
                        }
                        : trip
                    )
                }
            };

        default:
            return state;
    }
}

export default bookingReducer;
