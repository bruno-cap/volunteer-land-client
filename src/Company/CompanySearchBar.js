import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import SearchIcon from "@material-ui/icons/Search";
import "./CompanySearchBar.css";

function CompanySearchBar() {
  const [companyInput, setCompanyInput] = useState("");
  const history = useHistory();

  const handlecompanySearchSubmit = (e) => {
    e.preventDefault();

    history.push(`/companysearch/${companyInput ? companyInput : "blank"}`);
  };

  return (
    <div className="companySearchBar">
      <form id="companySearchBarForm" onSubmit={handlecompanySearchSubmit}>
        <Container>
          <Row
            className="justify-content-center mx-auto"
            style={{ maxWidth: "500px" }}
          >
            <Col xs={8} className="searchBarCol">
              <Form.Control
                id="companySearchField"
                className="formItem"
                type="text"
                name="company"
                value={companyInput}
                onChange={(e) => setCompanyInput(e.target.value)}
                placeholder="Company"
              />
            </Col>
            <Col sm={1} xs={2} className="searchBarCol">
              <Button
                variant="primary"
                id="saveCompanySearchFormButton"
                type="submit"
              >
                <SearchIcon />
              </Button>
            </Col>
          </Row>
        </Container>
      </form>
    </div>
  );
}

export default CompanySearchBar;
