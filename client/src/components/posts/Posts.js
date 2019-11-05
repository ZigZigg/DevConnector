import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PostFeed from "./PostFeed";
import Spinner from "../common/Spinner";
import { getPosts } from "../../actions/postActions";
import { withStyles } from "@material-ui/core/styles";
import red from "@material-ui/core/colors/red";
import { AddCircleOutline as AddIcon } from "@material-ui/icons";
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
class Posts extends Component {
  onCreatePost = e => {
    this.props.history.push("/feed/create-post");
  };
  componentDidMount() {
    this.props.getPosts();
  }
  handleSearch = e => {
    if (e.which === 13 || e.keyCode === 13 || e.key === "Enter") {
      const { value } = e.target;
      this.props.getPosts(value);
    }
  };
  render() {
    const { classes } = this.props;
    const { posts, loading } = this.props.post;
    let postContent;

    if (posts === null || loading) {
      postContent = <Spinner />;
    } else {
      postContent = <PostFeed posts={posts} />;
    }

    return (
      <div className="container container-content">
        <div className="feed">
          <div className="search-feed">
            <input
              onKeyPress={this.handleSearch}
              type="text"
              placeholder="Search by tags..."
            />
            <div className="search" />
          </div>
          <div className="d-flex flex-row align-items-center">
            <AddIcon onClick={this.onCreatePost} className={classes.icon} />
            <span
              style={{ fontSize: "25px", fontWeight: "600", color: "#fff" }}
            >
              Create Post
            </span>
          </div>

          <div className="container">
            <div className="row">
              <div className="col-md-12">
                {/* <PostForm /> */}
                {postContent}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Posts.propTypes = {
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
  )(withStyles(styles)(Posts))
);
