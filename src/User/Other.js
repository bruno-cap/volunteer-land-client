import React, { useState, useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import { Form, Button } from "react-bootstrap";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import HighlightOffOutlinedIcon from "@material-ui/icons/HighlightOffOutlined";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import "./Other.css";

function ResumeItem(props) {
  const { authAxios } = useAuth();
  const [resume, setResume] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [otherInput, setOtherInput] = useState(false);

  useEffect(() => {
    authAxios
      .get(
        `https://volunteer-land-server.herokuapp.com/api/resume/${props.resumeId}`
      )
      .then((resume) => {
        setResume(resume.data);
        if (resume.other) {
          document.getElementById("addOtherLink").style.display = "none";
        }
        document.getElementById("otherForm").style.display = "none";
      })
      .catch((error) => {
        console.log(`Error: ${error}`);
      });

    return () => {
      setRefresh(false);
    };
  }, [refresh, authAxios, props.resumeId]);

  const handleEditOther = () => {
    resume.other === null ? setOtherInput("") : setOtherInput(resume.other);
    document.getElementById("otherActions").style.display = "none";

    if (document.getElementById("addOtherLink")) {
      document.getElementById("addOtherLink").style.display = "none";
    }

    document.getElementById("otherItem").style.display = "none";
    document.getElementById("otherForm").style.display = "block";
  };

  const handleDeleteOther = () => {
    authAxios
      .patch(
        `https://volunteer-land-server.herokuapp.com/api/resume/${props.resumeId}`,
        {
          id: props.resumeId,
          other: null,
        }
      )
      .then((response) => {
        setRefresh(true);
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  const handleOtherSubmit = (e) => {
    e.preventDefault();
    authAxios
      .patch(
        `https://volunteer-land-server.herokuapp.com/api/resume/${props.resumeId}`,
        {
          id: props.resumeId,
          other: otherInput,
        }
      )
      .then((response) => {
        setRefresh(true);
        document.getElementById("otherForm").style.display = "none";
        document.getElementById("otherActions").style.display = "block";
        document.getElementById("otherItem").style.display = "block";
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  const cancelOtherFormSubmission = () => {
    document.getElementById("otherForm").style.display = "none";
    document.getElementById("otherActions").style.display = "block";
    if (!resume.other) {
      document.getElementById("addOtherLink").style.display = "inline-block";
    }
    document.getElementById("otherItem").style.display = "block";
  };

  const handleAddOther = () => {
    setOtherInput("");

    document.getElementById("otherItem").style.display = "none";
    document.getElementById("otherActions").style.display = "none";
    document.getElementById("otherForm").style.display = "block";

    if (document.getElementById("addOtherLink")) {
      document.getElementById("addOtherLink").style.display = "none";
    }
  };

  return (
    <div className="otherItem">
      <div className="otherTitleAndActions d-flex justify-content-between">
        <h3>Other</h3>
        <div id="otherActions">
          {resume && resume.other && (
            <>
              <EditOutlinedIcon
                className="clickableLink"
                onClick={() => handleEditOther()}
              />
              <HighlightOffOutlinedIcon
                className="clickableLink"
                onClick={() => handleDeleteOther()}
              />
            </>
          )}
        </div>
      </div>
      <div id="summaryContent">
        <div id="otherItem">{resume.other && <p>{resume.other}</p>}</div>

        <form id="otherForm" onSubmit={handleOtherSubmit}>
          <Form.Control
            className="formItem"
            type="text"
            name="other"
            value={otherInput}
            onChange={(e) => setOtherInput(e.target.value)}
            placeholder="Other"
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
        </form>

        {resume && !resume.other && (
          <p
            id="addOtherLink"
            className="clickableLink"
            onClick={handleAddOther}
          >
            <AddCircleOutlineIcon /> Add Other
          </p>
        )}
      </div>
    </div>
  );
}

export default ResumeItem;
