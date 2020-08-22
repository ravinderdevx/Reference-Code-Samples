
import { createStore, applyMiddleware, compose } from 'redux';
import reduxImmutableStateInvariant from "redux-immutable-state-invariant";
import thunk from 'redux-thunk';

import rootReducer from './reducers';

const middleware = [thunk, reduxImmutableStateInvariant()];

const enhancers =
  (process.env.REACT_APP_NODE_ENV === "production" || process.env.REACT_APP_NODE_ENV === "playground")
    ? applyMiddleware(...middleware)
    :  compose(
        applyMiddleware(...middleware),
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    
    );

const store = createStore(
    rootReducer,
    enhancers
);

export default store;