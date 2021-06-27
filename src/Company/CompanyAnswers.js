import React, { useState, useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import { Form, Button } from "react-bootstrap";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import HighlightOffOutlinedIcon from "@material-ui/icons/HighlightOffOutlined";
import { convertDateLong } from "../Helper/DateFunctions";
import axios from "axios";
import "./CompanyAnswers.css";

function CompanyAnswers(props) {
  const [answers, setAnswers] = useState("");
  const [answerInput, setAnswerInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageTotal, setPageTotal] = useState("");
  const [editAnswerId, setEditAnswerId] = useState("");
  const [refresh, setRefresh] = useState(true);
  const { currentUser, authAxios } = useAuth();

  useEffect(() => {
    refresh &&
      axios
        .get(
          `https://volunteer-land-server.herokuapp.com/api/question/${props.questionId}/answers?page=${currentPage}`
        )
        .then((answerList) => {
          if (currentPage === 1) {
            const pageSize = 3;
            setPageTotal(Math.ceil(answerList.data.count) / pageSize);
            setAnswers(answerList.data.results);
          } else {
            let tempQuestionArray = answers;
            setAnswers(tempQuestionArray.concat(answerList.data.results));
          }
        })
        .catch((error) => console.log(`Error: ${error}`));

    return () => {
      setRefresh(false);
    };
  }, [refresh, currentPage, props.questionId, answers]);

  // Add answer

  const handleAnswerQuestion = () => {
    document.getElementById(
      `answerToQuestion${props.questionId}Form`
    ).style.display = "block";
    document.getElementById(
      `answerQuestion${props.questionId}Link`
    ).style.display = "none";
    let list = document.getElementsByClassName("answerEditDeleteButtons");
    Array.from(list).forEach((element) => {
      element.classList.add("hideAnswerEditDeleteButtons");
    });
  };

  const cancelAnswerQuestionSubmission = () => {
    setAnswerInput("");
    setEditAnswerId("");
    document.getElementById(
      `answerToQuestion${props.questionId}Form`
    ).style.display = "none";
    document.getElementById(
      `answerQuestion${props.questionId}Link`
    ).style.display = "inline-block";
    let list = document.getElementsByClassName("answerEditDeleteButtons");
    Array.from(list).forEach((element) => {
      element.classList.remove("hideAnswerEditDeleteButtons");
    });
  };

  const handleNewAnswerSubmit = (e) => {
    e.preventDefault();

    authAxios
      .post(
        `https://volunteer-land-server.herokuapp.com/api/question/${props.questionId}/answers`,
        {
          company_question: props.questionId,
          answer: answerInput,
        }
      )
      .then((data) => {
        setCurrentPage(1);
        setAnswerInput("");
        setRefresh(true);
        let list = document.getElementsByClassName("answerEditDeleteButtons");
        Array.from(list).forEach((element) => {
          element.classList.remove("hideAnswerEditDeleteButtons");
        });
        document.getElementById(
          `answerToQuestion${props.questionId}Form`
        ).style.display = "none";
        document.getElementById(
          `answerQuestion${props.questionId}Link`
        ).style.display = "inline-block";
      })
      .catch((error) => console.log(`Error: ${error}`));
  };

  // Edit answer

  const handleEditAnswer = (localIndex, dbIndex) => {
    setEditAnswerId(dbIndex);
    setAnswerInput(answers[localIndex].answer);

    document.getElementById(
      `answerQuestion${props.questionId}Link`
    ).style.visibility = "hidden";
    let list = document.getElementsByClassName("answerEditDeleteButtons");
    Array.from(list).forEach((element) => {
      element.classList.add("hideAnswerEditDeleteButtons");
    });
    document.getElementById(`answer${dbIndex}`).style.display = "none";
    document.getElementById(`editAnswer${dbIndex}Form`).style.display = "block";
  };

  const cancelEditAnswerSubmission = (dbIndex) => {
    setAnswerInput("");
    setEditAnswerId("");

    document.getElementById(
      `answerQuestion${props.questionId}Link`
    ).style.visibility = "visible";
    document.getElementById(`editAnswer${dbIndex}Form`).style.display = "none";
    document.getElementById(`answer${dbIndex}`).style.display = "block";
    let list = document.getElementsByClassName("answerEditDeleteButtons");
    Array.from(list).forEach((element) => {
      element.classList.remove("hideAnswerEditDeleteButtons");
    });
  };

  const handleEditAnswerSubmit = (e) => {
    e.preventDefault();

    authAxios
      .patch(
        `https://volunteer-land-server.herokuapp.com/api/question/${props.questionId}/answer/${editAnswerId}`,
        {
          company_question: props.questionId,
          answer: answerInput,
        }
      )
      .then((data) => {
        setCurrentPage(1);
        setAnswerInput("");
        setEditAnswerId("");
        setRefresh(true);
        document.getElementById(
          `answerQuestion${props.questionId}Link`
        ).style.visibility = "visible";
        let list = document.getElementsByClassName("answerEditDeleteButtons");
        Array.from(list).forEach((element) => {
          element.classList.remove("hideAnswerEditDeleteButtons");
        });
        document.getElementById(`editAnswer${editAnswerId}Form`).style.display =
          "none";
      })
      .catch((error) => console.log(`Error: ${error}`));
  };

  // Delete answer

  const handleDeleteAnswer = (answerId) => {
    authAxios
      .delete(
        `https://volunteer-land-server.herokuapp.com/api/question/${props.questionId}/answer/${answerId}`
      )
      .then((response) => {
        setCurrentPage(1);
        setAnswers("");
        setRefresh(true);
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  return (
    <div className="companyAnswers">
      {/* form to add answers */}
      <Form
        id={`answerToQuestion${props.questionId}Form`}
        className="addAnswerForm"
        style={{ display: "none" }}
        onSubmit={handleNewAnswerSubmit}
      >
        <Form.Control
          as="textarea"
          rows={3}
          type="text"
          placeholder="Answer here"
          value={answerInput}
          onChange={(e) => setAnswerInput(e.target.value)}
        />
        <div className="formSaveCancelButtons">
          <Button variant="primary" type="submit">
            Submit
          </Button>
          <Button variant="primary" onClick={cancelAnswerQuestionSubmission}>
            Cancel
          </Button>
        </div>
      </Form>
      {currentUser && (
        <p
          id={`answerQuestion${props.questionId}Link`}
          onClick={handleAnswerQuestion}
          className="addAnswer clickableLink"
        >
          <AddCircleOutlineIcon /> Answer
        </p>
      )}
      <div id={`answerListToQuestion${props.questionId}`}>
        {!refresh &&
          answers.length > 0 &&
          answers.map((answer, i) => (
            <div className="answer" key={answer.id}>
              {/* form to edit answers */}
              <Form
                id={`editAnswer${answer.id}Form`}
                className="editAnswerForm"
                style={{ display: "none" }}
                onSubmit={handleEditAnswerSubmit}
              >
                <Form.Control
                  as="textarea"
                  rows={3}
                  type="text"
                  placeholder="Answer here"
                  value={answerInput}
                  onChange={(e) => setAnswerInput(e.target.value)}
                />
                <div className="formSaveCancelButtons">
                  <Button variant="primary" type="submit">
                    Submit
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => cancelEditAnswerSubmission(answer.id)}
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
              <div id={`answer${answer.id}`}>
                <div className="answerActions d-flex justify-content-between">
                  <div>
                    <p>{answer.answer}</p>
                    <p className="timestamp">
                      {convertDateLong(answer.timestamp)}
                    </p>
                  </div>
                  {currentUser && answer.user === currentUser.id && (
                    <div className="answerEditDeleteButtons">
                      <EditOutlinedIcon
                        className="clickableLink"
                        onClick={() => handleEditAnswer(i, answer.id)}
                      />

                      <HighlightOffOutlinedIcon
                        className="clickableLink"
                        onClick={() => handleDeleteAnswer(answer.id)}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>
      <div id={`loadMoreAnswersToQuestion${props.questionId}`}>
        {currentPage < pageTotal && (
          <p
            className="loadMore clickableLink"
            onClick={() => {
              setCurrentPage(currentPage + 1);
              setRefresh(true);
            }}
          >
            - Load more answers -
          </p>
        )}
      </div>
    </div>
  );
}

export default CompanyAnswers;
