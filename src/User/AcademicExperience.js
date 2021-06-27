import React, { useState, useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import { Form, Button } from "react-bootstrap";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import HighlightOffOutlinedIcon from "@material-ui/icons/HighlightOffOutlined";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import "./AcademicExperience.css";

function AcademicExperience(props) {
  const { authAxios } = useAuth();
  const [academicExperiences, setAcademicExperiences] = useState([]);
  const [schoolInput, setSchoolInput] = useState("");
  const [courseInput, setCourseInput] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [fieldInput, setFieldInput] = useState("");
  const [startDateInput, setStartDateInput] = useState("");
  const [endDateInput, setEndDateInput] = useState("");
  const [descriptionInput, setDescriptionInput] = useState("");
  const [editAcademicExperienceId, setEditAcademicExperienceId] = useState("");
  const [checkedCurrentlyEnrolled, setCheckedCurrentlyEnrolled] =
    useState(false);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    authAxios
      .get(
        `https://volunteer-land-server.herokuapp.com/api/resume/${props.resumeId}/academicexperiences`
      )
      .then((academicExperiences) => {
        setAcademicExperiences(academicExperiences.data);
      })
      .catch((error) => {
        console.log(`Error: ${error}`);
      });

    return () => {
      setRefresh(false);
    };
  }, [refresh, authAxios, props.resumeId]);

  const handleacademicExperienceSubmit = (e) => {
    e.preventDefault();

    if (!editAcademicExperienceId) {
      authAxios
        .post(
          `https://volunteer-land-server.herokuapp.com/api/resume/${props.resumeId}/academicexperiences`,
          {
            resume: props.resumeId,
            school: schoolInput,
            course: courseInput,
            location: locationInput,
            field: fieldInput,
            start_date: startDateInput,
            end_date: endDateInput ? endDateInput : null,
            description: descriptionInput,
          }
        )
        .then((response) => {
          setRefresh(true);
          document.getElementById("academicExperienceForm").style.display =
            "none";
          document.getElementById("academicExperienceList").style.display =
            "block";
          document.getElementById("addAcademicExperienceLink").style.display =
            "inline-block";
        })
        .catch((error) => {
          console.log(error.response);
        });
    } else {
      authAxios
        .patch(
          `https://volunteer-land-server.herokuapp.com/api/resume/${props.resumeId}/academicexperience/${editAcademicExperienceId}`,
          {
            id: editAcademicExperienceId,
            school: schoolInput,
            course: courseInput,
            location: locationInput,
            field: fieldInput,
            start_date: startDateInput,
            end_date: endDateInput ? endDateInput : null,
            description: descriptionInput,
          }
        )
        .then((response) => {
          setRefresh(true);
          document.getElementById("academicExperienceForm").style.display =
            "none";
          document.getElementById("academicExperienceList").style.display =
            "block";
          document.getElementById("addAcademicExperienceLink").style.display =
            "inline-block";
          setEditAcademicExperienceId("");
        })
        .catch((error) => {
          console.log(error.response);
        });
    }
  };

  const handleAddacademicExperience = () => {
    setCheckedCurrentlyEnrolled(false);
    setSchoolInput("");
    setCourseInput("");
    setLocationInput("");
    setFieldInput("");
    setStartDateInput("");
    setEndDateInput("");
    setDescriptionInput("");

    document.getElementById("academicExperienceList").style.display = "none";
    removeCurrentCourseCheck();
    document.getElementById("academicExperienceForm").style.display = "block";
    document.getElementById("addAcademicExperienceLink").style.display = "none";
  };

  const cancelFormSubmission = (e) => {
    setEditAcademicExperienceId("");

    document.getElementById("academicExperienceForm").style.display = "none";
    document.getElementById("addAcademicExperienceLink").style.display =
      "inline-block";
    document.getElementById("academicExperienceList").style.display = "block";
  };

  const handleEditacademicExperience = (localIndex, dbIndex) => {
    setCheckedCurrentlyEnrolled(false);
    setEditAcademicExperienceId(dbIndex);

    setSchoolInput(academicExperiences[localIndex].school);
    setCourseInput(academicExperiences[localIndex].course);
    setLocationInput(academicExperiences[localIndex].location);
    setFieldInput(academicExperiences[localIndex].field);
    setStartDateInput(academicExperiences[localIndex].start_date);
    setDescriptionInput(academicExperiences[localIndex].description);

    if (academicExperiences[localIndex].end_date === null) {
      setEndDateInput("");
      addCurrentCourseCheck();
    } else {
      setEndDateInput(academicExperiences[localIndex].end_date);
      removeCurrentCourseCheck();
    }

    document.getElementById("addAcademicExperienceLink").style.display = "none";
    document.getElementById("academicExperienceList").style.display = "none";
    document.getElementById("academicExperienceForm").style.display = "block";
  };

  const handleDeleteacademicExperience = (academicExperienceId) => {
    authAxios
      .delete(
        `https://volunteer-land-server.herokuapp.com/api/resume/${props.resumeId}/academicexperience/${academicExperienceId}`,
        {
          id: academicExperienceId,
        }
      )
      .then((response) => {
        setRefresh(true);
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  const handleCurrentCourse = () => {
    let currentJob = document.getElementById("currentCourseCheckbox").checked;
    let academicEndDatePicker = document.getElementById(
      "academicEndDatePicker"
    );

    if (currentJob) {
      academicEndDatePicker.style.visibility = "hidden";
      setEndDateInput("");
      setCheckedCurrentlyEnrolled(true);
    } else {
      academicEndDatePicker.style.visibility = "visible";
      setCheckedCurrentlyEnrolled(false);
    }
  };

  const addCurrentCourseCheck = () => {
    document.getElementById("currentCourseCheckbox").checked = true;
    document.getElementById("academicEndDatePicker").style.visibility =
      "hidden";
  };

  const removeCurrentCourseCheck = () => {
    document.getElementById("currentCourseCheckbox").checked = false;
    document.getElementById("academicEndDatePicker").style.visibility =
      "visible";
  };

  return (
    <div className="academicExperience">
      <h3>Academic Experience</h3>
      <div id="academicExperienceContent">
        <div id="academicExperienceList">
          {academicExperiences.length > 0 &&
            academicExperiences.map((academicExperience, i) => (
              <div
                className="academicExperienceListItem"
                key={academicExperience.id}
              >
                <div className="academicExperienceTitleAndActions d-flex justify-content-between">
                  <p className="courseTitle">{academicExperience.course}</p>
                  <div className="academicExperienceActions">
                    <EditOutlinedIcon
                      className="clickableLink"
                      onClick={() =>
                        handleEditacademicExperience(i, academicExperience.id)
                      }
                    />
                    <HighlightOffOutlinedIcon
                      className="clickableLink"
                      onClick={() =>
                        handleDeleteacademicExperience(academicExperience.id)
                      }
                    />
                  </div>
                </div>

                <p>{academicExperience.school}</p>
                <p>
                  From {academicExperience.start_date}{" "}
                  {academicExperience.end_date ? (
                    <span>to {academicExperience.end_date} </span>
                  ) : (
                    " "
                  )}
                </p>
                <p>{academicExperience.location}</p>

                <p className="courseDescription">
                  {academicExperience.description}
                </p>
              </div>
            ))}
        </div>

        <form
          id="academicExperienceForm"
          onSubmit={handleacademicExperienceSubmit}
        >
          <Form.Control
            className="formItem"
            type="text"
            name="school"
            value={schoolInput}
            onChange={(e) => setSchoolInput(e.target.value)}
            placeholder="School Name"
            required
          />
          <Form.Control
            className="formItem"
            type="text"
            name="course"
            value={courseInput}
            onChange={(e) => setCourseInput(e.target.value)}
            placeholder="Course"
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
            name="field"
            value={fieldInput}
            onChange={(e) => setFieldInput(e.target.value)}
            placeholder="Field"
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

          <div id="academicEndDatePicker" className="formItem">
            <p className="datePickerLabel">To</p>

            <Form.Control
              className="formItem"
              type="date"
              name="endDate"
              value={endDateInput}
              onChange={(e) => setEndDateInput(e.target.value)}
              placeholder="End Date"
              required={checkedCurrentlyEnrolled ? false : true}
            />
          </div>

          <Form.Check
            id="currentCourseCheckbox"
            className="mb-2"
            type="checkbox"
            name="currentCourse"
            onChange={() => handleCurrentCourse()}
            label="Currently enrolled?"
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
            <Button variant="primary" id="academicSaveFormButton" type="submit">
              Save
            </Button>
            <Button variant="primary" onClick={cancelFormSubmission}>
              Cancel
            </Button>
          </div>
        </form>
        <p
          id="addAcademicExperienceLink"
          className="clickableLink"
          onClick={handleAddacademicExperience}
        >
          <AddCircleOutlineIcon /> Add academic experience
        </p>
      </div>
    </div>
  );
}

export default AcademicExperience;
