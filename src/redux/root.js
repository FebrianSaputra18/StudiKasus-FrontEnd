import { combineReducers } from 'redux';
import cartReducer from './reducers/reducerCart'; // Update the path accordingly for your project

const rootReducer = combineReducers({
  cart: cartReducer,
  // Add other reducers if any
});

export default rootReducer;
