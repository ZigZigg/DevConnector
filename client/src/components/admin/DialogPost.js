import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getPost } from "../../actions/postActions";
import { Dialog, DialogContent, DialogTitle } from "@material-ui/core";
import ProfileHeader from "../profile/ProfileHeader";
import ProfileAbout from "../profile/ProfileAbout";
import ProfileCreds from "../profile/ProfileCreds";
import ProfileGithub from "../profile/ProfileGithub";
import ProfilePost from "../profile/ProfilePost";
import ReactHtmlParser from "react-html-parser";
import Spinner from "../common/Spinner";
class SimpleDialog extends React.Component {
  handleClose = () => {
    this.props.onClose(this.props.selectedValue);
  };
  componentWillReceiveProps(nextProps) {
    if (this.props.currentId !== nextProps.currentId && nextProps.currentId) {
      this.props.getPost(nextProps.currentId);
    }
  }
  // componentWillUnmount() {
  //   this.props.getProfileByHandle("z");
  // }
  render() {
    const {
      classes,
      onClose,
      selectedValue,
      currentId,
      getPost,
      currentPost,
      ...other
    } = this.props;
    const { post } = currentPost;
    console.log(post);
    return (
      <Dialog
        onClose={this.handleClose}
        aria-labelledby="simple-dialog-title"
        {...other}
      >
        {!post || currentPost.loadingPost ? (
          <Spinner />
        ) : (
          <div>
            {/* <DialogTitle id="simple-dialog-title">
              Set backup accountzz
            </DialogTitle> */}
            {post && (
              <DialogContent className="dialog-content dialog-content-desktop">
                <h3
                  className="text-center p-1"
                  style={{ border: "1px solid black", borderRadius: "4px" }}
                >
                  {post.subject}
                </h3>
                <div id="profile-page" className="d-flex flex-row">
                  <div className="wrapper-avat mr-2">
                    <img
                      alt="Avatar"
                      className="rounded-circle"
                      style={{ width: "70px", height: "70px" }}
                      src={post.avatar}
                    />
                  </div>
                  <div>{ReactHtmlParser(post.text)}</div>
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
  getPost: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  currentPost: state.post
});
export default connect(
  mapStateToProps,
  { getPost }
)(SimpleDialog);
