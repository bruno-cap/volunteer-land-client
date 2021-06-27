import React, { useState, useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import { Form, Button } from "react-bootstrap";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import HighlightOffOutlinedIcon from "@material-ui/icons/HighlightOffOutlined";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import "./Language.css";

function Language(props) {
  const { authAxios } = useAuth();
  const [languages, setLanguages] = useState([]);
  const [languageInput, setLanguageInput] = useState("");
  const [levelInput, setLevelInput] = useState();
  const [editLanguageId, setEditLanguageId] = useState("");
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    authAxios
      .get(
        `https://volunteer-land-server.herokuapp.com/api/resume/${props.resumeId}/languages`
      )
      .then((languages) => {
        setLanguages(languages.data);
      })
      .catch((error) => {
        console.log(`Error: ${error}`);
      });

    return () => {
      setRefresh(false);
    };
  }, [refresh, authAxios, props.resumeId]);

  const handleLanguageSubmit = (e) => {
    e.preventDefault();

    if (!editLanguageId) {
      authAxios
        .post(
          `https://volunteer-land-server.herokuapp.com/api/resume/${props.resumeId}/languages`,
          {
            resume: props.resumeId,
            name: languageInput,
            level: levelInput ? levelInput : "basic",
          }
        )
        .then((response) => {
          setRefresh(true);
          document.getElementById("languageForm").style.display = "none";
          document.getElementById("languageList").style.display = "block";
          document.getElementById("addLanguageLink").style.display =
            "inline-block";
        })
        .catch((error) => {
          console.log(error.response);
        });
    } else {
      authAxios
        .patch(
          `https://volunteer-land-server.herokuapp.com/api/resume/${props.resumeId}/language/${editLanguageId}`,
          {
            id: editLanguageId,
            name: languageInput,
            level: levelInput,
          }
        )
        .then((response) => {
          setRefresh(true);
          document.getElementById("languageForm").style.display = "none";
          document.getElementById("languageList").style.display = "block";
          document.getElementById("addLanguageLink").style.display =
            "inline-block";
          setEditLanguageId("");
        })
        .catch((error) => {
          console.log(error.response);
        });
    }
  };

  const handleAddLanguage = () => {
    setLanguageInput("");
    setLevelInput("");

    document.getElementById("languageList").style.display = "none";
    document.getElementById("languageForm").style.display = "block";
    document.getElementById("addLanguageLink").style.display = "none";
  };

  const cancelFormSubmission = (e) => {
    setEditLanguageId("");

    document.getElementById("languageForm").style.display = "none";
    document.getElementById("addLanguageLink").style.display = "inline-block";
    document.getElementById("languageList").style.display = "block";
  };

  const handleEditLanguage = (localIndex, dbIndex) => {
    setEditLanguageId(dbIndex);

    setLanguageInput(languages[localIndex].name);
    setLevelInput(languages[localIndex].level);

    document.getElementById("addLanguageLink").style.display = "none";
    document.getElementById("languageList").style.display = "none";
    document.getElementById("languageForm").style.display = "block";
  };

  const handleDeleteLanguage = (languageId) => {
    authAxios
      .delete(
        `https://volunteer-land-server.herokuapp.com/api/resume/${props.resumeId}/language/${languageId}`
      )
      .then((response) => {
        setRefresh(true);
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  return (
    <div className="language">
      <h3>Languages</h3>
      <div id="languageContent">
        <div id="languageList">
          {languages.length > 0 &&
            languages.map((language, i) => (
              <div
                className="languageTitleAndActions d-flex justify-content-between"
                key={i}
              >
                <p>
                  {i + 1}. {language.name} - {language.level}
                </p>
                <div id="languageActions">
                  <EditOutlinedIcon
                    className="clickableLink"
                    onClick={() => handleEditLanguage(i, language.id)}
                  />
                  <HighlightOffOutlinedIcon
                    className="clickableLink"
                    onClick={() => handleDeleteLanguage(language.id)}
                  />
                </div>
              </div>
            ))}
        </div>

        <form id="languageForm" onSubmit={handleLanguageSubmit}>
          <Form.Control
            className="formItem"
            type="text"
            name="language"
            value={languageInput}
            onChange={(e) => setLanguageInput(e.target.value)}
            placeholder="Language Name"
            required
          />
          <Form.Control
            className="formItem"
            as="select"
            custom
            name="level"
            value={levelInput}
            onChange={(e) => setLevelInput(e.target.value)}
          >
            <option value="basic">Basic</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="fluent">Fluent</option>
            <option value="native">Native</option>
          </Form.Control>

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
          id="addLanguageLink"
          className="clickableLink"
          onClick={handleAddLanguage}
        >
          <AddCircleOutlineIcon /> Add language
        </p>
      </div>
    </div>
  );
}

export default Language;
