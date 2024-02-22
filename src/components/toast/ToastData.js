import { Toaster } from "react-hot-toast";

export const ToastData = () => {
  return (
    <Toaster
      position="right"
      reverseOrder={false}
      gutter={1}
      containerClassName=""
      containerStyle={{
        marginBottom: "7rem",
      }}
      toastOptions={{
        // Define default options
        className: "",
        duration: 5000,
        style: {
          background: "#363636",
          color: "#fff",
        },

        // Default options for specific types
        success: {
          duration: 3000,
          theme: {
            primary: "green",
            secondary: "black",
          },
        },
      }}
    />
  );
};
