import { combineReducers } from 'redux';

import authReducer from './auth.reducer';
import alertReducer from './alert.reducer';

const rootReducer = combineReducers({
    alert: alertReducer,
    auth: authReducer
});


export default rootReducer;