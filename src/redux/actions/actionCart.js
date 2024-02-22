import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const token = localStorage.getItem("authToken");
console.log(token, "ini chaunima");

export const getCart = createAsyncThunk("cart/getList", async (_, thunkAPI) => {
  try {
    const response = await axios.get("http://localhost:3000/api/carts", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue({ errorMessage: error.message });
  }
});
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (items, thunkAPI) => {
    try {
      const response = await axios.put(
        "http://localhost:3000/api/carts",
        {
          items,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response.data, "Add To CartAction");
    } catch (error) {
      return thunkAPI.rejectWithValue({ errorMessage: error.message });
    }
  }
);
// export const updateQuantityOnServer = createAsyncThunk(
//   "cart/updateQuantityOnServer",
//   async ({ productId, newQuantity }) => {
//     try {
//       const response = await axios.put(
//         `http://localhost:3000/api/carts/${productId}`,
//         {
//           qty: newQuantity,
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         },
//       );

//       console.log(response, "updateQuantityOnServer Cart"); // Handle server response if needed
//       return response.data;
//     } catch (error) {
//       console.error("Error updating quantity on the server:", error);
//       throw error;
//     }
//   }
// );

// export const increaseQuantity = createAsyncThunk(
//   "cart/increaseQuantity",
//   async ({ productId, quantity }, { dispatch, getState }) => {
//     try {
//       const state = getState();
//       console.log(state, "icrese actionCart");
//       const item = state.cart.cartItems.find(
//         (item) => item.product._id === productId
//       );

//       const newQuantity = item ? item.qty + quantity : quantity;

//       const updatedProduct = await dispatch(
//         updateQuantityOnServer({ productId, newQuantity })
//       );

//       dispatch({
//         type: "UPDATE_QUANTITY_IN_STATE",
//         payload: {
//           productId,
//           newQuantity: updatedProduct.qty,
//         },
//       });
//     } catch (error) {
//       // Handle errors, e.g., display an error message to the user
//       console.error("Failed to increase quantity:", error);
//     }
//   }
// );

export const updateQuantityOnServer = async ({ productId, newQuantity, token }) => {
  try {
    const response = await axios.put(
      `http://localhost:3000/api/carts/${productId}`,
      {
        qty: newQuantity,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // Tangani respons dari server jika diperlukan
    console.log(response.data, "updateQuantityOnServer response");

    return response.data; // Mengembalikan data yang diterima dari server
  } catch (error) {
    // Tangani error saat permintaan gagal
    console.error("Error updating quantity on the server:", error);

    // Melemparkan kembali error untuk penanganan lebih lanjut jika diperlukan
    throw error;
  }
};

export const increaseQuantity = createAsyncThunk(
  "cart/increaseQuantity",
  async ({ productId, quantity }, { dispatch, getState }) => {
    try {
      const state = getState();
      console.log(state, "increase actionCart");
      const item = state.cart.cartItems.find(
        (item) => item.product._id === productId
      );

      const newQuantity = item ? item.qty + quantity : quantity;

      const updatedProduct = await updateQuantityOnServer({
        productId,
        newQuantity,
        token: state.auth.token, // Mengasumsikan token otentikasi tersedia di Redux store
      });

      dispatch({
        type: "UPDATE_QUANTITY_IN_STATE",
        payload: {
          productId,
          newQuantity: updatedProduct.qty,
        },
      });
    } catch (error) {
      console.error("Failed to increase quantity:", error);
    }
  }
);

// export const increaseQuantity = createAsyncThunk(
//   "cart/increaseQuantity",
//   async ({ productId, currentQuantity }) => {
//     try {
//       const newQuantity = currentQuantity + 1;

//       const response = await axios.put(
//         `http://localhost:3000/api/carts/${productId}`,
//         {
//           qty: newQuantity,
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       console.log(response, "increaseQuantityOnServer Cart"); // Handle server response if needed
//       return response.data;
//     } catch (error) {
//       console.error("Error increasing quantity on the server:", error);
//       throw error;
//     }
//   }
// );
export const decreaseQuantity = createAsyncThunk(
  "cart/decreaseQuantity",
  async ({ productId, currentQuantity }) => {
    try {
      const newQuantity = currentQuantity - 1; 

      const response = await axios.put(
        `http://localhost:3000/api/carts/${productId}`,
        {
          qty: newQuantity,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log(response, "decreaseQuantityOnServer Cart")
       // Handle server response if needed
      return response.data;
    } catch (error) {
      console.error("Error updating quantity on the server:", error);
      console.log("Error response data:", error.response.data); // Log error response data
      console.log("Error response status:", error.response.status); // Log error response status
      console.log("Error response headers:", error.response.headers); // Log error response headers
      throw error;
    }
  }
);