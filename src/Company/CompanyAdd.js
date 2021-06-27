import React, { useState, useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import { Form, Button, Alert } from "react-bootstrap";
import axios from "axios";
import "./CompanyAdd.css";

function CompanyAdd() {
  const [currentCompanies, setCurrentCompanies] = useState([]);
  const [nameInput, setNameInput] = useState("");
  const [industryInput, setIndustryInput] = useState("");
  const [descriptionInput, setDescriptionInput] = useState("");
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [error, setError] = useState("");
  const { authAxios } = useAuth();
  const history = useHistory();

  useEffect(() => {
    axios
      .get("https://volunteer-land-server.herokuapp.com/api/companies")
      .then((companies) => {
        let tempCompanyArray = [];
        companies.data.forEach((company) =>
          tempCompanyArray.push(company.name)
        );
        setCurrentCompanies(tempCompanyArray);
      })
      .catch((error) => {
        console.log(`Error: ${error}`);
      });
  }, []);

  const handleCompanyAddSubmit = (e) => {
    e.preventDefault();

    if (currentCompanies.includes(nameInput)) {
      setError("Company already exists");
    } else {
      authAxios
        .post(`https://volunteer-land-server.herokuapp.com/api/companies`, {
          name: nameInput,
          industry: industryInput,
          description: descriptionInput,
          image_url: imageUrlInput,
        })
        .then(
          (response) => {
            history.push("/newOpportunity");
          },
          (error) => {
            console.log(error.response);
          }
        );
    }
  };

  return (
    <div className="companyAdd smallBox">
      <h2>Add Company</h2>
      <form className="companyAddForm" onSubmit={handleCompanyAddSubmit}>
        <Form.Control
          className="formItem"
          type="text"
          name="name"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          placeholder="Name"
          required
        />
        {error && <Alert variant="danger">{error}</Alert>}
        <Form.Control
          className="formItem"
          type="text"
          name="industry"
          value={industryInput}
          onChange={(e) => setIndustryInput(e.target.value)}
          placeholder="Industry"
          required
        />
        <Form.Control
          className="formItem"
          type="text"
          name="description"
          value={descriptionInput}
          onChange={(e) => setDescriptionInput(e.target.value)}
          placeholder="Description"
          required
        />
        <Form.Control
          className="formItem"
          type="text"
          name="imageUrl"
          value={imageUrlInput}
          onChange={(e) => setImageUrlInput(e.target.value)}
          placeholder="Image URL"
          required
        />
        <div className="formSaveCancelButtons">
          <Button variant="primary" type="submit">
            Submit
          </Button>
          <Link to={`/newopportunity`}>
            <Button variant="primary">Cancel</Button>
          </Link>
        </div>
      </form>
    </div>
  );
}

export default CompanyAdd;
