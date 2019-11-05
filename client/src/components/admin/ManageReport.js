import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getProfileReport, disableProfile } from "../../actions/profileActions";
import OptionButton from "../common/OptionButton";
import NavBar from "./NavBar";
import ReactTable from "react-table";
import SimpleDialog from "./Dialog";
import Spinner from "../common/Spinner";
import "./style.scss";
import ReportCard from "./ReportCard";
import { Doughnut } from "react-chartjs-2";
import Profile from "@material-ui/icons/Work";
import Person from "@material-ui/icons/Person";
import Mms from "@material-ui/icons/Mms";
import SmsFailed from "@material-ui/icons/SmsFailed";

import "react-table/react-table.css";
const styles = {
  flex: { display: "flex" },
  flexColumn: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "30px"
  },
  leftCol: { flex: 1, marginRight: "1em" },
  rightCol: { flex: 1, marginLeft: "1em" },
  singleCol: { marginTop: "2em", marginBottom: "2em" }
};

class ManageReport extends React.PureComponent {
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
    if (this.props.match.path === "/dashboard_admin/manage_report") {
      document.getElementById("root-app").style.background = "#f1f2f7";
    }
    this.props.getProfileReport();
  }
  componentWillUnmount() {
    document.getElementById("root-app").style.background =
      "linear-gradient(to right, rgb(78, 205, 196), rgb(85, 98, 112))";
  }

  render() {
    console.log(this.props);
    const { profileReport } = this.props;
    const dataLabel = [];
    const datas = [];
    if (profileReport) {
      for (let prop in profileReport.skill) {
        dataLabel.push(prop);
        datas.push(profileReport.skill[prop]);
      }
    }
    console.log(dataLabel, datas);
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

          <div className="col-md-10">
            <div className="profiles">
              <div className="container">
                <h2 className="my-3 text-center">Analysis Report</h2>
                <div style={styles.flexColumn}>
                  {profileReport && (
                    <div style={styles.flex}>
                      <ReportCard
                        value={profileReport.totalCV}
                        label={"Total Profile"}
                        bgColor="#31708f"
                        icon={Profile}
                      />
                      <ReportCard
                        value={profileReport.totalUser}
                        label={"Total User"}
                        bgColor="#8e5ea2"
                        icon={Person}
                      />
                      <ReportCard
                        value={profileReport.totalPost}
                        label={"Total Post"}
                        bgColor="#3cba9f"
                        icon={Mms}
                      />
                      <ReportCard
                        value={profileReport.pendingPost}
                        label={"Pending Post"}
                        bgColor="#c45850"
                        icon={SmsFailed}
                      />
                    </div>
                  )}
                </div>
                <Doughnut
                  data={{
                    labels: dataLabel,
                    datasets: [
                      {
                        backgroundColor: [
                          "#3e95cd",
                          "#8e5ea2",
                          "#3cba9f",
                          "#e8c3b9",
                          "#c45850"
                        ],
                        data: datas
                      }
                    ]
                  }}
                  options={{
                    legend: {
                      display: true
                    },
                    title: {
                      display: true,
                      text: "Skills Analysis"
                    }
                  }}
                  style={{ marginTop: "20px" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ManageReport.propTypes = {
  getProfileReport: PropTypes.func.isRequired,
  profileReport: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  console.log(state);
  return {
    profileReport: state.profile.profileReport
  };
};

export default connect(
  mapStateToProps,
  { getProfileReport, disableProfile }
)(ManageReport);
