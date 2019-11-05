import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import {
  clearCurrentProfile,
  getCurrentProfile
} from "../../actions/profileActions";
import logo from "../../img/nodejs_logo.png";

class Navbar extends Component {
  onLogoutClick(e) {
    e.preventDefault();
    this.props.clearCurrentProfile();
    this.props.logoutUser();
    this.props.history.push("/");
  }
  componentDidMount() {
    this.props.getCurrentProfile();
  }
  render() {
    const { isAuthenticated, user } = this.props.auth;
    const { profile } = this.props.profile;
    const authLinks = (
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <Link className="nav-link" to="/feed">
            Post Feed
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/dashboard">
            Dashboard
          </Link>
        </li>
        <li className="nav-item">
          <a
            href=""
            className="nav-link dropdown-toggle dropdown-flag-toggle text-light"
            id="dropdownMenuButton"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <img
              className="rounded-circle"
              src={user.avatar}
              alt={user.name}
              style={{ width: "25px", marginRight: "5px" }}
              title="You must have a Gravatar connected to your email to display an image"
            />
          </a>
          <ul
            id="dropdownLanguages"
            className="dropdown-menu dropdown-flags dropdown-menu-right"
            aria-labelledby="dropdownMenuButton"
          >
            <li className="text-center p-1">
              {profile &&
                (user.role === 1 ? (
                  <Link
                    to={`/dashboard_admin/manage_profile`}
                    className="d-flex align-items-center"
                  >
                    Manage Dashboard
                  </Link>
                ) : (
                  <Link
                    to={`/profile/${profile.handle}`}
                    className="d-flex align-items-center"
                  >
                    Profile Page
                  </Link>
                ))}
            </li>
            <li className="text-center p-1">
              <a
                onClick={this.onLogoutClick.bind(this)}
                className="d-flex align-items-center"
              >
                Logout
              </a>
            </li>
          </ul>
        </li>
      </ul>
    );

    const guestLinks = (
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <Link className="nav-link" to="/register">
            Sign Up
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/login">
            Login
          </Link>
        </li>
      </ul>
    );

    return (
      <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
        <div className="d-flex flex-row w-100">
          <Link className="navbar-brand" to="/">
            <img src={logo} style={{ width: "40px" }} />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#mobile-nav"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div
            className="collapse navbar-collapse d-flex justify-content-between w-100"
            id="mobile-nav"
          >
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/profiles">
                  {" "}
                  Developers
                </Link>
              </li>
            </ul>
            {isAuthenticated ? authLinks : guestLinks}
          </div>
        </div>
      </nav>
    );
  }
}

Navbar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile
});

export default connect(
  mapStateToProps,
  { getCurrentProfile, logoutUser, clearCurrentProfile }
)(withRouter(Navbar));
