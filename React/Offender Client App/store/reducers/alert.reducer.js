import * as types from '../types';

const alertReducer = (state = { isOpen: false }, { type, payload }) => {
    switch (type) {
        case types.SHOW_ALERT:
            return {
                isOpen: true,
                ...payload
            };

        case types.HIDE_ALERT:
            return {
                isOpen: false
            };

        default:
            return state;
    }
}

export default alertReducer;