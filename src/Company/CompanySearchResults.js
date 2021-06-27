import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import CompanyThumb from "./CompanyThumb";
import CustomPagination from "../Helper/CustomPagination";
import axios from "axios";
import "./CompanySearchResults.css";

function CompanySearchResults(props) {
  const history = useHistory();
  const [companyList, setCompanyList] = useState("");
  useEffect(() => {
    props.company === "blank"
      ? history.push("/companies")
      : axios
          .get(
            `https://volunteer-land-server.herokuapp.com/api/companysearch/${props.company}?page=${props.page}`
          )
          .then((companies) => {
            setCompanyList(companies.data);
          })
          .catch((error) => console.log(`Error: ${error}`));
  }, [props.page, props.company, history]);

  return (
    <div className="companySearchResults text-center">
      <h2>Search results for {props.company}</h2>

      {companyList && companyList.count > 0 ? (
        <>
          {companyList.results.map((company) => (
            <CompanyThumb
              key={company.id}
              id={company.id}
              image_url={company.image_url}
              name={company.name}
              industry={company.industry}
              description={company.description}
              reviewCount={company.review_count}
              reviewAvg={company.review_avg}
            />
          ))}
          <div className="paginator">
            <CustomPagination
              count={companyList.count}
              currentPage={parseInt(props.page)}
              next={companyList.next}
              previous={companyList.previous}
              url={`/companysearch/${props.company}`}
            />
          </div>
        </>
      ) : (
        companyList.count === 0 && (
          <p className="mt-5">
            Sorry, we couldn't find that. Please try again!
          </p>
        )
      )}
    </div>
  );
}

export default CompanySearchResults;
