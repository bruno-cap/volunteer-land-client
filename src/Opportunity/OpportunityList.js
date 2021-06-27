import React, { useEffect, useState } from "react";
import OpportunityThumb from "./OpportunityThumb";
import CustomPagination from "../Helper/CustomPagination";
import axios from "axios";
import "./OpportunityList.css";

function OpportunityList(props) {
  const [opportunityList, setOpportunityList] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    axios
      .get(
        `https://volunteer-land-server.herokuapp.com/api/opportunities?page=${props.page}`
      )
      .then((opportunities) => {
        setOpportunityList(opportunities.data);
      })
      .catch((error) => {
        console.log(`Error: ${error}`);
      });
  }, [props.page]);

  return (
    <div className="opportunityList">
      <h2>Opportunity list</h2>
      {opportunityList &&
        opportunityList.results.map((opportunity) => (
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
        {opportunityList && (
          <CustomPagination
            count={opportunityList.count}
            currentPage={parseInt(props.page)}
            next={opportunityList.next}
            previous={opportunityList.previous}
            url="/opportunities"
          />
        )}
      </div>
    </div>
  );
}

export default OpportunityList;
