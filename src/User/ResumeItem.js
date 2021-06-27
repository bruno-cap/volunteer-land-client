import React from "react";
import Summary from "./Summary";
import WorkExperience from "./WorkExperience";
import AcademicExperience from "./AcademicExperience";
import Language from "./Language";
import Other from "../User/Other";
import "./ResumeItem.css";

function ResumeItem(props) {
  return (
    <div className="resumeItem bigBox">
      <Summary resumeId={props.resumeId} />
      <WorkExperience resumeId={props.resumeId} />
      <AcademicExperience resumeId={props.resumeId} />
      <Language resumeId={props.resumeId} />
      <Other resumeId={props.resumeId} />
    </div>
  );
}

export default ResumeItem;
