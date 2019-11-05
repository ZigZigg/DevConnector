import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  withRouter
} from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";
import { clearCurrentProfile } from "./actions/profileActions";

import { Provider } from "react-redux";
import store from "./store";

import PrivateRoute from "./components/common/PrivateRoute";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Dashboard from "./components/dashboard/Dashboard";
// import DashboardAdmin from "./components/admin";
import ManageProfile from "./components/admin/ManageProfile";
import ManagePost from "./components/admin/ManagePost";
import ManageReport from "./components/admin/ManageReport";
import CreateProfile from "./components/create-profile/CreateProfile";
import EditProfile from "./components/edit-profile/EditProfile";
import EditUser from "./components/edit-profile/EditUser";
import AddExperience from "./components/add-credentials/AddExperience";
import AddEducation from "./components/add-credentials/AddEducation";
import Profiles from "./components/profiles/Profiles";
import Profile from "./components/profile/Profile";
import Posts from "./components/posts/Posts";
import CreatePost from "./components/posts/PostForm";
import Post from "./components/post/Post";
import NotFound from "./components/not-found/NotFound";
import StickyFooter from "react-sticky-footer";
import "./App.css";

// Check for token
if (localStorage.jwtToken) {
  // Set auth token header auth
  setAuthToken(localStorage.jwtToken);
  // Decode token and get user info and exp
  const decoded = jwt_decode(localStorage.jwtToken);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));

  // Check for expired token
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // Clear current Profile
    store.dispatch(clearCurrentProfile());
    // Redirect to login
    window.location.href = "/login";
  }
}

class App extends Component {
  componentWillReceiveProps(nextProps) {
    console.log("APP", nextProps);
  }
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App" id="root-app">
            <Navbar />
            {/* <Switch>
              <PrivateRoute
                exact
                path="/dashboard_admin"
                component={DashboardAdmin}
              />
            </Switch> */}
            <Switch>
              <PrivateRoute
                exact
                path="/dashboard_admin/manage_profile"
                component={ManageProfile}
              />
              <PrivateRoute
                exact
                path="/dashboard_admin/manage_post"
                component={ManagePost}
              />
              <PrivateRoute
                exact
                path="/dashboard_admin/manage_report"
                component={ManageReport}
              />
            </Switch>

            <Route exact path="/" component={Landing} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/profiles" component={Profiles} />
            <Route exact path="/profile/:handle" component={Profile} />
            <Switch>
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
            </Switch>

            <Switch>
              <PrivateRoute
                exact
                path="/create-profile"
                component={CreateProfile}
              />
            </Switch>
            <Switch>
              <PrivateRoute
                exact
                path="/edit-profile"
                component={EditProfile}
              />
            </Switch>
            <Switch>
              <PrivateRoute exact path="/edit-user" component={EditUser} />
            </Switch>
            <Switch>
              <PrivateRoute
                exact
                path="/add-experience"
                component={AddExperience}
              />
            </Switch>
            <Switch>
              <PrivateRoute
                exact
                path="/add-education"
                component={AddEducation}
              />
            </Switch>
            <Switch>
              <PrivateRoute exact path="/feed" component={Posts} />
            </Switch>
            <Switch>
              <PrivateRoute
                exact
                path="/feed/create-post"
                component={CreatePost}
              />
            </Switch>
            <Switch>
              <PrivateRoute exact path="/post/:id" component={Post} />
            </Switch>
            <Route exact path="/not-found" component={NotFound} />
            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
