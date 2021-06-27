import React, { useState, useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import { Form, Button } from "react-bootstrap";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import HighlightOffOutlinedIcon from "@material-ui/icons/HighlightOffOutlined";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import "./Summary.css";

function Summary(props) {
  const { authAxios } = useAuth();
  const [resume, setResume] = useState({});
  const [refresh, setRefresh] = useState(false);
  const [summaryInput, setSummaryInput] = useState(false);

  const [nameInput, setNameInput] = useState("");

  useEffect(() => {
    authAxios
      .get(
        `https://volunteer-land-server.herokuapp.com/api/resume/${props.resumeId}`
      )
      .then((resume) => {
        setResume(resume.data);
        resume.summary &&
          (document.getElementById("addSummaryLink").style.display = "none");
      })
      .catch((error) => {
        console.log(`Error: ${error}`);
      });

    return () => {
      setRefresh(false);
    };
  }, [refresh, authAxios, props.resumeId]);

  // name

  const handleNameSubmit = (e) => {
    e.preventDefault();
    authAxios
      .patch(
        `https://volunteer-land-server.herokuapp.com/api/resume/${props.resumeId}`,
        {
          name: nameInput,
        }
      )
      .then((response) => {
        setRefresh(true);
        document.getElementById("nameForm").style.display = "none";
        document.getElementById("nameAction").style.display = "block";
        document.getElementById("nameItem").style.display = "block";
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  const handleEditName = () => {
    setNameInput(resume.name);
    document.getElementById("nameItem").style.display = "none";
    document.getElementById("nameAction").style.display = "none";
    document.getElementById("nameForm").style.display = "block";
  };

  const cancelNameFormSubmission = () => {
    document.getElementById("nameForm").style.display = "none";
    document.getElementById("nameAction").style.display = "block";
    document.getElementById("nameItem").style.display = "block";
  };

  // summary

  const handleSummarySubmit = (e) => {
    e.preventDefault();
    authAxios
      .patch(
        `https://volunteer-land-server.herokuapp.com/api/resume/${props.resumeId}`,
        {
          id: props.resumeId,
          summary: summaryInput,
        }
      )
      .then((response) => {
        setRefresh(true);
        document.getElementById("summaryForm").style.display = "none";
        document.getElementById("summaryActions").style.display = "block";
        document.getElementById("summaryItem").style.display = "block";
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  const cancelSummaryFormSubmission = () => {
    document.getElementById("summaryForm").style.display = "none";
    document.getElementById("summaryActions").style.display = "block";
    if (!resume.summary) {
      document.getElementById("addSummaryLink").style.display = "inline-block";
    }
    document.getElementById("summaryItem").style.display = "block";
  };

  const handleAddSummary = () => {
    setSummaryInput("");

    document.getElementById("summaryItem").style.display = "none";
    document.getElementById("summaryActions").style.display = "none";
    document.getElementById("summaryForm").style.display = "block";

    if (document.getElementById("addSummaryLink")) {
      document.getElementById("addSummaryLink").style.display = "none";
    }
  };

  const handleEditSummary = () => {
    resume.summary === null
      ? setSummaryInput("")
      : setSummaryInput(resume.summary);

    if (document.getElementById("addSummaryLink")) {
      document.getElementById("addSummaryLink").style.display = "none";
    }
    document.getElementById("summaryActions").style.display = "none";

    document.getElementById("summaryItem").style.display = "none";
    document.getElementById("summaryForm").style.display = "block";
  };

  const handleDeleteSummary = () => {
    authAxios
      .patch(
        `https://volunteer-land-server.herokuapp.com/api/resume/${props.resumeId}`,
        {
          id: props.resumeId,
          summary: null,
        }
      )
      .then((response) => {
        setRefresh(true);
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  return (
    <div className="summary">
      <div className="ResumeTitleAndActions d-flex justify-content-between">
        <h3>Resume</h3>
        <EditOutlinedIcon
          id="nameAction"
          className="clickableLink"
          onClick={() => handleEditName()}
        />
      </div>

      <div id="resumeNameContent">
        <p id="nameItem">{resume && resume.name}</p>
        <form id="nameForm" onSubmit={handleNameSubmit}>
          <Form.Control
            className="formItem"
            type="text"
            name="summary"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="Resume name"
            required
          />
          <div className="formSaveCancelButtons">
            <Button variant="primary" type="submit">
              Save
            </Button>
            <Button variant="primary" onClick={cancelNameFormSubmission}>
              Cancel
            </Button>
          </div>
        </form>
      </div>

      <div className="summaryTitleAndActions d-flex justify-content-between">
        <h3>Summary</h3>
        <div id="summaryActions">
          {resume && resume.summary && (
            <>
              <EditOutlinedIcon
                className="clickableLink"
                onClick={() => handleEditSummary()}
              />
              <HighlightOffOutlinedIcon
                className="clickableLink"
                onClick={() => handleDeleteSummary()}
              />
            </>
          )}
        </div>
      </div>

      <div id="summaryContent">
        <div id="summaryItem">{resume.summary && <p>{resume.summary}</p>}</div>
        <form id="summaryForm" onSubmit={handleSummarySubmit}>
          <Form.Control
            className="formItem"
            type="text"
            name="summary"
            value={summaryInput}
            onChange={(e) => setSummaryInput(e.target.value)}
            placeholder="Summary"
            required
          />
          <div className="formSaveCancelButtons">
            <Button variant="primary" type="submit">
              Save
            </Button>
            <Button variant="primary" onClick={cancelSummaryFormSubmission}>
              Cancel
            </Button>
          </div>
        </form>

        {resume && !resume.summary && (
          <p
            id="addSummaryLink"
            className="clickableLink"
            onClick={handleAddSummary}
          >
            <AddCircleOutlineIcon /> Add Summary
          </p>
        )}
      </div>
    </div>
  );
}

export default Summary;
