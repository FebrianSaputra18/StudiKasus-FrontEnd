import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const token = localStorage.getItem("authToken");

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

export const getOrder = createAsyncThunk(
  "order/getOrder",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get("http://localhost:3000/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({ errorMessage: error.message });
    }
  }
);
export const addToOrder = createAsyncThunk(
  "order/addToOrder",
  async ({ delivery_fee, delivery_address, cart }) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/orders",
        {
          delivery_fee,
          delivery_address,
          cart,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      error.message = "error order";
    }
  }
  
);
