import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import TextFieldGroup from "../common/TextFieldGroup";
import { addPost } from "../../actions/postActions";
import Editor from "../common/draftjs";
import CreatableSelect from "react-select/lib/Creatable";
class PostForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      subject: "",
      tags: [],
      errors: {}
    };

    this.onHandleChange = this.onHandleChange.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (
      newProps.post.posts.length > 0 &&
      this.props.post.posts.length < newProps.post.posts.length
    ) {
      this.props.history.push("/feed");
    }
    if (newProps.errors) {
      this.setState({ errors: newProps.errors });
    }
  }

  onSubmit(e) {
    e.preventDefault();

    const { user } = this.props.auth;

    const newPost = {
      text: this.state.text,
      subject: this.state.subject,
      tags: this.state.tags,
      name: user.name,
      avatar: user.avatar
    };

    this.props.addPost(newPost);
    this.setState({ text: "" });
  }

  onHandleChange = value => {
    this.setState({ text: value });
  };
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  handleChangeTag = (newValue, actionMeta) => {
    console.log(newValue);
    this.setState({ tags: newValue });
  };
  render() {
    const { errors } = this.state;
    console.log(this.state.tags);
    return (
      <div className="container container-content">
        <div className="post-form mb-3">
          <div className="card card-info">
            <div className="card-header bg-info text-white">
              Say Somthing...
            </div>
            <div className="card-body">
              <form onSubmit={this.onSubmit}>
                <div className="form-group">
                  <TextFieldGroup
                    placeholder="* Subject"
                    name="subject"
                    value={this.state.subject}
                    onChange={this.onChange}
                    error={errors.subject}
                    info="Post Subject"
                  />
                  {/* <TextFieldGroup
                  placeholder="* Tags"
                  name="tags"
                  value={this.state.tags}
                  onChange={this.onChange}
                  error={errors.tags}
                  info="Tags help the right people find and answer your question"
                /> */}
                  <CreatableSelect
                    isClearable
                    isMulti
                    onChange={this.handleChangeTag}
                    className="mb-2"
                    placeholder="* Create tags.... "
                  />
                  <small className="form-text text-muted mb-3">
                    Create tags for post, Ex:php,node,react....{" "}
                  </small>
                  <Editor onChange={this.onHandleChange} maxLength={1024} />
                </div>
                <button type="submit" className="btn btn-dark">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

PostForm.propTypes = {
  addPost: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  post: state.post,
  auth: state.auth,
  errors: state.errors
});

export default withRouter(
  connect(
    mapStateToProps,
    { addPost }
  )(PostForm)
);
