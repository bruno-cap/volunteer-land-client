import React, { useState, useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import axios from "axios";
import "./ApplicationDetails.css";

function ApplicationDetails(props) {
  const { authAxios } = useAuth();
  const [opportunityDetails, setOpportunityDetails] = useState("");
  const [applicationDetails, setApplicationDetails] = useState("");
  const [questionList, setQuestionList] = useState([]);
  const [answerList, setAnswerList] = useState([]);
  const [resumeId, setResumeId] = useState("");
  const [resumeDetails, setResumeDetails] = useState("");
  const [workExperiences, setWorkExperiences] = useState("");
  const [academicExperiences, setAcademicExperiences] = useState("");
  const [languages, setLanguages] = useState("");

  useEffect(() => {
    // Retrieve opportunity
    axios
      .get(
        `https://volunteer-land-server.herokuapp.com/api/opportunity/${props.opportunityId}`
      )
      .then((oppt) => {
        setOpportunityDetails(oppt.data);
        let tempQuestionListArray = [];
        oppt.data.question_1 &&
          tempQuestionListArray.push(oppt.data.question_1);
        oppt.data.question_2 &&
          tempQuestionListArray.push(oppt.data.question_2);
        oppt.data.question_3 &&
          tempQuestionListArray.push(oppt.data.question_3);
        oppt.data.question_4 &&
          tempQuestionListArray.push(oppt.data.question_4);
        oppt.data.question_5 &&
          tempQuestionListArray.push(oppt.data.question_5);
        setQuestionList(tempQuestionListArray);
      })
      .catch((error) => {
        console.log(`Error: ${error}`);
      });

    // Retrieve application
    authAxios
      .get(
        `https://volunteer-land-server.herokuapp.com/api/application/${props.applicationId}`
      )
      .then((application) => {
        application.data.resume && setResumeId(application.data.resume);
        setApplicationDetails(application.data);
        let tempAnswerListArray = [];
        application.data.answer_1 &&
          tempAnswerListArray.push(application.data.answer_1);
        application.data.answer_2 &&
          tempAnswerListArray.push(application.data.answer_2);
        application.data.answer_3 &&
          tempAnswerListArray.push(application.data.answer_3);
        application.data.answer_4 &&
          tempAnswerListArray.push(application.data.answer_4);
        application.data.answer_5 &&
          tempAnswerListArray.push(application.data.answer_5);
        setAnswerList(tempAnswerListArray);
      })
      .catch((error) => console.log(`Error: ${error}`));
  }, [authAxios, props.opportunityId, props.applicationId]);

  useEffect(() => {
    // If there is a resume attached, retrieve it
    resumeId &&
      authAxios
        .get(
          `https://volunteer-land-server.herokuapp.com/api/application/${props.applicationId}/resume/${resumeId}`
        )
        .then((resume) => {
          setResumeDetails(resume.data);
        })
        .catch((error) => console.log(`Error: ${error}`));

    // Retrieve Work Experiences
    resumeId &&
      authAxios
        .get(
          `https://volunteer-land-server.herokuapp.com/api/application/${props.applicationId}/resume/${resumeId}/workexperiences`
        )
        .then((workExperienceList) => {
          setWorkExperiences(workExperienceList.data);
        })
        .catch((error) => {
          // no action required
        });

    // Retrieve Academic Experiences
    resumeId &&
      authAxios
        .get(
          `https://volunteer-land-server.herokuapp.com/api/application/${props.applicationId}/resume/${resumeId}/academicexperiences`
        )
        .then((academicExperienceList) => {
          setAcademicExperiences(academicExperienceList.data);
        })
        .catch((error) => {
          // no action required
        });

    // Retrieve Languages
    resumeId &&
      authAxios
        .get(
          `https://volunteer-land-server.herokuapp.com/api/application/${props.applicationId}/resume/${resumeId}/languages`
        )
        .then((languageList) => {
          setLanguages(languageList.data);
        })
        .catch((error) => {
          // no action required
        });
  }, [resumeId, authAxios, props.applicationId]);

  return (
    <div className="applicationDetails bigBox">
      <h2>
        {opportunityDetails.position} at {opportunityDetails.company_name}
      </h2>
      <h3 className="subTitle">Application Details</h3>

      {/* Personal information */}

      <h3>Personal Information</h3>
      <div id="resumePersonalInformation">
        {applicationDetails && (
          <>
            <p>
              {applicationDetails.user.first_name}{" "}
              {applicationDetails.user.last_name}
            </p>
            <p>{applicationDetails.user.email}</p>
            <p>{applicationDetails.user.phone_number}</p>
            <p>{applicationDetails.user.location}</p>
          </>
        )}
      </div>

      {/* Resume details */}

      {resumeDetails && (
        <>
          {resumeDetails.summary && (
            <>
              <h3>Summary</h3>
              <p id="resumeSummary">{resumeDetails.summary}</p>
            </>
          )}

          {workExperiences.length > 0 && (
            <>
              <h3>Work Experience</h3>
              {workExperiences.map((workExperience) => (
                <div className="resumeWorkExperiences" key={workExperience.id}>
                  <p className="jobTitle">{workExperience.position}</p>
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
            </>
          )}
          {academicExperiences.length > 0 && (
            <>
              <h3>Academic Experience</h3>

              {academicExperiences.map((academicExperience) => (
                <div
                  className="resumeAcademicExperiences"
                  key={academicExperience.id}
                >
                  <p className="courseTitle">{academicExperience.course}</p>
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
            </>
          )}

          {languages.length > 0 && (
            <>
              <h3>Languages</h3>

              {languages.map((language, i) => (
                <p className="resumeLanguages" key={language.id}>
                  {i + 1}. {language.name} - {language.level}
                </p>
              ))}
            </>
          )}

          {resumeDetails.other && (
            <>
              <h3>Other</h3>
              <p id="resumeOther">{resumeDetails.other}</p>
            </>
          )}

          {/* Questions and answers */}

          <div id="applicationQuestionAndAnswer">
            <h3>Questions and Answers</h3>

            {questionList.length > 0 &&
              answerList.length > 0 &&
              questionList.map((question, i) => (
                <div key={i}>
                  <p className="applicationQuestions">{question}</p>
                  <p className="applicationAnswers">{answerList[i]}</p>
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  );
}

export default ApplicationDetails;
