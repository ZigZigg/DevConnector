import React, { Component } from "react";
import { Link } from "react-router-dom";

class NavBar extends Component {
  render() {
    return (
      <ul id="side-main-menu" className="sidebar-menu sidebar-menu__marginTop">
        <li className="py-2 ml-3">
          <div className="d-flex">
            <Link
              className="active d-flex align-items-center main-menu-collapse"
              to="/dashboard_admin/manage_profile"
              style={{ width: "100%", height: "50px" }}
            >
              <i className="fa fa-dashboard" />
              <span className="pl-2">Manage Profiles</span>
            </Link>
          </div>
        </li>
        <li className="py-2 ml-3 ">
          <div className="d-flex">
            <Link
              className="d-flex align-items-center main-menu-collapse"
              to="/dashboard_admin/manage_post"
              style={{ width: "100%", height: "50px" }}
            >
              <i className="fa fa-user" />
              <span className="pl-2">Manage Posts</span>
            </Link>
          </div>
        </li>
        <li className="py-2 ml-3">
          <div className="d-flex">
            <Link
              className="d-flex align-items-center main-menu-collapse"
              to="/dashboard_admin/manage_report"
              style={{ width: "100%", height: "50px" }}
            >
              <i className="fa fa-comments-o" />
              <span className="pl-2">Analysis Report</span>
            </Link>
          </div>
        </li>
      </ul>
    );
  }
}

export default NavBar;
