import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { convertDateShort } from "../Helper/DateFunctions";
import AccountCircleTwoToneIcon from "@material-ui/icons/AccountCircleTwoTone";
import StarTwoToneIcon from "@material-ui/icons/StarTwoTone";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import HighlightOffOutlinedIcon from "@material-ui/icons/HighlightOffOutlined";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";
import "./CompanyReviews.css";

function Reviews(props) {
  const [companyReviews, setCompanyReviews] = useState({});
  const [identificationInput, setIdentificationInput] = useState("");
  const [scoreInput, setScoreInput] = useState("5");
  const [messageInput, setMessageInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageTotal, setPageTotal] = useState("");
  const [editReviewId, setEditReviewId] = useState("");
  const [refresh, setRefresh] = useState(true);
  const { currentUser, authAxios } = useAuth();
  const history = useHistory();

  useEffect(() => {
    refresh &&
      axios
        .get(
          `https://volunteer-land-server.herokuapp.com/api/company/${props.companyId}/reviews?page=${currentPage}`
        )
        .then((reviewList) => {
          if (currentPage === 1) {
            const pageSize = 3;
            setPageTotal(Math.ceil(reviewList.data.count) / pageSize);
            setCompanyReviews(reviewList.data.results);
          } else {
            let tempQuestionArray = companyReviews;
            setCompanyReviews(
              tempQuestionArray.concat(reviewList.data.results)
            );
          }
        })
        .catch((error) => {
          console.log(`Error: ${error}`);
        });

    return () => {
      setRefresh(false);
    };
  }, [refresh, props.companyId, currentPage, companyReviews]);

  const handleAddReview = () => {
    document.getElementById("addReviewForm").style.display = "block";
    document.getElementById("addReviewLink").style.display = "none";
  };

  const cancelAddReviewSubmission = () => {
    document.getElementById("addReviewForm").style.display = "none";
    document.getElementById("addReviewLink").style.display = "inline-block";
    setIdentificationInput("");
    setScoreInput("5");
    setMessageInput("");
  };

  const handleEditReview = (localIndex, dbIndex) => {
    setEditReviewId(dbIndex);

    setIdentificationInput(companyReviews[localIndex].identification);
    setScoreInput(parseInt(companyReviews[localIndex].score));
    setMessageInput(companyReviews[localIndex].review);

    document.getElementById(`addReviewLink`).style.visibility = "hidden";

    let list = document.getElementsByClassName("reviewEditDeleteButtons");
    Array.from(list).forEach((element) => {
      element.classList.add("hideReviewEditDeleteButtons");
    });

    document.getElementById(`review${dbIndex}`).style.display = "none";
    document.getElementById(`editReview${dbIndex}Form`).style.display = "block";
  };

  const cancelEditReviewSubmission = (dbIndex) => {
    setIdentificationInput("");
    setScoreInput("5");
    setMessageInput("");

    document.getElementById(`addReviewLink`).style.visibility = "visible";
    document.getElementById(`editReview${dbIndex}Form`).style.display = "none";
    document.getElementById(`review${dbIndex}`).style.display = "block";
    let list = document.getElementsByClassName("reviewEditDeleteButtons");
    Array.from(list).forEach((element) => {
      element.classList.remove("hideReviewEditDeleteButtons");
    });
  };

  const handleAddReviewSubmit = (e) => {
    e.preventDefault();

    authAxios
      .post(
        `https://volunteer-land-server.herokuapp.com/api/company/${props.companyId}/reviews`,
        {
          company: props.companyId,
          identification: identificationInput,
          score: scoreInput,
          review: messageInput,
        }
      )
      .then((response) => {
        history.push(`/company/${props.companyId}`);
        setCurrentPage(1);
        setRefresh(true);
        setIdentificationInput("");
        setScoreInput("5");
        setMessageInput("");
        document.getElementById("addReviewForm").style.display = "none";
        document.getElementById("addReviewLink").style.display = "inline-block";
      })
      .catch((error) => {
        console.log(`Error: ${error}`);
      });
  };

  const handleEditReviewSubmit = (e) => {
    e.preventDefault();

    authAxios
      .patch(
        `https://volunteer-land-server.herokuapp.com/api/company/${props.companyId}/review/${editReviewId}`,
        {
          company: props.companyId,
          identification: identificationInput,
          score: scoreInput,
          review: messageInput,
        }
      )
      .then((response) => {
        history.push(`/company/${props.companyId}`);
        setCurrentPage(1);
        setIdentificationInput("");
        setScoreInput("5");
        setMessageInput("");
        setRefresh(true);
        document.getElementById("addReviewLink").style.visibility = "visible";
        let list = document.getElementsByClassName("reviewEditDeleteButtons");
        Array.from(list).forEach((element) => {
          element.classList.remove("hideReviewEditDeleteButtons");
        });
        document.getElementById(`editReview${editReviewId}Form`).style.display =
          "none";
      })
      .catch((error) => {
        console.log(`Error: ${error}`);
      });
  };

  const handleDeleteReview = (reviewId) => {
    authAxios
      .delete(
        `https://volunteer-land-server.herokuapp.com/api/company/${props.companyId}/review/${reviewId}`
      )
      .then((response) => {
        setCurrentPage(1);
        setRefresh(true);
      })
      .catch((error) => {
        console.log(`Error: ${error}`);
      });
  };

  return (
    <div className="companyReviews">
      <h3>Reviews</h3>
      <div id="companyReviewContent">
        {currentUser && (
          <p
            id="addReviewLink"
            className="clickableLink"
            onClick={handleAddReview}
          >
            <AddCircleOutlineIcon /> Add a review
          </p>
        )}

        {/* Form to add a review */}
        <form
          id="addReviewForm"
          className="reviewForm"
          onSubmit={handleAddReviewSubmit}
        >
          <Form.Control
            className="formItem"
            type="text"
            name="identification"
            value={identificationInput}
            onChange={(e) => setIdentificationInput(e.target.value)}
            placeholder="Identification"
            required
          />
          <Form.Control
            className="formItem"
            as="select"
            custom
            name="score"
            value={scoreInput}
            onChange={(e) => setScoreInput(e.target.value)}
          >
            <option value="5">5.0</option>
            <option value="4.5">4.5</option>
            <option value="4">4.0</option>
            <option value="3.5">3.5</option>
            <option value="3">3.0</option>
            <option value="2.5">2.5</option>
            <option value="2">2.0</option>
            <option value="1.5">1.5</option>
            <option value="1">1.0</option>
            <option value="0.5">0.5</option>
            <option value="0">0.0</option>
          </Form.Control>
          <Form.Control
            className="formItem"
            as="textarea"
            rows={3}
            name="message"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Message"
            required
          />
          <div className="formSaveCancelButtons">
            <Button variant="primary" type="submit">
              Submit
            </Button>
            <Button variant="primary" onClick={cancelAddReviewSubmission}>
              Cancel
            </Button>
          </div>
        </form>

        {!refresh &&
          companyReviews.length > 0 &&
          companyReviews.map((review, i) => (
            <div className="review" key={review.id}>
              {/* Form to edit reviews */}
              <form
                id={`editReview${review.id}Form`}
                className="reviewForm"
                onSubmit={handleEditReviewSubmit}
              >
                <Form.Control
                  className="formItem"
                  type="text"
                  name="identification"
                  value={identificationInput}
                  onChange={(e) => setIdentificationInput(e.target.value)}
                  placeholder="Identification"
                  required
                />
                <Form.Control
                  className="formItem"
                  as="select"
                  custom
                  name="score"
                  value={scoreInput}
                  onChange={(e) => setScoreInput(e.target.value)}
                >
                  <option value="5">5.0</option>
                  <option value="4.5">4.5</option>
                  <option value="4">4.0</option>
                  <option value="3.5">3.5</option>
                  <option value="3">3.0</option>
                  <option value="2.5">2.5</option>
                  <option value="2">2.0</option>
                  <option value="1.5">1.5</option>
                  <option value="1">1.0</option>
                  <option value="0.5">0.5</option>
                  <option value="0">0.0</option>
                </Form.Control>
                <Form.Control
                  className="formItem"
                  as="textarea"
                  rows={3}
                  name="message"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Message"
                  required
                />
                <div className="formSaveCancelButtons">
                  <Button variant="primary" type="submit">
                    Submit
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => cancelEditReviewSubmission(review.id)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>

              <div className="d-flex justify-content-between">
                <div id={`review${review.id}`}>
                  <AccountCircleTwoToneIcon
                    className="reviewIcon"
                    fontSize="large"
                  />
                  <div className="reviewInfo d-inline-block">
                    <div className="reviewIdentificationAndActionButtons ">
                      <p>{review.identification}</p>
                    </div>
                    <p>
                      <StarTwoToneIcon fontSize="small" /> {review.score} on{" "}
                      {convertDateShort(review.timestamp)}
                    </p>
                  </div>
                  <p className="reviewContent">{review.review}</p>
                </div>

                {currentUser && review.user === currentUser.id && (
                  <span className="reviewEditDeleteButtons">
                    <EditOutlinedIcon
                      className="clickableLink"
                      onClick={() => handleEditReview(i, review.id)}
                    />

                    <HighlightOffOutlinedIcon
                      className="clickableLink"
                      onClick={() => handleDeleteReview(review.id)}
                    />
                  </span>
                )}
              </div>
            </div>
          ))}

        {currentPage < pageTotal && (
          <p
            className="loadMore clickableLink"
            onClick={() => {
              setCurrentPage(currentPage + 1);
              setRefresh(true);
            }}
          >
            - Load more reviews -
          </p>
        )}
      </div>
    </div>
  );
}

export default Reviews;
