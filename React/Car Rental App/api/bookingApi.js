import { baseUrl, handleResponse, handleError } from "./apiUtils";

export const getBookingStatuses = () => {
    var url = new URL(`${baseUrl}/bookings/statuses`);
    url.searchParams.append('appId', process.env.REACT_APP_APP_ID);

    return fetch(url).then(handleResponse).catch(handleError);
}

export function getBookings(filters, token) {
    var url = new URL(`${baseUrl}/bookings`);
    Object.keys(filters).forEach(key => {
        if (filters[key]) url.searchParams.append(key, filters[key])
    });

    return fetch(url, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then(handleResponse)
        .catch(handleError);
}


export function saveBooking(booking, token) {
    return fetch(`${baseUrl}/bookings`, {
        method: "POST",
        headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(booking)
    }).then(handleResponse).catch(handleError);
}

export const updateBooking = (booking, token) => {
    return fetch(`${baseUrl}/bookings/${booking.bookingId}`, {
        method: "PUT",
        headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(booking)
    }).then(handleResponse).catch(handleError);
}

