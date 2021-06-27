import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import OpportunityThumb from "./OpportunityThumb";
import CustomPagination from "../Helper/CustomPagination";
import axios from "axios";
import "./OpportunitySearchResults.css";

function OpportunitySearchResults(props) {
  const history = useHistory();
  const [opportunityList, setOpportunityList] = useState("");
  useEffect(() => {
    props.opportunity === "blank" && props.location === "blank"
      ? history.push("/opportunities")
      : axios
          .get(
            `https://volunteer-land-server.herokuapp.com/api/opportunitysearch/${props.opportunity}/in/${props.location}?page=${props.page}`
          )
          .then((opportunities) => {
            setOpportunityList(opportunities.data);
          })
          .catch((error) => console.log(`Error: ${error}`));
  }, [props.page, props.opportunity, props.location, history]);

  return (
    <div className="opportunitySearchResults text-center">
      <h2>
        Search results for
        {props.opportunity !== "blank" ? (
          <span> {props.opportunity}</span>
        ) : (
          <span> opportunities</span>
        )}
        {props.location !== "blank" && <span> in {props.location}</span>}
      </h2>

      {opportunityList && opportunityList.count !== 0 ? (
        <>
          {opportunityList.results.map((opportunity) => (
            <OpportunityThumb
              key={opportunity.id}
              id={opportunity.id}
              imageUrl={opportunity.image_url}
              companyName={opportunity.company_name}
              position={opportunity.position}
              location={opportunity.location}
              description={opportunity.description}
              timestamp={opportunity.timestamp}
            />
          ))}
          <div className="paginator">
            <CustomPagination
              count={opportunityList.count}
              currentPage={parseInt(props.page)}
              next={opportunityList.next}
              previous={opportunityList.previous}
              url={`/opportunitysearch/${props.opportunity}/in/${props.location}`}
            />
          </div>
        </>
      ) : (
        <p className="mt-5">Sorry, we couldn't find that. Please try again!</p>
      )}
    </div>
  );
}

export default OpportunitySearchResults;
