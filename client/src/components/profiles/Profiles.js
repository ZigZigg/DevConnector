import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Spinner from "../common/Spinner";
import ProfileItem from "./ProfileItem";
import ReactPaginate from "react-paginate";
import { getProfiles } from "../../actions/profileActions";

class Profiles extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filterDev: 0,
      perPage: 5,
      selectedData: 0
    };
  }
  componentDidMount() {
    this.props.getProfiles(this.state.perPage, this.state.selectedData);
  }
  handlePageClick = data => {
    let selected = data.selected;
    this.props.getProfiles(this.state.perPage, selected);
  };
  onFilterPaginate = e => {
    const { value } = e.target;

    this.setState({
      perPage: value
    });
    this.props.getProfiles(value, this.state.selectedData);
  };
  onFilterDeveloper = e => {
    const { value } = e.target;

    this.setState({
      filterDev: value
    });
    console.log(value);
    this.props.getProfiles(this.state.perPage, this.state.selectedData, value);
  };
  render() {
    const { profiles, loading } = this.props.profile;
    const sizeData = profiles
      ? Math.ceil(profiles.total / this.state.perPage)
      : 0;
    let profileItems;

    if ((profiles && profiles.profileData === null) || loading) {
      profileItems = <Spinner />;
    } else {
      if (profiles && profiles.profileData.length > 0) {
        profileItems = profiles.profileData.map(profile => (
          <ProfileItem key={profile._id} profile={profile} />
        ));
      } else {
        profileItems = <h4>No profiles found...</h4>;
      }
    }

    return (
      <div className="container container-content">
        <div className="profiles">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <h1 className="display-4 text-center">Developer Profiles</h1>
                <p className="lead text-center">
                  Browse and connect with developers
                </p>
                <div className="d-flex justify-content-between mb-2">
                  <select
                    onChange={this.onFilterDeveloper}
                    className="float-left"
                  >
                    <option value={0}>Newest Developers</option>
                    <option value={1}>Most post</option>
                  </select>
                  <select
                    onChange={this.onFilterPaginate}
                    className="float-right"
                  >
                    <option value={5}>5 items</option>
                    <option value={10}>10 items</option>
                  </select>
                </div>
                {profileItems}
                {sizeData > 1 && (
                  <ReactPaginate
                    previousLabel={"previous"}
                    nextLabel={"next"}
                    breakLabel={"..."}
                    breakClassName={"break-me"}
                    pageCount={sizeData}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={sizeData}
                    onPageChange={this.handlePageClick}
                    containerClassName={"pagination"}
                    subContainerClassName={"pages pagination"}
                    activeClassName={"active"}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Profiles.propTypes = {
  getProfiles: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile
});

export default connect(
  mapStateToProps,
  { getProfiles }
)(Profiles);
