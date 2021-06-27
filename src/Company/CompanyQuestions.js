import React, { useState, useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import { Form, Button } from "react-bootstrap";
import { convertDateLong } from "../Helper/DateFunctions";
import HighlightOffOutlinedIcon from "@material-ui/icons/HighlightOffOutlined";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import CompanyAnswers from "./CompanyAnswers";
import axios from "axios";
import "./CompanyQuestions.css";

function CompanyQuestions(props) {
  const [questions, setQuestions] = useState([]);
  const [questionInput, setQuestionInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageTotal, setPageTotal] = useState("");
  const [editQuestionId, setEditQuestionId] = useState("");
  const [refresh, setRefresh] = useState(true);
  const { currentUser, authAxios } = useAuth();

  useEffect(() => {
    refresh &&
      axios
        .get(
          `https://volunteer-land-server.herokuapp.com/api/company/${props.companyId}/questions?page=${currentPage}`
        )
        .then((questionList) => {
          if (currentPage === 1) {
            const pageSize = 3;
            setPageTotal(Math.ceil(questionList.data.count) / pageSize);
            setQuestions(questionList.data.results);
          } else {
            let tempQuestionArray = questions;
            setQuestions(tempQuestionArray.concat(questionList.data.results));
          }
        })
        .catch((error) => console.log(`Error: ${error}`));

    return () => {
      setRefresh(false);
    };
  }, [refresh, currentPage, props.companyId, questions]);

  // Ask question

  const handleAskQuestion = () => {
    document.getElementById("askQuestionForm").style.display = "block";
    document.getElementById("askQuestionLink").style.display = "none";
    let list = document.getElementsByClassName("questionEditDeleteButtons");
    Array.from(list).forEach((element) => {
      element.classList.add("hideQuestionEditDeleteButtons");
    });
  };

  const cancelAskQuestionSubmission = () => {
    document.getElementById("askQuestionForm").style.display = "none";
    document.getElementById("askQuestionLink").style.display = "inline-block";
    let list = document.getElementsByClassName("questionEditDeleteButtons");
    Array.from(list).forEach((element) => {
      element.classList.remove("hideQuestionEditDeleteButtons");
    });
    setEditQuestionId("");
    setQuestionInput("");
  };

  const handleNewQuestionSubmit = (e) => {
    e.preventDefault();

    authAxios
      .post(
        `https://volunteer-land-server.herokuapp.com/api/company/${props.companyId}/questions`,
        {
          company: props.companyId,
          question: questionInput,
        }
      )
      .then((data) => {
        setCurrentPage(1);
        setQuestionInput("");
        setRefresh(true);
        document.getElementById("askQuestionForm").style.display = "none";
        document.getElementById("askQuestionLink").style.display =
          "inline-block";

        let list = document.getElementsByClassName("questionEditDeleteButtons");
        Array.from(list).forEach((element) => {
          element.classList.remove("hideQuestionEditDeleteButtons");
        });
      })
      .catch((error) => console.log(`Error: ${error}`));
  };

  // Edit question

  const handleEditQuestion = (localIndex, dbIndex) => {
    setEditQuestionId(dbIndex);
    setQuestionInput(questions[localIndex].question);
    document.getElementById("askQuestionLink").style.visibility = "hidden";
    let list = document.getElementsByClassName("questionEditDeleteButtons");
    Array.from(list).forEach((element) => {
      element.classList.add("hideQuestionEditDeleteButtons");
    });
    document.getElementById(`editQuestion${dbIndex}Form`).style.display =
      "block";
    document.getElementById(`question${dbIndex}`).style.display = "none";
  };

  const cancelEditQuestionSubmission = (dbIndex) => {
    document.getElementById("askQuestionLink").style.visibility = "visible";

    let list = document.getElementsByClassName("questionEditDeleteButtons");
    Array.from(list).forEach((element) => {
      element.classList.remove("hideQuestionEditDeleteButtons");
    });

    document.getElementById(`editQuestion${dbIndex}Form`).style.display =
      "none";
    document.getElementById(`question${dbIndex}`).style.display = "block";
    setEditQuestionId("");
    setQuestionInput("");
  };

  const handleEditQuestionSubmit = (e) => {
    e.preventDefault();

    authAxios
      .patch(
        `https://volunteer-land-server.herokuapp.com/api/company/${props.companyId}/question/${editQuestionId}`,
        {
          company: props.companyId,
          question: questionInput,
        }
      )
      .then((data) => {
        setCurrentPage(1);
        setQuestionInput("");
        setEditQuestionId("");

        setRefresh(true);
        document.getElementById("askQuestionLink").style.visibility = "visible";
        document.getElementById(
          `editQuestion${editQuestionId}Form`
        ).style.display = "none";

        let list = document.getElementsByClassName("questionEditDeleteButtons");
        Array.from(list).forEach((element) => {
          element.classList.remove("hideQuestionEditDeleteButtons");
        });
      })
      .catch((error) => console.log(`Error: ${error}`));
  };

  // Delete question

  const handleDeleteQuestion = (questionId) => {
    authAxios
      .delete(
        `https://volunteer-land-server.herokuapp.com/api/company/${props.companyId}/question/${questionId}`
      )
      .then((response) => {
        setCurrentPage(1);
        setRefresh(true);
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  return (
    <div className="companyQuestions">
      <h3>Questions and Answers</h3>

      <div id="companyQA">
        {currentUser && (
          <div
            id="askQuestionLink"
            className="clickableLink"
            onClick={handleAskQuestion}
          >
            <AddCircleOutlineIcon /> Ask question
          </div>
        )}

        {/* form to add questions */}
        <Form
          id="askQuestionForm"
          style={{ display: "none" }}
          onSubmit={handleNewQuestionSubmit}
        >
          <Form.Control
            as="textarea"
            rows={3}
            type="text"
            placeholder="Enter your question here."
            value={questionInput}
            onChange={(e) => setQuestionInput(e.target.value)}
            required
          />
          <div className="formSaveCancelButtons">
            <Button variant="primary" type="submit">
              Submit
            </Button>
            <Button variant="primary" onClick={cancelAskQuestionSubmission}>
              Cancel
            </Button>
          </div>
        </Form>

        {!refresh &&
          questions.length > 0 &&
          questions.map((question, i) => (
            <div className="question" key={question.id}>
              {/* form to edit questions */}
              <Form
                id={`editQuestion${question.id}Form`}
                style={{ display: "none" }}
                onSubmit={handleEditQuestionSubmit}
              >
                <Form.Control
                  as="textarea"
                  rows={3}
                  type="text"
                  placeholder="Enter your question here."
                  value={questionInput}
                  onChange={(e) => setQuestionInput(e.target.value)}
                  required
                />
                <div className="formSaveCancelButtons">
                  <Button variant="primary" type="submit">
                    Submit
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => cancelEditQuestionSubmission(question.id)}
                  >
                    Cancel
                  </Button>
                </div>
              </Form>

              <div className="companyQuestion d-flex justify-content-between">
                <div id={`question${question.id}`}>
                  <p>{question.question}</p>
                  <p className="timestamp">
                    {convertDateLong(question.timestamp)}
                  </p>
                </div>
                <div className="questionEditDeleteButtons">
                  {currentUser && question.user === currentUser.id && (
                    <>
                      <EditOutlinedIcon
                        className="clickableLink"
                        onClick={() => handleEditQuestion(i, question.id)}
                      />

                      <HighlightOffOutlinedIcon
                        className="clickableLink"
                        onClick={() => handleDeleteQuestion(question.id)}
                      />
                    </>
                  )}
                </div>
              </div>
              <CompanyAnswers
                questionId={question.id}
                companyId={props.companyId}
              />
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
            - Load more questions -
          </p>
        )}
      </div>
    </div>
  );
}

export default CompanyQuestions;
