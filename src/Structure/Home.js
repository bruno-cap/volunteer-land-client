import React, { useState, useEffect } from "react";
import { Carousel } from "react-bootstrap";
import OpportunityThumb from "../Opportunity/OpportunityThumb";
import axios from "axios";
import "./Home.css";

function Home() {
  const [opportunityList, setOpportunityList] = useState([]);

  useEffect(() => {
    axios
      .get(
        "https://volunteer-land-server.herokuapp.com/api/opportunities?page=1"
      )
      .then((opportunities) => {
        setOpportunityList(opportunities.data.results.slice(0, 5));
      })
      .catch((error) => {
        console.log(`Error: ${error}`);
      });
  }, []);

  return (
    <div className="home">
      <Carousel id="homeCarousel">
        <Carousel.Item>
          <img
            className="carouselImage"
            src="/images/dog.jpg"
            alt="First slide"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="carouselImage"
            src="/images/learning.jpg"
            alt="Second slide"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="carouselImage"
            src="/images/guitarlesson.jpg"
            alt="Third slide"
          />
        </Carousel.Item>
      </Carousel>

      <h2>Latest opportunities</h2>
      <div id="latestOpportunities">
        {opportunityList.map((opportunity) => (
          <OpportunityThumb
            key={opportunity.id}
            id={opportunity.id}
            imageUrl={opportunity.image_url}
            companyName={opportunity.company_name}
            position={opportunity.position}
            location={opportunity.location}
            description={opportunity.description}
            timestamp={opportunity.timestamp}
          />
        ))}
      </div>
    </div>
  );
}

export default Home;
