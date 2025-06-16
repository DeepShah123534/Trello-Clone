import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { RouterProvider, createBrowserRouter, redirect } from "react-router-dom";
import SignUp from './Pages/SignUp'; 
import LogIn from './Pages/LogIn';
import Projects from "./Pages/Projects";
import Profile from "./Pages/Profile";
import axios from "axios";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
            loader: async () => {
          // get token from local Storage
          const token = localStorage.getItem("token");

          // If we have a token. we will use it as a bearer token on our request for user data
          if(token) {
            try{
              const response = await axios.get('http://localhost:3000/auth/profile',
              { headers: { Authorization: `Bearer ${token}`} }
            );
            return response.data;
            } catch (error) {
              return {};
            }
          } else {
            return {};
          }

          // If we don't have a token, we will use error and redirectrct user to sign-up page
        },
    children: [
      {
        path: "/sign-up",
        element: <SignUp />,
      },
      {
        path: "/log-in",
        element: <LogIn />,
      },
      {
        path: "/projects",
        element: <Projects />,
      },
      {
        path: "/profile",
        element: <Profile />,
        loader: async () => {
          // get token from local Storage
          const token = localStorage.getItem("token");

          // If we have a token. we will use it as a bearer token on our request for user data
          if(token) {
            try{
              const response = await axios.get('http://localhost:3000/auth/profile',
              { headers: { Authorization: `Bearer ${token}`} }
            );
            return response.data;
            } catch (error) {
              // If we have an expired token, we will use error and redirect user to log-in page
              alert("You must be signed in to view this page.")
              // alert("There was an error");
              return redirect("/log-in");
            }
          } else {
            alert("You must have an account to view this page.")
            return redirect("/sign-up");
          }

          // If we don't have a token, we will use error and redirectrct user to sign-up page
        },
      },
    ],
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(<RouterProvider router={router} />);