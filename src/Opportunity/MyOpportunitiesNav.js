import React from "react";
import { NavLink } from "react-router-dom";
import "./MyOpportunitiesNav.css";

function MyOpportunitiesNav() {
  return (
    <div
      className="myOpportunitiesNav smallBox d-flex justify-content-between align-items-center"
      style={{ width: "300px", height: "50px" }}
    >
      <NavLink
        exact
        to={`/myopportunities`}
        activeClassName="activeMyOpptLink"
        className="hyperlinkUnderlineStyling"
      >
        Saved
      </NavLink>
      <NavLink
        to={`/myopportunities/applied`}
        activeClassName="activeMyOpptLink"
        className="hyperlinkUnderlineStyling"
      >
        Applied
      </NavLink>
      <NavLink
        to={`/myopportunities/posted`}
        activeClassName="activeMyOpptLink"
        className="hyperlinkUnderlineStyling"
      >
        Posted
      </NavLink>
    </div>
  );
}

export default MyOpportunitiesNav;
