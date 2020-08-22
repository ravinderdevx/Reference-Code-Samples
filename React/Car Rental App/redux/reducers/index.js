import { combineReducers } from "redux";

import bookings from "./bookingReducer";

const rootReducer = combineReducers({
  bookings
});

export default rootReducer;
