import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { getPosts } from "../../actions/postActions";
import { withStyles } from "@material-ui/core/styles";
import red from "@material-ui/core/colors/red";
import { Link } from "react-router-dom";
import _ from "lodash";
const styles = theme => ({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end"
  },
  icon: {
    margin: theme.spacing.unit * 2,
    color: "#fff",
    fontSize: "45px",
    cursor: "pointer"
  },
  iconHover: {
    margin: theme.spacing.unit * 2,
    "&:hover": {
      color: red[800]
    }
  }
});
class ProfilePost extends Component {
  componentDidMount() {
    this.props.getPosts();
  }
  render() {
    const { profile, post } = this.props;
    const currentPost = _.filter(post.posts, ["user", profile.user._id]);
    return (
      <div className="post-profile">
        {currentPost.length > 0 && (
          <div className="post-header">
            <h3 className="mb-4">Top posts</h3>
          </div>
        )}

        {currentPost.map((item, key) => {
          return (
            <div
              key={key}
              className="d-flex flex-row p-3 card mb-2 align-items-center"
            >
              <div>
                <i className="fa fa-question-square mx-3" />
              </div>
              <div className="btn btn-secondary mx-3">
                Respone
                <span className="badge badge-light">
                  {item.comments.length}
                </span>
              </div>
              <span className="badge badge-success mx-3">
                Vote: {item.likes.length}
              </span>
              {item.published ? (
                <span className="badge badge-primary mx-3">Published</span>
              ) : (
                <span className="badge badge-danger mx-3">Unpublished</span>
              )}
              <div>
                <Link to={`/post/${item._id}`} style={{ color: "#17a2b8" }}>
                  {item.subject || "Subject"}
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

ProfilePost.propTypes = {
  getPosts: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  post: state.post
});

export default withRouter(
  connect(
    mapStateToProps,
    { getPosts }
  )(withStyles(styles)(ProfilePost))
);
