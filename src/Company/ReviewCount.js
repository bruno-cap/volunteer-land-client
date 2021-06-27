import React, { useState, useEffect } from "react";
import StarTwoToneIcon from "@material-ui/icons/StarTwoTone";
import axios from "axios";

function ReviewCount(props) {
  const [reviewCount, setReviewCount] = useState("");
  const [reviewAvg, setReviewAvg] = useState("");

  useEffect(() => {
    axios
      .get(
        `https://volunteer-land-server.herokuapp.com/api/company/${props.companyId}`
      )
      .then((company) => {
        setReviewCount(company.data.review_count);
        company.data.review_count > 0 &&
          setReviewAvg(company.data.review_avg.toFixed(1));
      })
      .catch((error) => console.log(`Error: ${error}`));
  }, [props.companyId]);

  return (
    <div className="reviewCount">
      {reviewCount && reviewCount > 0 ? (
        <p>
          <StarTwoToneIcon fontSize="small" style={{ marginTop: "-3px" }} />
          {reviewAvg} · {reviewCount} reviews
        </p>
      ) : (
        <p>
          <StarTwoToneIcon fontSize="small" style={{ marginTop: "-3px" }} />
          No reviews yet
        </p>
      )}
    </div>
  );
}

export default ReviewCount;
