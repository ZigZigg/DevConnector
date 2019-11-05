import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import TextFieldGroup from "../common/TextFieldGroup";
import TextAreaFieldGroup from "../common/TextAreaFieldGroup";
import InputGroup from "../common/InputGroup";
import SelectListGroup from "../common/SelectListGroup";
import { getCurrentUser, editProfile } from "../../actions/authActions";
import isEmpty from "../../validation/is-empty";

class EditUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displaySocialInputs: false,
      name: "",
      address: "",
      phone: "",
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.props.getCurrentUser();
  }
  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }

    if (nextProps.auth.userData) {
      const userData = nextProps.auth.userData;

      // Set component fields state
      this.setState({
        name: userData.name,
        address: userData.address,
        phone: userData.phone
      });
    }
  }

  onSubmit(e) {
    e.preventDefault();

    const profileData = {
      name: this.state.name,
      address: this.state.address,
      phone: this.state.phone
    };

    this.props.editProfile(profileData, this.props.history);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { errors, displaySocialInputs } = this.state;

    let socialInputs;

    if (displaySocialInputs) {
      socialInputs = (
        <div>
          <TextFieldGroup
            placeholder="New password"
            name="password"
            onChange={this.onChange}
            error={errors.name}
            type="password"
          />
          <TextFieldGroup
            placeholder="Confirm newpassword"
            name="confirm_password"
            onChange={this.onChange}
            error={errors.name}
            type="password"
          />
        </div>
      );
    }

    // Select options for status
    // const options = [
    //   { label: "* Select Professional Status", value: 0 },
    //   { label: "Developer", value: "Developer" },
    //   { label: "Junior Developer", value: "Junior Developer" },
    //   { label: "Senior Developer", value: "Senior Developer" },
    //   { label: "Manager", value: "Manager" },
    //   { label: "Student or Learning", value: "Student or Learning" },
    //   { label: "Instructor or Teacher", value: "Instructor or Teacher" },
    //   { label: "Intern", value: "Intern" },
    //   { label: "Other", value: "Other" }
    // ];

    return (
      <div className="container container-content">
        <div className="create-profile">
          <div className="container">
            <div className="row">
              <div className="col-md-8 m-auto">
                <Link to="/dashboard" className="btn btn-light">
                  Go Back
                </Link>
                <h1 className="display-4 text-center">Edit User</h1>
                <small className="d-block pb-3">* = required fields</small>
                <form onSubmit={this.onSubmit} className="dashboard-container">
                  <TextFieldGroup
                    placeholder="* Full Name"
                    name="name"
                    value={this.state.name}
                    onChange={this.onChange}
                    error={errors.name}
                    info="Full name of your user data"
                  />
                  <TextFieldGroup
                    placeholder="Address"
                    name="address"
                    value={this.state.address}
                    onChange={this.onChange}
                    error={errors.address}
                    info="Your Address"
                  />
                  <TextFieldGroup
                    placeholder="Phone Number"
                    name="phone"
                    value={this.state.phone}
                    onChange={this.onChange}
                    error={errors.phone}
                    info="Your phone number"
                  />

                  <div className="mb-3">
                    <button
                      type="button"
                      onClick={() => {
                        this.setState(prevState => ({
                          displaySocialInputs: !prevState.displaySocialInputs
                        }));
                      }}
                      className="btn btn-light"
                    >
                      Change Password
                    </button>
                    <span className="text-muted">Optional</span>
                  </div>
                  {socialInputs}
                  <input
                    type="submit"
                    value="Submit"
                    className="btn btn-info btn-block mt-4"
                  />
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

EditUser.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { getCurrentUser, editProfile }
)(withRouter(EditUser));
