import React from "react";
import ReactDOM from "react-dom/client";
import Picker from "./picker";

const root = ReactDOM.createRoot(document.getElementById("app")!);
root.render(
  <React.StrictMode>
    <Picker
      onSelect={console.log.bind(console)}
      rule={(year, month, day) => {
        return day != 13;
      }}
      format="yyyy-MM-dd"
      locale="en"
    />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// const reportWebVitals = (onPerfEntry?: any) => {
//   if (onPerfEntry && onPerfEntry instanceof Function) {
//     import("web-vitals").then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
//       getCLS(onPerfEntry);
//       getFID(onPerfEntry);
//       getFCP(onPerfEntry);
//       getLCP(onPerfEntry);
//       getTTFB(onPerfEntry);
//     });
//   }
// };
// reportWebVitals();
