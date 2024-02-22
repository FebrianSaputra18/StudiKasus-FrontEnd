import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
// import store from "./redux/store.js";
import store from './redux/store.js'

//bootstrap CSS styles
import "bootstrap/dist/css/bootstrap.min.css";
import "./dist/css/main.css";
// import store from "./services/store.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
