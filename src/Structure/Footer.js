import React from "react";
import { Link} from "react-router-dom"
import InstagramIcon from "@material-ui/icons/Instagram";
import FacebookIcon from "@material-ui/icons/Facebook";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import EmailOutlinedIcon from "@material-ui/icons/EmailOutlined";
import "./Footer.css";

function Footer() {
  return (
    <div className="footer">
      <p>Volunteer App Concept</p>
        <p>Developed by{" "}
        <Link to={{ pathname: "http://brunodev.com" }} target="_blank">Bruno Cabral </Link>
        </p>
      <div className="footerIcons mt-2">
        <InstagramIcon fontSize="large" />
        <FacebookIcon fontSize="large" />
        <LinkedInIcon fontSize="large" />
        <EmailOutlinedIcon fontSize="large" />
      </div>
    </div>
  );
}

export default Footer;
