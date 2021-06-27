import React, { useEffect, useState } from "react";
import CompanyThumb from "./CompanyThumb";
import CustomPagination from "../Helper/CustomPagination";
import axios from "axios";
import "./CompanyList.css";

function CompanyList(props) {
  const [companyList, setCompanyList] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    axios
      .get(
        `https://volunteer-land-server.herokuapp.com/api/companies?page=${props.page}`
      )
      .then((companies) => {
        setCompanyList(companies.data);
      })
      .catch((error) => {
        console.log(`Error: ${error}`);
      });
  }, [props.page]);

  return (
    <div className="companyList text-center">
      <h2>Companies</h2>
      {companyList &&
        companyList.results.map((company) => (
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
        {companyList && (
          <CustomPagination
            count={companyList.count}
            currentPage={parseInt(props.page)}
            next={companyList.next}
            previous={companyList.previous}
            url="/companies"
          />
        )}
      </div>
    </div>
  );
}

export default CompanyList;
