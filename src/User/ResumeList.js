import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { Form, Button } from "react-bootstrap";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import HighlightOffOutlinedIcon from "@material-ui/icons/HighlightOffOutlined";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import "./ResumeList.css";

function ResumeList() {
  const [resumeList, setResumeList] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const { currentUser, authAxios } = useAuth();

  useEffect(() => {
    authAxios
      .get(
        `https://volunteer-land-server.herokuapp.com/api/user/${currentUser.id}/resumes`
      )
      .then((resumes) => {
        setResumeList(resumes.data);
      })
      .catch((error) => {
        console.log(`Error: ${error}`);
      });

    return () => {
      setRefresh(false);
    };
  }, [refresh, authAxios, currentUser.id]);

  const handleAddResume = () => {
    setNameInput("");

    document.getElementById("resumeList").style.display = "none";
    document.getElementById("resumeListForm").style.display = "block";
    document.getElementById("addResumeLink").style.display = "none";
  };

  const handleResumeSubmit = (e) => {
    e.preventDefault();

    authAxios
      .post(
        `https://volunteer-land-server.herokuapp.com/api/user/${currentUser.id}/resumes`,
        {
          name: nameInput,
        }
      )
      .then((response) => {
        setRefresh(true);
        setNameInput("");
        document.getElementById("resumeListForm").style.display = "none";
        document.getElementById("resumeList").style.display = "block";
        document.getElementById("addResumeLink").style.display = "inline-block";
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  const handleResumeDelete = (resumeId) => {
    authAxios
      .delete(
        `https://volunteer-land-server.herokuapp.com/api/resume/${resumeId}`,
        {
          id: resumeId,
        }
      )
      .then((response) => {
        setRefresh(true);
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  const cancelFormSubmission = (e) => {
    setNameInput("");

    document.getElementById("resumeListForm").style.display = "none";
    document.getElementById("addResumeLink").style.display = "inline-block";
    document.getElementById("resumeList").style.display = "block";
  };

  return (
    <div className="resumeList">
      <h2>List of resumes</h2>
      <div id="resumeListContent">
        <div id="resumeList">
          {resumeList.length > 0 &&
            resumeList.map((resume, i) => (
              <div className="d-flex justify-content-between" key={resume.id}>
                <p>
                  {i + 1}. {resume.name}
                </p>
                <div id="resumeActions">
                  {resumeList && (
                    <>
                      <Link to={`/resume/${resume.id}`}>
                        <EditOutlinedIcon className="clickableLink" />
                      </Link>
                      <HighlightOffOutlinedIcon
                        className="clickableLink"
                        onClick={() => handleResumeDelete(resume.id)}
                      />
                    </>
                  )}
                </div>
              </div>
            ))}
        </div>

        <Form id="resumeListForm" onSubmit={handleResumeSubmit}>
          <Form.Control
            className="formItem"
            type="text"
            name="name"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="Name"
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
        </Form>
        <p
          id="addResumeLink"
          className="clickableLink"
          onClick={handleAddResume}
        >
          <AddCircleOutlineIcon /> Add resume
        </p>
      </div>
    </div>
  );
}

export default ResumeList;
