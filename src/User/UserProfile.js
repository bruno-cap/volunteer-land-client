import React, { useState, useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import { Form, Button } from "react-bootstrap";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import ResumeList from "./ResumeList";
import "./UserProfile.css";

function ResumeItem(props) {
  const { authAxios, retrieveCurrentUser } = useAuth();
  const [personalInfo, setPersonalInfo] = useState("");
  const [firstNameInput, setFirstNameInput] = useState("");
  const [lastNameInput, setLastNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [phoneNumberInput, setPhoneNumberInput] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    authAxios
      .get(`https://volunteer-land-server.herokuapp.com/api/currentuser`)
      .then((user) => {
        setPersonalInfo(user.data[0]);
      })
      .catch((error) => {
        console.log(`Error: ${error}`);
      });

    return () => {
      setRefresh(false);
    };
  }, [refresh, authAxios, props.resumeId]);

  const handleEditPersonalInfo = () => {
    setFirstNameInput(personalInfo.first_name);
    setLastNameInput(personalInfo.last_name);
    setEmailInput(personalInfo.email);
    setPhoneNumberInput(personalInfo.phone_number);
    setLocationInput(personalInfo.location);

    document.getElementById("personalInfoItem").style.display = "none";
    document.getElementById("personalInformationAction").style.display = "none";
    document.getElementById("personalInfoForm").style.display = "block";
  };

  const handlePersonalInfoSubmit = (e) => {
    e.preventDefault();
    authAxios
      .patch(
        `https://volunteer-land-server.herokuapp.com/api/user/${personalInfo.id}`,
        {
          first_name: firstNameInput,
          last_name: lastNameInput,
          email: emailInput,
          phone_number: phoneNumberInput,
          location: locationInput,
        }
      )
      .then((response) => {
        setRefresh(true);
        document.getElementById("personalInfoForm").style.display = "none";
        document.getElementById("personalInformationAction").style.display =
          "block";
        document.getElementById("personalInfoItem").style.display = "block";
        // refresh current user
        retrieveCurrentUser();
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  const cancelOtherFormSubmission = () => {
    document.getElementById("personalInfoForm").style.display = "none";
    document.getElementById("personalInformationAction").style.display =
      "block";
    document.getElementById("personalInfoItem").style.display = "block";
  };

  return (
    <div className="userProfile bigBox">
      <div className="ResumeTitleAndActions d-flex justify-content-between">
        <h2>Personal Information</h2>
        <EditOutlinedIcon
          id="personalInformationAction"
          className="clickableLink"
          onClick={() => handleEditPersonalInfo()}
        />
      </div>
      <div id="personalInfoContent">
        <div id="personalInfoItem">
          {personalInfo && (
            <>
              <p>
                {personalInfo.first_name} {personalInfo.last_name}
              </p>
              <p>{personalInfo.email}</p>
              <p>{personalInfo.phone_number}</p>
              <p>{personalInfo.location}</p>
            </>
          )}
        </div>
        <Form id="personalInfoForm" onSubmit={handlePersonalInfoSubmit}>
          <Form.Control
            className="formItem"
            type="text"
            name="firstName"
            value={firstNameInput}
            onChange={(e) => setFirstNameInput(e.target.value)}
            placeholder="First Name (required)"
            required
          />

          <Form.Control
            className="formItem"
            type="text"
            name="lastName"
            value={lastNameInput}
            onChange={(e) => setLastNameInput(e.target.value)}
            placeholder="Last Name (required)"
            required
          />

          <Form.Control
            className="formItem"
            type="email"
            name="email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder="E-mail address (required)"
            required
          />

          <Form.Control
            className="formItem"
            type="text"
            name="email"
            value={phoneNumberInput}
            onChange={(e) => setPhoneNumberInput(e.target.value)}
            placeholder="Phone number"
          />

          <Form.Control
            className="formItem"
            type="text"
            name="location"
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
            placeholder="Location (required)"
            required
          />
          <div className="formSaveCancelButtons">
            <Button variant="primary" id="saveFormButton" type="submit">
              Save
            </Button>
            <Button variant="primary" onClick={cancelOtherFormSubmission}>
              Cancel
            </Button>
          </div>
        </Form>
      </div>
      <ResumeList />
    </div>
  );
}

export default ResumeItem;
