import React, { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useAuth } from "../Context/AuthContext";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import axios from "axios";
import Select from "react-select";
import "./Application.css";

function Application(props) {
  const [resumeList, setResumeList] = useState("");
  const [opportunityDetails, setOpportunityDetails] = useState("");
  const [resumeInput, setResumeInput] = useState("");
  const [firstAnswerInput, setFirstAnswerInput] = useState("");
  const [secondAnswerInput, setSecondAnswerInput] = useState("");
  const [thirdAnswerInput, setThirdAnswerInput] = useState("");
  const [fourthAnswerInput, setFourthAnswerInput] = useState("");
  const [fifthAnswerInput, setFifthAnswerInput] = useState("");
  const { currentUser, authAxios } = useAuth();
  const history = useHistory();

  useEffect(() => {
    // retrieve user's list of resumes
    authAxios
      .get(
        `https://volunteer-land-server.herokuapp.com/api/user/${currentUser.id}/resumes`
      )
      .then((resumes) => {
        setResumeList(
          resumes.data.map((resume) => ({
            value: resume.id,
            label: resume.name,
          }))
        );
      })
      .catch((error) => console.log(`Error: ${error}`));

    // retrieve opportunity details
    axios
      .get(
        `https://volunteer-land-server.herokuapp.com/api/opportunity/${props.opportunityId}`
      )
      .then((opportunityDetails) => {
        // Check if user has created the opportunity -> redirect to opportunity details
        opportunityDetails.data.user === currentUser.id &&
          history.push(`/opportunity/${props.opportunityId}`);

        setOpportunityDetails(opportunityDetails.data);
      })
      .catch((error) => console.log(`Error: ${error}`));

    // Check if user has already applied to the opportunity -> redirect to application
    currentUser &&
      authAxios
        .get(
          `https://volunteer-land-server.herokuapp.com/api/user/${currentUser.id}/opportunityapplied/${props.opportunityId}`
        )
        .then((oppt) => {
          history.push(`/opportunity/${props.opportunityId}`);
        })
        .catch((error) => {
          // no action required
        });
  }, [authAxios, currentUser, history, props.opportunityId]);

  const handleApplicationSubmit = (e) => {
    e.preventDefault();

    authAxios
      .post(
        `https://volunteer-land-server.herokuapp.com/api/opportunity/${props.opportunityId}/applications`,
        {
          opportunity: props.opportunityId,
          resume: resumeInput,
          answer_1: firstAnswerInput,
          answer_2: secondAnswerInput,
          answer_3: thirdAnswerInput,
          answer_4: fourthAnswerInput,
          answer_5: fifthAnswerInput,
        }
      )
      .then((response) => {
        history.push(`/`);
      })
      .catch((error) => {
        console.log(`Error: ${error}`);
      });
  };

  return (
    <div className="application bigBox">
      {opportunityDetails && (
        <h2>
          Be a {opportunityDetails.position} at{" "}
          {opportunityDetails.company_name}!
        </h2>
      )}
      <form id="applicationForm" onSubmit={handleApplicationSubmit}>
        <Select
          className="basic-single formItem"
          classNamePrefix="select"
          placeholder="Select a resume (optional)"
          isClearable="true"
          isSearchable="true"
          options={resumeList}
          onChange={(e) => (e ? setResumeInput(e.value) : setResumeInput(""))}
        />
        <Link
          to={`/profile`}
          className="clickableLink mb-2"
          style={{ color: "inherit", textDecoration: "none" }}
        >
          <AddCircleOutlineIcon /> Add resume
        </Link>

        {opportunityDetails && opportunityDetails.question_1 && (
          <>
            <p className="opportunityQuestion">
              {opportunityDetails.question_1}
            </p>
            <Form.Control
              as="textarea"
              rows={3}
              name="answer1"
              value={firstAnswerInput}
              onChange={(e) => setFirstAnswerInput(e.target.value)}
              placeholder="Your answer"
              required
              className="formItem"
            />
          </>
        )}

        {opportunityDetails && opportunityDetails.question_2 && (
          <>
            <p className="opportunityQuestion">
              {opportunityDetails.question_2}
            </p>
            <Form.Control
              as="textarea"
              rows={3}
              name="answer2"
              value={secondAnswerInput}
              onChange={(e) => setSecondAnswerInput(e.target.value)}
              placeholder="Your answer"
              required
              className="formItem"
            />
          </>
        )}

        {opportunityDetails && opportunityDetails.question_3 && (
          <>
            <p className="opportunityQuestion">
              {opportunityDetails.question_3}
            </p>
            <Form.Control
              as="textarea"
              rows={3}
              name="answer3"
              value={thirdAnswerInput}
              onChange={(e) => setThirdAnswerInput(e.target.value)}
              placeholder="Your answer"
              required
              className="formItem"
            />
          </>
        )}

        {opportunityDetails && opportunityDetails.question_4 && (
          <>
            <p className="opportunityQuestion">
              {opportunityDetails.question_4}
            </p>
            <Form.Control
              as="textarea"
              rows={3}
              name="answer4"
              value={fourthAnswerInput}
              onChange={(e) => setFourthAnswerInput(e.target.value)}
              placeholder="Your answer"
              required
              className="formItem"
            />
          </>
        )}

        {opportunityDetails && opportunityDetails.question_5 && (
          <>
            <p className="opportunityQuestion">
              {opportunityDetails.question_5}
            </p>
            <Form.Control
              as="textarea"
              rows={3}
              name="answer5"
              value={fifthAnswerInput}
              onChange={(e) => setFifthAnswerInput(e.target.value)}
              placeholder="Your answer"
              required
              className="formItem"
            />
          </>
        )}

        <Button
          variant="primary"
          type="submit"
          className="d-block mx-auto mt-4"
        >
          Apply
        </Button>
      </form>
    </div>
  );
}

export default Application;
