import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useAuth } from "../Context/AuthContext";
import { Link } from "react-router-dom";
import CustomPagination from "../Helper/CustomPagination";
import "./OpptPosted.css";

function OpptPosted(props) {
  const { currentUser, authAxios } = useAuth();
  const [opportunitiesPosted, setOpportunitiesPosted] = useState("");
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    authAxios
      .get(
        `https://volunteer-land-server.herokuapp.com/api/user/${currentUser.id}/opportunitiesposted?page=${props.page}`
      )
      .then((opportunities) => {
        setOpportunitiesPosted(opportunities.data);
      })
      .catch((error) => console.log(`Error: ${error}`));

    return () => {
      setRefresh(false);
    };
  }, [refresh, props.page, authAxios, currentUser.id]);

  const handleDeleteOpportunity = (opportunityId) => {
    authAxios
      .delete(
        `https://volunteer-land-server.herokuapp.com/api/opportunity/${opportunityId}`
      )
      .then((response) => {
        setRefresh(true);
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  const handleCloseOpportunity = (opportunityId) => {
    authAxios
      .patch(
        `https://volunteer-land-server.herokuapp.com/api/opportunity/${opportunityId}`,
        {
          is_active: false,
        }
      )
      .then((response) => {
        setRefresh(true);
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  return (
    <div className="opptPosted">
      {opportunitiesPosted &&
        opportunitiesPosted.results.map((postedOpportunity) => (
          <div
            className="opportunityThumb myOpptThumb card"
            style={{ height: "545px" }}
            key={postedOpportunity.id}
          >
            <Link to={`/opportunity/${postedOpportunity.id}`}>
              <div className="opportunityThumbImage">
                <img
                  src={postedOpportunity.image_url}
                  alt="opportunity_image"
                />
              </div>
              <div className="myOpptInfo">
                <p className="thumbTitle">{postedOpportunity.position}</p>
                <p>
                  {postedOpportunity.company_name} ·{" "}
                  {postedOpportunity.location}
                </p>
              </div>
            </Link>

            <div className="myOpptActionInfo">
              {postedOpportunity.applicant_count > 0 ? (
                <p style={{ color: "blue" }}>
                  <Link
                    to={`/opportunity/${postedOpportunity.id}/applications`}
                  >
                    {postedOpportunity.applicant_count} applicant(s)
                  </Link>
                </p>
              ) : (
                <p>No applicants yet</p>
              )}

              {postedOpportunity.is_active ? (
                <Button
                  variant="warning"
                  className="mt-3"
                  onClick={() => handleCloseOpportunity(postedOpportunity.id)}
                >
                  Close opportunity
                </Button>
              ) : (
                <Button variant="warning" className="mt-3" disabled>
                  Opportunity closed
                </Button>
              )}

              <Button
                variant="danger"
                className="mt-3"
                onClick={() => handleDeleteOpportunity(postedOpportunity.id)}
              >
                Remove opportunity
              </Button>
            </div>
          </div>
        ))}
      <div className="paginator">
        {opportunitiesPosted && (
          <CustomPagination
            count={opportunitiesPosted.count}
            currentPage={parseInt(props.page)}
            next={opportunitiesPosted.next}
            previous={opportunitiesPosted.previous}
            url="/myopportunities/posted"
          />
        )}
      </div>
    </div>
  );
}

export default OpptPosted;
