import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './reducers/reducerCart';

const store = configureStore({
  reducer: {
    cart: cartReducer,
    // Other reducers if any
  },
  // Other middleware, enhancers, or dev tools setup if needed
});

export default store;