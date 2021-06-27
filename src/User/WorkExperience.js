import React, { useState, useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import { Form, Button } from "react-bootstrap";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import HighlightOffOutlinedIcon from "@material-ui/icons/HighlightOffOutlined";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import "./WorkExperience.css";

function WorkExperience(props) {
  const { authAxios } = useAuth();
  const [workExperiences, setWorkExperiences] = useState([]);
  const [companyInput, setCompanyInput] = useState("");
  const [positionInput, setPositionInput] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [industryInput, setIndustryInput] = useState("");
  const [startDateInput, setStartDateInput] = useState("");
  const [endDateInput, setEndDateInput] = useState("");
  const [descriptionInput, setDescriptionInput] = useState("");
  const [editWorkExperienceId, setEditWorkExperienceId] = useState("");
  const [checkedCurrentJob, setCheckedCurrentJob] = useState(false);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    authAxios
      .get(
        `https://volunteer-land-server.herokuapp.com/api/resume/${props.resumeId}/workexperiences`
      )
      .then((workExperiences) => {
        setWorkExperiences(workExperiences.data);
      })
      .catch((error) => {
        console.log(`Error: ${error}`);
      });

    return () => {
      setRefresh(false);
    };
  }, [refresh, authAxios, props.resumeId]);

  const handleWorkExperienceSubmit = (e) => {
    e.preventDefault();

    if (!editWorkExperienceId) {
      authAxios
        .post(
          `https://volunteer-land-server.herokuapp.com/api/resume/${props.resumeId}/workexperiences`,
          {
            resume: props.resumeId,
            company: companyInput,
            position: positionInput,
            location: locationInput,
            industry: industryInput,
            start_date: startDateInput,
            end_date: endDateInput ? endDateInput : null,
            description: descriptionInput,
          }
        )
        .then((response) => {
          setRefresh(true);
          document.getElementById("workExperienceForm").style.display = "none";
          document.getElementById("workExperienceList").style.display = "block";
          document.getElementById("addWorkExperienceLink").style.display =
            "inline-block";
        })
        .catch((error) => {
          console.log(error.response);
        });
    } else {
      authAxios
        .patch(
          `https://volunteer-land-server.herokuapp.com/api/resume/${props.resumeId}/workexperience/${editWorkExperienceId}`,
          {
            id: editWorkExperienceId,
            company: companyInput,
            position: positionInput,
            location: locationInput,
            industry: industryInput,
            start_date: startDateInput,
            end_date: endDateInput ? endDateInput : null,
            description: descriptionInput,
          }
        )
        .then((response) => {
          setRefresh(true);
          document.getElementById("workExperienceForm").style.display = "none";
          document.getElementById("workExperienceList").style.display = "block";
          document.getElementById("addWorkExperienceLink").style.display =
            "inline-block";
          setEditWorkExperienceId("");
        })
        .catch((error) => {
          console.log(error.response);
        });
    }
  };

  const handleAddWorkExperience = () => {
    setCheckedCurrentJob(false);
    setCompanyInput("");
    setPositionInput("");
    setLocationInput("");
    setIndustryInput("");
    setStartDateInput("");
    setEndDateInput("");
    setDescriptionInput("");

    document.getElementById("workExperienceList").style.display = "none";
    removeCurrentJobCheck();
    document.getElementById("workExperienceForm").style.display = "block";
    document.getElementById("addWorkExperienceLink").style.display = "none";
  };

  const cancelFormSubmission = (e) => {
    setEditWorkExperienceId("");

    document.getElementById("workExperienceForm").style.display = "none";
    document.getElementById("addWorkExperienceLink").style.display =
      "inline-block";
    document.getElementById("workExperienceList").style.display = "block";
  };

  const handleEditWorkExperience = (localIndex, dbIndex) => {
    setCheckedCurrentJob(false);
    setEditWorkExperienceId(dbIndex);

    setCompanyInput(workExperiences[localIndex].company);
    setPositionInput(workExperiences[localIndex].position);
    setLocationInput(workExperiences[localIndex].location);
    setIndustryInput(workExperiences[localIndex].industry);
    setStartDateInput(workExperiences[localIndex].start_date);
    setDescriptionInput(workExperiences[localIndex].description);

    if (workExperiences[localIndex].end_date === null) {
      setEndDateInput("");
      addCurrentJobCheck();
    } else {
      setEndDateInput(workExperiences[localIndex].end_date);
      removeCurrentJobCheck();
    }

    document.getElementById("addWorkExperienceLink").style.display = "none";
    document.getElementById("workExperienceList").style.display = "none";
    document.getElementById("workExperienceForm").style.display = "block";
  };

  const handleDeleteWorkExperience = (workExperienceId) => {
    authAxios
      .delete(
        `https://volunteer-land-server.herokuapp.com/api/resume/${props.resumeId}/workexperience/${workExperienceId}`,
        {
          id: workExperienceId,
        }
      )
      .then((response) => {
        setRefresh(true);
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  const handleCurrentJob = () => {
    let currentJob = document.getElementById("currentJobCheckbox").checked;
    let workEndDatePicker = document.getElementById("workEndDatePicker");

    if (currentJob) {
      workEndDatePicker.style.visibility = "hidden";
      setEndDateInput("");
      setCheckedCurrentJob(true);
    } else {
      workEndDatePicker.style.visibility = "visible";
      setCheckedCurrentJob(false);
    }
  };

  const addCurrentJobCheck = () => {
    document.getElementById("currentJobCheckbox").checked = true;
    document.getElementById("workEndDatePicker").style.visibility = "hidden";
  };

  const removeCurrentJobCheck = () => {
    document.getElementById("currentJobCheckbox").checked = false;
    document.getElementById("workEndDatePicker").style.visibility = "visible";
  };

  return (
    <div className="workExperience">
      <h3>Work Experience</h3>
      <div id="workExperienceContent">
        <div id="workExperienceList">
          {workExperiences.length > 0 &&
            workExperiences.map((workExperience, i) => (
              <div className="workExperienceListItem" key={workExperience.id}>
                <div className="workExperienceTitleAndActions d-flex justify-content-between">
                  <p className="jobTitle">{workExperience.position}</p>

                  <div className="workExperienceActions">
                    <EditOutlinedIcon
                      className="clickableLink"
                      onClick={() =>
                        handleEditWorkExperience(i, workExperience.id)
                      }
                    />
                    <HighlightOffOutlinedIcon
                      className="clickableLink"
                      onClick={() =>
                        handleDeleteWorkExperience(workExperience.id)
                      }
                    />
                  </div>
                </div>
                <p>{workExperience.company}</p>

                <p>
                  From {workExperience.start_date}{" "}
                  {workExperience.end_date ? (
                    <span>to {workExperience.end_date} </span>
                  ) : (
                    " "
                  )}
                </p>
                <p>{workExperience.location}</p>

                <p className="jobDescription">{workExperience.description}</p>
              </div>
            ))}
        </div>

        <form id="workExperienceForm" onSubmit={handleWorkExperienceSubmit}>
          <Form.Control
            className="formItem"
            type="text"
            name="company"
            value={companyInput}
            onChange={(e) => setCompanyInput(e.target.value)}
            placeholder="Company Name"
            required
          />
          <Form.Control
            className="formItem"
            type="text"
            name="position"
            value={positionInput}
            onChange={(e) => setPositionInput(e.target.value)}
            placeholder="Position"
            required
          />
          <Form.Control
            className="formItem"
            type="text"
            name="location"
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
            placeholder="Location"
            required
          />
          <Form.Control
            className="formItem"
            type="text"
            name="industry"
            value={industryInput}
            onChange={(e) => setIndustryInput(e.target.value)}
            placeholder="Industry"
            required
          />
          <div className="formItem">
            <p className="datePickerLabel">From</p>
            <Form.Control
              className="formItem"
              type="date"
              name="startDate"
              value={startDateInput}
              onChange={(e) => setStartDateInput(e.target.value)}
              placeholder="Start Date"
              required
            />
          </div>
          <div id="workEndDatePicker" className="formItem">
            <p className="datePickerLabel">To</p>
            <Form.Control
              type="date"
              name="endDate"
              value={endDateInput}
              onChange={(e) => setEndDateInput(e.target.value)}
              placeholder="End Date"
              required={checkedCurrentJob ? false : true}
            />
          </div>
          <Form.Check
            id="currentJobCheckbox"
            className="mb-2"
            type="checkbox"
            name="currentJob"
            onChange={(e) => handleCurrentJob()}
            label="Current job?"
          />
          <Form.Control
            as="textarea"
            rows={3}
            className="formItem"
            name="description"
            value={descriptionInput}
            onChange={(e) => setDescriptionInput(e.target.value)}
            placeholder="Description"
            required
          />
          <div className="formSaveCancelButtons">
            <Button variant="primary" type="submit">
              Save
            </Button>
            <Button variant="primary" onClick={cancelFormSubmission}>
              Cancel
            </Button>
          </div>
        </form>
        <p
          id="addWorkExperienceLink"
          className="clickableLink"
          onClick={handleAddWorkExperience}
        >
          <AddCircleOutlineIcon /> Add work experience
        </p>
      </div>
    </div>
  );
}

export default WorkExperience;
