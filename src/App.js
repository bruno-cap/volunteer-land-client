import React, { useState, useEffect } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { useAuth } from "./Context/AuthContext";
import Login from "./User/Login";
import Signup from "./User/Signup";
import Header from "./Structure/Header";
import Home from "./Structure/Home";
import OpportunitySearchBar from "./Opportunity/OpportunitySearchBar";
import OpportunitySearchResults from "./Opportunity/OpportunitySearchResults";
import OpportunityList from "./Opportunity/OpportunityList";
import OpportunityInfo from "./Opportunity/OpportunityInfo";
import OpptSaved from "./Opportunity/OpptSaved";
import OpptApplied from "./Opportunity/OpptApplied";
import OpptPosted from "./Opportunity/OpptPosted";
import Application from "./User/Application";
import ApplicationList from "./User/ApplicationList";
import ApplicationDetails from "./User/ApplicationDetails";
import NewOpportunity from "./Opportunity/NewOpportunity";
import ResumeItem from "./User/ResumeItem";
import CompanySearchBar from "./Company/CompanySearchBar";
import CompanySearchResults from "./Company/CompanySearchResults";
import CompanyAdd from "./Company/CompanyAdd";
import CompanyList from "./Company/CompanyList";
import CompanyInfo from "./Company/CompanyInfo";
import UserProfile from "./User/UserProfile";
import MyOpportunitiesNav from "./Opportunity/MyOpportunitiesNav";
import Footer from "./Structure/Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  const { retrieveCurrentUser, currentUser } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loading && retrieveCurrentUser() && setLoading(false);
  }, [retrieveCurrentUser, loading]);

  return (
    <div className="app d-flex flex-column min-vh-100">
      {!loading && (
        <>
          <Header />

          <div className="main flex-grow-1">
            <Switch>
              <Route exact path="/">
                <OpportunitySearchBar />
                <Home />
              </Route>

              <Route exact path="/opportunities">
                <OpportunitySearchBar />
                <OpportunityList page={1} />
              </Route>

              <Route
                path="/opportunities/page/:page"
                render={(props) => (
                  <>
                    <OpportunitySearchBar />
                    <OpportunityList page={props.match.params.page} />
                  </>
                )}
              />

              <Route
                exact
                path="/opportunity/:opportunityId"
                render={(props) => (
                  <OpportunityInfo
                    opportunityId={props.match.params.opportunityId}
                  />
                )}
              />

              <Route
                exact
                path="/opportunitysearch/:opportunity/in/:location"
                render={(props) => (
                  <>
                    <OpportunitySearchBar />
                    <OpportunitySearchResults
                      page={1}
                      opportunity={props.match.params.opportunity}
                      location={props.match.params.location}
                    />
                  </>
                )}
              />

              <Route
                exact
                path="/opportunitysearch/:opportunity/in/:location/page/:page"
                render={(props) => (
                  <>
                    <OpportunitySearchBar />
                    <OpportunitySearchResults
                      page={props.match.params.page}
                      opportunity={props.match.params.opportunity}
                      location={props.match.params.location}
                    />
                  </>
                )}
              />

              <Route exact path="/companies">
                <CompanySearchBar />
                <CompanyList page={1} />
              </Route>

              <Route
                path="/companies/page/:page"
                render={(props) => (
                  <>
                    <CompanySearchBar />
                    <CompanyList page={props.match.params.page} />
                  </>
                )}
              />

              <Route
                exact
                path="/companysearch/:company"
                render={(props) => (
                  <>
                    <CompanySearchBar />
                    <CompanySearchResults
                      page={1}
                      company={props.match.params.company}
                    />
                  </>
                )}
              />

              <Route
                exact
                path="/companysearch/:company/page/:page"
                render={(props) => (
                  <>
                    <CompanySearchBar />
                    <CompanySearchResults
                      page={props.match.params.page}
                      company={props.match.params.company}
                    />
                  </>
                )}
              />

              <Route exact path="/profile" component={UserProfile} />

              <Route
                path="/company/:companyId"
                render={(props) => (
                  <CompanyInfo companyId={props.match.params.companyId} />
                )}
              />
            </Switch>

            {!currentUser ? (
              <>
                <Switch>
                  <Route exact path="/login" component={Login} />

                  <Route exact path="/signup" component={Signup} />

                  <Route exact path="/newopportunity">
                    <Redirect to="/login" />
                  </Route>

                  <Route path="/opportunity/:opportunityId/apply">
                    <Redirect to="/login" />
                  </Route>

                  <Route path="/opportunity/:opportunityId/applications">
                    <Redirect to="/login" />
                  </Route>

                  <Route path="/opportunity/:opportunityId/application/:applicationId">
                    <Redirect to="/login" />
                  </Route>

                  <Route path="/myopportunities">
                    <Redirect to="/login" />
                  </Route>

                  <Route exact path="/profile">
                    <Redirect to="/login" />
                  </Route>

                  <Route path="/resume">
                    <Redirect to="/login" />
                  </Route>
                </Switch>
              </>
            ) : (
              // Protected Routes
              <Switch>
                <Route exact path="/login">
                  <Redirect to="/" />
                </Route>

                <Route exact path="/signup">
                  <Redirect to="/" />
                </Route>

                <Route
                  path="/resume/:resumeId"
                  render={(props) => (
                    <ResumeItem resumeId={props.match.params.resumeId} />
                  )}
                />

                <Route
                  path="/opportunity/:opportunityId/apply"
                  render={(props) => (
                    <Application
                      opportunityId={props.match.params.opportunityId}
                    />
                  )}
                />

                <Route exact path="/myopportunities">
                  <MyOpportunitiesNav />
                  <OpptSaved page={1} />
                </Route>

                <Route exact path="/myopportunities/saved">
                  <Redirect to="/myopportunities" />
                </Route>

                <Route
                  path="/myopportunities/page/:page"
                  render={(props) => (
                    <>
                      <MyOpportunitiesNav />
                      <OpptSaved page={props.match.params.page} />
                    </>
                  )}
                />

                <Route exact path="/myopportunities/applied">
                  <MyOpportunitiesNav />
                  <OpptApplied page={1} />
                </Route>

                <Route
                  path="/myopportunities/applied/page/:page"
                  render={(props) => (
                    <>
                      <MyOpportunitiesNav />
                      <OpptApplied page={props.match.params.page} />
                    </>
                  )}
                />

                <Route exact path="/myopportunities/posted">
                  <MyOpportunitiesNav />
                  <OpptPosted page={1} />
                </Route>

                <Route
                  path="/myopportunities/posted/page/:page"
                  render={(props) => (
                    <>
                      <MyOpportunitiesNav />
                      <OpptPosted page={props.match.params.page} />
                    </>
                  )}
                />

                <Route
                  exact
                  path="/newopportunity"
                  component={NewOpportunity}
                />

                <Route exact path="/companyAdd" component={CompanyAdd} />

                <Route
                  path="/opportunity/:opportunityId/applications"
                  render={(props) => (
                    <ApplicationList
                      opportunityId={props.match.params.opportunityId}
                    />
                  )}
                />

                <Route
                  path="/opportunity/:opportunityId/application/:applicationId"
                  render={(props) => (
                    <ApplicationDetails
                      opportunityId={props.match.params.opportunityId}
                      applicationId={props.match.params.applicationId}
                    />
                  )}
                />
              </Switch>
            )}
          </div>

          <Footer />
        </>
      )}
    </div>
  );
}

export default App;
