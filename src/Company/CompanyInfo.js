import React, { useEffect, useState } from "react";
import ReviewCount from "./ReviewCount";
import CompanyQuestions from "./CompanyQuestions";
import CompanyReviews from "./CompanyReviews";
import axios from "axios";
import "./CompanyInfo.css";

function CompanyInfo(props) {
  const [company, setCompany] = useState("");

  useEffect(() => {
    axios
      .get(
        `https://volunteer-land-server.herokuapp.com/api/company/${props.companyId}`
      )
      .then((comp) => {
        setCompany(comp.data);
      })
      .catch((error) => console.log(`Error: ${error}`));
  }, [props.companyId]);

  return (
    <div className="companyInfo bigBox">
      {company && (
        <>
          <div className="companyBanner">
            <img src={company.image_url} alt="company_illustration" />
          </div>

          <div className="companyDetails">
            <h2>{company.name}</h2>
            <p>{company.industry}</p>
            <ReviewCount companyId={props.companyId} key={Math.random()} />
            <div className="companyDescription">
              <p>{company.description}</p>
            </div>
          </div>
        </>
      )}
      <CompanyQuestions companyId={props.companyId} />
      <CompanyReviews companyId={props.companyId} />
    </div>
  );
}

export default CompanyInfo;
