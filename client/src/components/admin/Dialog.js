import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getProfileByHandle } from "../../actions/profileActions";
import { Dialog, DialogContent, DialogTitle } from "@material-ui/core";
import ProfileHeader from "../profile/ProfileHeader";
import ProfileAbout from "../profile/ProfileAbout";
import ProfileCreds from "../profile/ProfileCreds";
import ProfileGithub from "../profile/ProfileGithub";
import ProfilePost from "../profile/ProfilePost";
import Spinner from "../common/Spinner";
class SimpleDialog extends React.Component {
  handleClose = () => {
    this.props.onClose(this.props.selectedValue);
  };
  componentWillReceiveProps(nextProps) {
    if (
      this.props.currentHandle !== nextProps.currentHandle &&
      nextProps.currentHandle
    ) {
      this.props.getProfileByHandle(nextProps.currentHandle);
    }
  }
  componentWillUnmount() {
    this.props.getProfileByHandle("z");
  }
  render() {
    const {
      classes,
      onClose,
      selectedValue,
      currentHandle,
      getProfileByHandle,
      currentProfile,
      ...other
    } = this.props;
    const { profile } = currentProfile;
    return (
      <Dialog
        onClose={this.handleClose}
        aria-labelledby="simple-dialog-title"
        {...other}
      >
        {!profile || currentProfile.loadingProfile ? (
          <Spinner />
        ) : (
          <div>
            {/* <DialogTitle id="simple-dialog-title">
              Set backup accountzz
            </DialogTitle> */}
            {profile && (
              <DialogContent className="dialog-content dialog-content-desktop">
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
              </DialogContent>
            )}
          </div>
        )}
      </Dialog>
    );
  }
}

SimpleDialog.propTypes = {
  getProfileByHandle: PropTypes.func.isRequired,
  currentProfile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  currentProfile: state.profile
});
export default connect(
  mapStateToProps,
  { getProfileByHandle }
)(SimpleDialog);
