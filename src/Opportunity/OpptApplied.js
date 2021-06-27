import React, { useState, useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { convertDateShort } from "../Helper/DateFunctions";
import CustomPagination from "../Helper/CustomPagination";
import "./OpptApplied.css";

function OpptApplied(props) {
  const { currentUser, authAxios } = useAuth();
  const [opportunitiesApplied, setOpportunitiesApplied] = useState("");
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    authAxios
      .get(
        `https://volunteer-land-server.herokuapp.com/api/user/${currentUser.id}/opportunitiesapplied?page=${props.page}`
      )
      .then((applications) => {
        setOpportunitiesApplied(applications.data);
      })
      .catch((error) => console.log(`Error: ${error}`));

    return () => {
      setRefresh(false);
    };
  }, [refresh, props.page, authAxios, currentUser.id]);

  const handleWithdrawApplication = (applicationId) => {
    authAxios
      .delete(
        `https://volunteer-land-server.herokuapp.com/api/application/${applicationId}`
      )
      .then((response) => {
        setRefresh(true);
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  return (
    <div className="opptApplied">
      {opportunitiesApplied &&
        opportunitiesApplied.results.map((opportunitiesApplied) => (
          <div
            className="opportunityThumb myOpptThumb card"
            style={{ height: "490px" }}
            key={opportunitiesApplied.id}
          >
            <Link to={`/opportunity/${opportunitiesApplied.opportunity.id}`}>
              <div className="opportunityThumbImage">
                <img
                  src={opportunitiesApplied.opportunity.image_url}
                  alt="opportunity_image"
                />
              </div>
              <div className="myOpptInfo">
                <p className="thumbTitle">
                  {opportunitiesApplied.opportunity.position}
                </p>
                <p>
                  {opportunitiesApplied.opportunity.company_name} ·{" "}
                  {opportunitiesApplied.opportunity.location}
                </p>
              </div>
            </Link>
            <div className="myOpptActionInfo">
              <p>
                Applied on {convertDateShort(opportunitiesApplied.timestamp)}
              </p>
              <Button
                variant="danger"
                className="mt-3"
                onClick={() =>
                  handleWithdrawApplication(opportunitiesApplied.id)
                }
              >
                Withdraw Application
              </Button>
            </div>
          </div>
        ))}
      <div className="paginator">
        {opportunitiesApplied && (
          <CustomPagination
            count={opportunitiesApplied.count}
            currentPage={parseInt(props.page)}
            next={opportunitiesApplied.next}
            previous={opportunitiesApplied.previous}
            url="/myopportunities/applied"
          />
        )}
      </div>
    </div>
  );
}

export default OpptApplied;
