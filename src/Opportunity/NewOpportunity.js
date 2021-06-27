import React, { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import { Form, Button, Alert } from "react-bootstrap";
import { useAuth } from "../Context/AuthContext";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import Select from "react-select";
import axios from "axios";
import "./NewOpportunity.css";

function NewOpportunity() {
  const [companyList, setCompanyList] = useState("");
  const [companyInput, setCompanyInput] = useState("");
  const [positionInput, setPositionInput] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [descriptionInput, setDescriptionInput] = useState("");
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [firstQuestionInput, setFirstQuestionInput] = useState("");
  const [secondQuestionInput, setSecondQuestionInput] = useState("");
  const [thirdQuestionInput, setThirdQuestionInput] = useState("");
  const [fourthQuestionInput, setFourthQuestionInput] = useState("");
  const [fifthQuestionInput, setFifthQuestionInput] = useState("");
  const [numberOfQuestions, setNumberOfQuestions] = useState(0);
  const [nameError, setNameError] = useState(false);
  const { authAxios } = useAuth();
  const history = useHistory();

  useEffect(() => {
    axios
      .get(`https://volunteer-land-server.herokuapp.com/api/companies`)
      .then((companies) => {
        setCompanyList(
          companies.data.map((company) => ({
            value: company.id,
            label: company.name,
          }))
        );
      })
      .catch((error) => console.log(`Error: ${error}`));
  }, []);

  const handleNewOpportunitySubmit = (e) => {
    e.preventDefault();

    if (!companyInput) {
      setNameError(true);
    } else {
      let organizedArray = [];
      firstQuestionInput && organizedArray.push(firstQuestionInput);
      secondQuestionInput && organizedArray.push(secondQuestionInput);
      thirdQuestionInput && organizedArray.push(thirdQuestionInput);
      fourthQuestionInput && organizedArray.push(fourthQuestionInput);
      fifthQuestionInput && organizedArray.push(fifthQuestionInput);

      authAxios
        .post(`https://volunteer-land-server.herokuapp.com/api/opportunities`, {
          company: companyInput,
          position: positionInput,
          location: locationInput,
          description: descriptionInput,
          image_url: imageUrlInput,
          question_1: organizedArray[0],
          question_2: organizedArray[1],
          question_3: organizedArray[2],
          question_4: organizedArray[3],
          question_5: organizedArray[4],
        })
        .then((response) => {
          history.push(`/opportunity/${response.data.id}`);
        })
        .catch((error) => {
          console.log(`Error: ${error}`);
        });
    }
  };

  const handleAddQuestion = () => {
    if (numberOfQuestions < 5) {
      document.getElementById(
        `newOppQuestion${numberOfQuestions + 1}`
      ).style.display = "block";
      setNumberOfQuestions(numberOfQuestions + 1);
      numberOfQuestions === 4 &&
        (document.getElementById(`addQuestionLink`).style.display = "none");
    }
  };

  return (
    <div className="newOpportunity smallBox">
      <h4>New Opportunity</h4>
      <form id="newOpportunityForm" onSubmit={handleNewOpportunitySubmit}>
        <Select
          className="basic-single formItem"
          classNamePrefix="select"
          placeholder="Select a company"
          isClearable="true"
          isSearchable="true"
          options={companyList}
          onChange={(e) => (e ? setCompanyInput(e.value) : setCompanyInput(""))}
        />
        {nameError && <Alert variant="danger">Please select a company</Alert>}
        <Link to={`/companyAdd`} id="addLink" className="clickableLink">
          <AddCircleOutlineIcon /> Add company
        </Link>
        <Form.Control
          type="text"
          name="position"
          value={positionInput}
          onChange={(e) => setPositionInput(e.target.value)}
          placeholder="Position"
          required
          className="formItem"
        />
        <Form.Control
          type="text"
          name="location"
          value={locationInput}
          onChange={(e) => setLocationInput(e.target.value)}
          placeholder="Location"
          required
          className="formItem"
        />
        <Form.Control
          as="textarea"
          rows={3}
          name="description"
          value={descriptionInput}
          onChange={(e) => setDescriptionInput(e.target.value)}
          placeholder="Description"
          required
          className="formItem"
        />
        <Form.Control
          type="text"
          name="imageUrl"
          value={imageUrlInput}
          onChange={(e) => setImageUrlInput(e.target.value)}
          placeholder="Image Url"
          className="formItem"
        />
        <Form.Control
          as="textarea"
          id="newOppQuestion1"
          rows={3}
          name="firstQuestion"
          value={firstQuestionInput}
          onChange={(e) => setFirstQuestionInput(e.target.value)}
          placeholder="First question (optional)"
          className="formItem"
        />
        <Form.Control
          as="textarea"
          id="newOppQuestion2"
          rows={3}
          name="secondQuestion"
          value={secondQuestionInput}
          onChange={(e) => setSecondQuestionInput(e.target.value)}
          placeholder="Second question (optional)"
          className="formItem"
        />
        <Form.Control
          as="textarea"
          id="newOppQuestion3"
          rows={3}
          name="thirdQuestion"
          value={thirdQuestionInput}
          onChange={(e) => setThirdQuestionInput(e.target.value)}
          placeholder="Third question (optional)"
          className="formItem"
        />
        <Form.Control
          as="textarea"
          id="newOppQuestion4"
          rows={3}
          name="fourthQuestion"
          value={fourthQuestionInput}
          onChange={(e) => setFourthQuestionInput(e.target.value)}
          placeholder="Fourth question (optional)"
          className="formItem"
        />
        <Form.Control
          as="textarea"
          id="newOppQuestion5"
          rows={3}
          name="fifthQuestion"
          value={fifthQuestionInput}
          onChange={(e) => setFifthQuestionInput(e.target.value)}
          placeholder="Fifth question (optional)"
          className="formItem"
        />
        <p
          id="addQuestionLink"
          className="clickableLink"
          onClick={handleAddQuestion}
        >
          <AddCircleOutlineIcon /> Add candidate question
        </p>
        <div className="formSaveCancelButtons">
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
}

export default NewOpportunity;
