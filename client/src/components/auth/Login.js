import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";
import TextFieldGroup from "../common/TextFieldGroup";

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
    if (this.props.match.path === "/login") {
      document.getElementById("root-app").style.background =
        "linear-gradient(135deg, #ea5c54 0%, #bb6dec 100%)";
    }
  }

  componentWillReceiveProps(nextProps) {
    const roleUser = localStorage.getItem("role");
    console.log("ROLE", roleUser);
    if (nextProps.auth.isAuthenticated) {
      if (roleUser === "1") {
        this.props.history.push("/dashboard_admin/manage_profile");
      } else {
        this.props.history.push("/dashboard");
      }
    }

    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }
  componentWillUnmount() {
    document.getElementById("root-app").style.background =
      "linear-gradient(to right, rgb(78, 205, 196), rgb(85, 98, 112))";
  }
  onSubmit(e) {
    e.preventDefault();

    const userData = {
      email: this.state.email,
      password: this.state.password
    };

    this.props.loginUser(userData);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { errors } = this.state;

    return (
      <div className="container container-content">
        <div className="login">
          <div className="container py-5">
            <div className="row">
              <div className="col-md-8 m-auto" style={{ color: "#fff" }}>
                <h1 className="display-4 text-center">Log In</h1>
                <p className="lead text-center">
                  Sign in to your DevConnector account
                </p>
                <form onSubmit={this.onSubmit}>
                  <TextFieldGroup
                    placeholder="Email Address"
                    name="email"
                    type="email"
                    value={this.state.email}
                    onChange={this.onChange}
                    error={errors.email}
                  />

                  <TextFieldGroup
                    placeholder="Password"
                    name="password"
                    type="password"
                    value={this.state.password}
                    onChange={this.onChange}
                    error={errors.password}
                  />
                  <input
                    type="submit"
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

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { loginUser }
)(Login);
