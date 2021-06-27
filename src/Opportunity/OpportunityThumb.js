import React from "react";
import { Link } from "react-router-dom";
import "./OpportunityThumb.css";

function OpportunityThumb(props) {
  return (
    <div className="opportunityThumb card">
      <Link to={`/opportunity/${props.id}`}>
        <div className="opportunityThumbImage">
          <img src={props.imageUrl} alt="opportunity_image" />
        </div>
        <div className="opportunityThumbInfo">
          <p className="thumbTitle">{props.position}</p>
          <p>
            {props.companyName} · {props.location}
          </p>
          <div className="opportunityThumbDescription">
            <p>
              {props.description.length > 200
                ? props.description.substring(0, 197) + "..."
                : props.description}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default OpportunityThumb;
