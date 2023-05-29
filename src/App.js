import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layouts/Layout";
import Forgot from "./pages/auth/ForgotPassword";
import Login from "./pages/auth/Login";
import LoginWithCode from "./pages/auth/LoginWithCode";
import Register from "./pages/auth/Register";
import ResetPassword from "./pages/auth/ResetPassword";
import Verify from "./pages/auth/Verify";
import ChangePassword from "./pages/ChangePassword/ChangePassword";
import Home from "./pages/Home/Home";
import Profile from "./pages/Profile/Profile";
import UsersList from "./pages/UsersList/UsersList";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import {
  getLoginStatus,
  getUser,
  selectIsLoggedIn,
  selectUser,
} from "./redux/features/auth/authSlice";
import { GoogleOAuthProvider } from "@react-oauth/google";

axios.defaults.withCredentials = true;

function App() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const user = useSelector(selectUser);

  useEffect(() => {
    dispatch(getLoginStatus());
    if (isLoggedIn && user === null) {
      dispatch(getUser());
    }
  }, [dispatch, isLoggedIn, user]);

  return (
    <>
      <BrowserRouter>
        <ToastContainer />
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
          <Routes>
            <Route
              path="/"
              element={
                <Layout>
                  {" "}
                  <Home />{" "}
                </Layout>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot" element={<Forgot />} />
            <Route
              path="/ResetPassword/:resetToken"
              element={<ResetPassword />}
            />
            <Route
              path="/verify/:verificationToken"
              element={
                <Layout>
                  {" "}
                  <Verify />{" "}
                </Layout>
              }
            />
            <Route
              path="/profile"
              element={
                <Layout>
                  {" "}
                  <Profile />{" "}
                </Layout>
              }
            />
            <Route
              path="/changePassword"
              element={
                <Layout>
                  {" "}
                  <ChangePassword />{" "}
                </Layout>
              }
            />
            <Route
              path="/users"
              element={
                <Layout>
                  {" "}
                  <UsersList />{" "}
                </Layout>
              }
            />
            <Route path="/loginWithCode/:email" element={<LoginWithCode />} />
          </Routes>
        </GoogleOAuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
