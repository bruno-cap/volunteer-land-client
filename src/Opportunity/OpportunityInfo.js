import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";
import { convertDateLong } from "../Helper/DateFunctions";
import { Link } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import axios from "axios";
import "./OpportunityInfo.css";

function OpportunityInfo(props) {
  const [opportunity, setOpportunity] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [applicationId, setApplicationId] = useState("");
  const [didApply, setDidApply] = useState(false);
  const { currentUser, authAxios } = useAuth();

  const history = useHistory();

  useEffect(() => {
    axios
      .get(
        `https://volunteer-land-server.herokuapp.com/api/opportunity/${props.opportunityId}`
      )
      .then((opportunity) => {
        setOpportunity(opportunity.data);
      })
      .catch((error) => {
        console.log(`Error: ${error}`);
      });
  }, [props.opportunityId]);

  useEffect(() => {
    const checkSaved = async () => {
      // if logged in and user hasn't posted the opportunity, check if user has applied
      currentUser &&
        (await authAxios
          .get(
            `https://volunteer-land-server.herokuapp.com/api/user/${currentUser.id}/opportunitysaved/${props.opportunityId}`
          )
          .then((opportunity) => {
            setIsSaved(true);
          })
          .catch((error) => {
            // no action required
          }));
    };

    const checkApplied = async () => {
      // if logged in and user hasn't posted the opportunity, check if user has applied
      currentUser &&
        (await authAxios
          .get(
            `https://volunteer-land-server.herokuapp.com/api/user/${currentUser.id}/opportunityapplied/${props.opportunityId}`
          )
          .then((application) => {
            setDidApply(true);
            setApplicationId(application.data.id);
          })
          .catch((error) => {
            // no action required
          }));
    };
    const run = async () => {
      await checkSaved();
      await checkApplied();
    };
    run();
  }, [authAxios, currentUser, props.opportunityId]);

  const addToFavorites = () => {
    !currentUser
      ? history.push("/login")
      : authAxios
          .post(
            `https://volunteer-land-server.herokuapp.com/api/user/${props.opportunityId}/opportunitiessaved`,
            {
              user: currentUser.id,
              opportunity: props.opportunityId,
            }
          )
          .then((response) => {
            setIsSaved(true);
          })
          .catch((error) => {
            console.log(error.response);
          });
  };

  const removeFromFavorites = () => {
    authAxios
      .delete(
        `https://volunteer-land-server.herokuapp.com/api/user/${currentUser.id}/opportunitysaved/${props.opportunityId}`
      )
      .then((response) => {
        setIsSaved(false);
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  return (
    <div className="opportunityInfo bigBox">
      {opportunity && (
        <>
          <div className="opportunityImage">
            <img src={opportunity.image_url} alt="opportunity Img" />
          </div>

          <div className="opportunityDetails">
            <h2>{opportunity.position}</h2>
            <p>
              <Link to={`/company/${opportunity.company}`}>
                {opportunity.company_name}
              </Link>{" "}
              · {opportunity.location}
            </p>
            <div className="opportunityAction">
              {currentUser && didApply && applicationId && (
                <Link
                  to={`/opportunity/${opportunity.id}/application/${applicationId}`}
                >
                  <Button variant="primary" className="mr-3">
                    View Application
                  </Button>
                </Link>
              )}

              {!currentUser && (
                <Link to={`/opportunity/${opportunity.id}/apply`}>
                  <Button variant="primary" className="mr-3">
                    Apply
                  </Button>
                </Link>
              )}

              {currentUser &&
                opportunity.is_active &&
                opportunity.user !== currentUser.id &&
                !didApply && (
                  <Link to={`/opportunity/${opportunity.id}/apply`}>
                    <Button variant="primary" className="mr-3">
                      Apply
                    </Button>
                  </Link>
                )}

              {currentUser && opportunity.user === currentUser.id && (
                <Button variant="primary" disabled className="mr-3">
                  Posted by you
                </Button>
              )}

              {!opportunity.is_active && (
                <Button variant="secondary" className="mr-3" disabled>
                  Closed
                </Button>
              )}

              {!currentUser && (
                <FavoriteBorderIcon
                  onClick={addToFavorites}
                  fontSize="large"
                  style={{ cursor: "pointer" }}
                />
              )}

              {currentUser && opportunity.is_active && !isSaved && (
                <FavoriteBorderIcon
                  onClick={addToFavorites}
                  fontSize="large"
                  style={{ cursor: "pointer" }}
                />
              )}

              {currentUser && opportunity.is_active && isSaved && (
                <FavoriteIcon
                  onClick={removeFromFavorites}
                  color="secondary"
                  fontSize="large"
                  style={{ cursor: "pointer" }}
                />
              )}
            </div>
          </div>
          <div className="opportunityDescription">
            <p>{opportunity.description}</p>
            <p className="timestamp mt-4">
              Added on {convertDateLong(opportunity.timestamp)}
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export default OpportunityInfo;
