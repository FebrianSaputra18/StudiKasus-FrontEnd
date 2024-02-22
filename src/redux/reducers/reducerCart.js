import { createSlice } from "@reduxjs/toolkit";
import {
  addToCart,
  getCart,
  increaseQuantity
  // updateQuantityOnServer,
} from "../actions/actionCart";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: [],
    loading: false,
    error: null,
  },
  reducers: {
    UPDATE_QUANTITY_IN_STATE: (state, action) => {
      const { productId, newQuantity } = action.payload;
      const existingItem = state.cartItems.find(item => item.product._id === productId);

      if (existingItem) {
        existingItem.qty = newQuantity;
      } else {
        // Jika item tidak ditemukan, Anda bisa menambahkannya ke cartItems
        state.cartItems.push({ product: { _id: productId }, qty: newQuantity });
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload;
      })
      .addCase(getCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // .addCase(updateQuantityOnServer.fulfilled, (state, action) => {
      //   const { productId, qty } = action.payload;
      //   state.cartItems = state.cartItems.map((item) =>
      //     item.product._id === productId ? { ...item, qty } : item
      //   );
      // });
      .addCase(increaseQuantity.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload;
        // Dalam kasus ini, Anda tidak perlu melakukan apa-apa karena update sudah dilakukan di reducer UPDATE_QUANTITY_IN_STATE
      });
  },
});

export const { UPDATE_QUANTITY_IN_STATE } = cartSlice.actions;
export default cartSlice.reducer;
