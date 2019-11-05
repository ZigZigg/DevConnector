import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getProfiles, disableProfile } from "../../actions/profileActions";
import OptionButton from "../common/OptionButton";
import NavBar from "./NavBar";
import ReactTable from "react-table";
import SimpleDialog from "./Dialog";
import Spinner from "../common/Spinner";
import "./style.scss";
import "react-table/react-table.css";
class ManageProfile extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      filterDev: 0,
      perPage: 10,
      selectedData: 0,
      open: false,
      currentHandle: null
    };
  }
  componentDidMount() {
    if (this.props.match.path === "/dashboard_admin/manage_profile") {
      document.getElementById("root-app").style.background = "#f1f2f7";
    }
    this.props.getProfiles(this.state.perPage, this.state.selectedData);
  }
  componentWillUnmount() {
    document.getElementById("root-app").style.background =
      "linear-gradient(to right, rgb(78, 205, 196), rgb(85, 98, 112))";
  }
  // componentDidUpdate() {
  //   this.props.getProfiles(this.state.perPage, this.state.selectedData);
  // }
  onViewAdmin = handle => {
    this.setState({
      open: true,
      currentHandle: handle
    });
  };
  onEditAdmin = id => {
    const profileData = {
      userId: id,
      disable: true
    };
    this.props.disableProfile(profileData);
    // this.props.getProfiles(this.state.perPage, this.state.selectedData);
  };
  onEnableAdmin = id => {
    const profileData = {
      userId: id,
      disable: false
    };
    this.props.disableProfile(profileData);
  };
  handleClose = value => {
    this.setState({ open: false });
  };
  render() {
    const { profiles, loading, profile } = this.props.profile;
    // console.log(this.props);
    return (
      <div className="dashboard" style={{ height: "100vh" }}>
        <div className="row" style={{ height: "100%" }}>
          <div
            className="col-md-2"
            style={{
              background: "#fff",
              boxShadow: "5px 0 10px rgba(0,0,0,.1)"
            }}
          >
            <NavBar />
          </div>
          <SimpleDialog
            currentHandle={this.state.currentHandle}
            open={this.state.open}
            onClose={this.handleClose}
          />

          <div className="col-md-10">
            <div className="profiles">
              <div className="container">
                <h2 className="my-3 text-center">Manage Profile</h2>
                <div
                  className="mt-4"
                  style={{
                    width: "100%",
                    height: "400px",
                    borderRadius: "4px",
                    background: "#fff"
                  }}
                >
                  {profiles && !loading ? (
                    <ReactTable
                      className="react-table-users"
                      columns={[
                        // {
                        //   Header: '#',
                        //   Cell: (row) => {
                        //     return <div>{(APP_CONFIG.admin.perPage * (pageNumber - 1)) + row.index + 1}</div>
                        //   },
                        //   width: 50
                        // },
                        {
                          Header: "Avatar",
                          Cell: row => {
                            return (
                              <div className="wrapper-avat">
                                <img
                                  alt="Avatar"
                                  className="rounded-circle"
                                  style={{ width: "50px", height: "50px" }}
                                  src={row.original.user.avatar}
                                />
                              </div>
                            );
                          },
                          id: "avatar",
                          width: 100
                        },
                        {
                          id: "name",
                          Header: "Name",
                          Cell: row => {
                            return <p>{row.original.user.name}</p>;
                          }
                        },
                        {
                          id: "position",
                          Header: "Position",
                          Cell: row => {
                            return <p>{row.original.status}</p>;
                          }
                        },
                        {
                          id: "skills",
                          Header: "Skills",
                          Cell: row => {
                            console.log("SKILLS", row.original.skills);
                            const arraySkill = [];
                            row.original.skills.map(value => {
                              arraySkill.push(value.value);
                            });
                            const joinArray = arraySkill.join();
                            return <p>{joinArray}</p>;
                          }
                        },
                        {
                          id: "company",
                          Header: "Company",
                          accessor: "company"
                        },
                        {
                          Header: "Action",
                          Cell: row => {
                            // console.log(row);
                            return (
                              <OptionButton
                                handle={row.original.handle}
                                id={row.original.user._id}
                                isDisable={row.original.disable}
                                // isCurrentDisable={profile.disable}
                                onView={this.onViewAdmin}
                                onEdit={this.onEditAdmin}
                                onEnable={this.onEnableAdmin}
                              />
                            );
                          },
                          id: "action"
                        }
                      ]}
                      data={profiles.profileData}
                      defaultPageSize={5}
                      loading={loading}
                      loadingText="loading"
                    >
                      {(state, makeTable, instance) => {
                        return (
                          <div
                            style={{
                              background: "#fff",
                              padding: "12px 16px"
                            }}
                          >
                            {makeTable()}
                          </div>
                        );
                      }}
                    </ReactTable>
                  ) : (
                    <Spinner />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ManageProfile.propTypes = {
  getProfiles: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  console.log(state);
  return {
    profile: state.profile
  };
};

export default connect(
  mapStateToProps,
  { getProfiles, disableProfile }
)(ManageProfile);
