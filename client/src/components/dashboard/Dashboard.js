import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getCurrentProfile, deleteAccount } from "../../actions/profileActions";
import { getCurrentUser } from "../../actions/authActions";
import Spinner from "../common/Spinner";
import ProfileActions from "./ProfileActions";
import Experience from "./Experience";
import Education from "./Education";

class Dashboard extends Component {
  componentDidMount() {
    this.props.getCurrentUser();
    this.props.getCurrentProfile();
  }

  onDeleteClick(e) {
    this.props.deleteAccount();
    this.props.history.push("/profiles");
  }

  render() {
    const { user, userData } = this.props.auth;
    const { profile, loadingProfile } = this.props.profile;

    let dashboardContent;

    if (profile === null || loadingProfile) {
      dashboardContent = <Spinner />;
    } else {
      // Check if logged in user has profile data
      if (Object.keys(profile).length > 0) {
        dashboardContent = (
          <div className="dashboard-container position-relative">
            {profile.disable && (
              <div
                className="position-absolute login-financial d-flex"
                style={{ zIndex: "10" }}
              >
                <div className="col-md-6 col-12 m-auto text-center">
                  <img
                    alt="lock"
                    src="https://cdn2.iconfinder.com/data/icons/stomach-symptoms-glyph/64/154_constipation-lock-latch-512.png"
                    className="p-4 img-lock"
                    style={{ width: "150px" }}
                  />
                </div>
              </div>
            )}

            <p className="lead text-muted">
              Welcome{" "}
              <Link to={`/profile/${profile.handle}`}>{userData.name}</Link>
            </p>
            <ProfileActions />
            <Experience experience={profile.experience} />
            <Education education={profile.education} />
            <div style={{ marginBottom: "60px" }} />
            <button
              onClick={this.onDeleteClick.bind(this)}
              className="btn btn-danger"
            >
              Reset Profile
            </button>
          </div>
        );
      } else {
        // User is logged in but has no profile
        dashboardContent = (
          <div>
            <p className="lead text-muted">Welcome {userData.name}</p>
            <p>You have not yet setup a profile, please add some info</p>
            <Link to="/create-profile" className="btn btn-lg btn-info">
              Create Profile
            </Link>
          </div>
        );
      }
    }
    console.log(profile);
    return (
      <div className="container container-content">
        <div className="dashboard">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <h1 className="display-4">Dashboard</h1>
                {dashboardContent}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getCurrentProfile, deleteAccount, getCurrentUser }
)(withRouter(Dashboard));
