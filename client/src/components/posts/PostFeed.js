import React, { Component } from "react";
import PropTypes from "prop-types";
import PostItem from "./PostItem";

class PostFeed extends Component {
  render() {
    const { posts } = this.props;

    return posts.length > 0 ? (
      posts.map(post => {
        return post.published && <PostItem key={post._id} post={post} />;
      })
    ) : (
      <div>No post found...</div>
    );
  }
}

PostFeed.propTypes = {
  posts: PropTypes.array.isRequired
};

export default PostFeed;
