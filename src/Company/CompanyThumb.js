import React from "react";
import { Link } from "react-router-dom";
import StarTwoToneIcon from "@material-ui/icons/StarTwoTone";
import "./CompanyThumb.css";

function CompanyThumb(props) {
  return (
    <div className="companyThumb d-inline-block">
      <div className="companyThumb card">
        <Link to={`/company/${props.id}`} className="thumbLink">
          <div className="companyThumbImage">
            <img src={props.image_url} alt="company_image" />
          </div>
          <div className="companyThumbInfo">
            <p className="thumbTitle">{props.name}</p>
            <p>{props.industry}</p>
            {props.reviewCount > 0 ? (
              <p>
                <StarTwoToneIcon
                  fontSize="small"
                  style={{ marginTop: "-3px" }}
                />{" "}
                {props.reviewAvg.toFixed(1)} · {props.reviewCount} reviews
              </p>
            ) : (
              <p>
                <StarTwoToneIcon
                  fontSize="small"
                  style={{ marginTop: "-3px" }}
                />{" "}
                No reviews yet
              </p>
            )}
          </div>
        </Link>
      </div>
    </div>
  );
}

export default CompanyThumb;
