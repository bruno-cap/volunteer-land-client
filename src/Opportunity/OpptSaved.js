import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { convertDateShort } from "../Helper/DateFunctions";
import CustomPagination from "../Helper/CustomPagination";
import "./OpptSaved.css";

function OpptSaved(props) {
  const { currentUser, authAxios } = useAuth();
  const [savedOpportunities, setSavedOpportunities] = useState("");
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    authAxios
      .get(
        `https://volunteer-land-server.herokuapp.com/api/user/${currentUser.id}/opportunitiessaved?page=${props.page}`
      )
      .then((opportunities) => {
        setSavedOpportunities(opportunities.data);
      })
      .catch((error) => console.log(`Error: ${error}`));

    return () => {
      setRefresh(false);
    };
  }, [refresh, authAxios, props.page, currentUser.id]);

  const handleUnsaveApplication = (opportunityId) => {
    authAxios
      .delete(
        `https://volunteer-land-server.herokuapp.com/api/user/${currentUser.id}/opportunitysaved/${opportunityId}`
      )
      .then((response) => {
        setRefresh(true);
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  return (
    <div className="opptSaved">
      {savedOpportunities &&
        savedOpportunities.results.map((savedOpportunity) => (
          <div
            className="opportunityThumb myOpptThumb card"
            style={{ height: "490px" }}
            key={savedOpportunity.id}
          >
            <Link to={`/opportunity/${savedOpportunity.opportunity.id}`}>
              <div className="opportunityThumbImage">
                <img
                  src={savedOpportunity.opportunity.image_url}
                  alt="opportunity_image"
                />
              </div>
              <div className="myOpptInfo">
                <p className="thumbTitle">
                  {savedOpportunity.opportunity.position}
                </p>
                <p>
                  {savedOpportunity.opportunity.company_name} ·{" "}
                  {savedOpportunity.opportunity.location}
                </p>
              </div>
            </Link>

            <div className="myOpptActionInfo">
              <p>Saved on {convertDateShort(savedOpportunity.timestamp)}</p>
              <Button
                variant="danger"
                className="mt-3"
                onClick={() =>
                  handleUnsaveApplication(savedOpportunity.opportunity.id)
                }
              >
                Unsave
              </Button>
            </div>
          </div>
        ))}
      <div className="paginator">
        {savedOpportunities && (
          <CustomPagination
            count={savedOpportunities.count}
            currentPage={parseInt(props.page)}
            next={savedOpportunities.next}
            previous={savedOpportunities.previous}
            url="/myopportunities"
          />
        )}
      </div>
    </div>
  );
}

export default OpptSaved;
