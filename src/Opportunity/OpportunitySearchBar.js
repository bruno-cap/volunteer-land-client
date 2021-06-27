import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import SearchIcon from "@material-ui/icons/Search";
import "./OpportunitySearchBar.css";

function OpportunitySearchBar() {
  const [opportunityInput, setOpportunityInput] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const history = useHistory();

  const handleOpportunitySearchSubmit = (e) => {
    e.preventDefault();

    history.push(
      `/opportunitysearch/${opportunityInput ? opportunityInput : "blank"}/in/${
        locationInput ? locationInput : "blank"
      }`
    );
  };

  return (
    <div className="opportunitySearchBar">
      <form
        id="opportunitySearchBarForm"
        onSubmit={handleOpportunitySearchSubmit}
      >
        <Container>
          <Row
            className="justify-content-center mx-auto"
            style={{ maxWidth: "700px" }}
          >
            <Col xs={5} className="searchBarCol">
              <Form.Control
                id="opportunitySearchField"
                className="formItem"
                type="text"
                name="opportunity"
                value={opportunityInput}
                onChange={(e) => setOpportunityInput(e.target.value)}
                placeholder="Opportunity"
              />
            </Col>
            <Col xs={5} className="searchBarCol">
              <Form.Control
                id="locationSearchField"
                className="formItem"
                type="text"
                name="location"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                placeholder="Location"
              />
            </Col>
            <Col sm={1} xs={2} className="searchBarCol">
              <Button
                variant="primary"
                id="saveOpportunitySearchFormButton"
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

export default OpportunitySearchBar;
