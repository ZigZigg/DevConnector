import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import ProfileHeader from "./ProfileHeader";
import ProfileAbout from "./ProfileAbout";
import ProfileCreds from "./ProfileCreds";
import ProfileGithub from "./ProfileGithub";
import ProfilePost from "./ProfilePost";
import Spinner from "../common/Spinner";
import html2canvas from "html2canvas";
import { getProfileByHandle } from "../../actions/profileActions";

class Profile extends Component {
  componentDidMount() {
    if (this.props.match.params.handle) {
      this.props.getProfileByHandle(this.props.match.params.handle);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.profile.profile === null &&
      this.props.profile.loadingProfile
    ) {
      this.props.history.push("/not-found");
    }
  }
  onExportToPdf = e => {
    e.preventDefault();
    if (window && document) {
      const pdfConverter = require("jspdf");
      const reportDoc = document.getElementById("profile-page");
      html2canvas(reportDoc).then(canvas => {
        let imgData = canvas.toDataURL("image/jpg");
        let pdf = new pdfConverter("p", "mm", "a4");
        let width = pdf.internal.pageSize.getWidth();
        let height = pdf.internal.pageSize.getHeight();
        pdf.addImage(imgData, "JPEG", 0, 0, width, height);

        pdf.save("my_investor_report.pdf");
      });
    }
  };
  render() {
    const { profile, loadingProfile } = this.props.profile;
    let profileContent;
    console.log(profile);
    if (profile === null || loadingProfile) {
      profileContent = <Spinner />;
    } else {
      profileContent = (
        <div>
          <div className="row">
            <div className="col-md-6">
              <Link to="/profiles" className="btn btn-light mb-3 float-left">
                Back To Profiles
              </Link>
            </div>
            {/* <div className="col-md-6">
              <button
                style={{ float: "right" }}
                type="button"
                className="btn btn-warning"
                onClick={this.onExportToPdf}
              >
                Print to pdf
              </button>
            </div> */}
          </div>
          <div id="profile-page">
            <ProfileHeader profile={profile} />
            <ProfileAbout profile={profile} />
            <ProfileCreds
              education={profile.education}
              experience={profile.experience}
            />
            {profile.githubusername ? (
              <ProfileGithub username={profile.githubusername} />
            ) : null}
            <ProfilePost profile={profile} />
          </div>
        </div>
      );
    }

    return (
      <div className="container container-content">
        <div className="profile">
          <div className="container">
            <div className="row">
              <div className="col-md-12">{profileContent}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Profile.propTypes = {
  getProfileByHandle: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile
});

export default connect(
  mapStateToProps,
  { getProfileByHandle }
)(Profile);
