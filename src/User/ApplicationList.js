import React, { useState, useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import { Link } from "react-router-dom";
import { convertDateLong } from "../Helper/DateFunctions";
import axios from "axios";
import "./ApplicationList.css";

function ApplicationList(props) {
  const { authAxios } = useAuth();
  const [opportunityDetails, setOpportunityDetails] = useState("");
  const [applicationList, setApplicationList] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    axios
      .get(
        `https://volunteer-land-server.herokuapp.com/api/opportunity/${props.opportunityId}`
      )
      .then((opportunity) => {
        setOpportunityDetails(opportunity.data);
      })
      .catch((error) => {
        console.log(`Error: ${error}`);
      });

    authAxios
      .get(
        `https://volunteer-land-server.herokuapp.com/api/opportunity/${props.opportunityId}/applications`
      )
      .then((applications) => {
        setApplicationList(applications.data);
      })
      .catch((error) => console.log(`Error: ${error}`));

    return () => {
      setRefresh(false);
    };
  }, [refresh, authAxios, props.opportunityId]);

  return (
    <div className="applicationList bigBox">
      <h2>
        {opportunityDetails.position} at {opportunityDetails.company_name}
      </h2>
      <h3>Applicant List</h3>
      <div id="applicants">
        {applicationList.length > 0 &&
          applicationList.map((application, i) => (
            <Link
              to={`/opportunity/${props.opportunityId}/application/${application.id}`}
              className="d-flex justify-content-between align-items-center"
              key={application.id}
            >
              <p>
                {i + 1}. {application.user.first_name}{" "}
                {application.user.last_name}
              </p>
              <p>{convertDateLong(application.timestamp)}</p>
            </Link>
          ))}
      </div>
    </div>
  );
}

export default ApplicationList;
