import clone from "lodash/clone";
import chai, { expect } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import configureStore from "redux-mock-store";
import * as actionCreators from "./action-creators";
import * as actions from "./actions";

chai.use(sinonChai);

describe("<Reports /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = clone(actionCreators);

    expect(creators).to.have.property("fetchCasesByNationality");
    expect(creators).to.have.property("fetchCasesByAgeAndSex");
    expect(creators).to.have.property("fetchCasesByProtectionConcern");
    expect(creators).to.have.property("fetchCasesByAgency");

    delete creators.fetchCasesByNationality;
    delete creators.fetchCasesByAgeAndSex;
    delete creators.fetchCasesByProtectionConcern;
    delete creators.fetchCasesByAgency;

    expect(creators).to.deep.equal({});
  });

  it("should check the 'fetchCasesByNationality' action creator to return the correct object", () => {
    const options = {
      casesByNationality: {
        title: "Cases by Nationality",
        column_name: "Nationality",
        description: "Number of cases broken down by nationality",
        data: {
          Nicaragua: 1,
          Argentina: 2,
          Alemania: 3
        }
      }
    };
    const store = configureStore()({});
    const dispatch = sinon.spy(store, "dispatch");

    actionCreators.fetchCasesByNationality()(dispatch);

    expect(dispatch).to.have.been.calledWithMatch({
      payload: options,
      type: "Reports/CASES_BY_NATIONALITY"
    });
  });

  it("should check the 'fetchCasesByAgeAndSex' action creator to return the correct object", () => {
    const options = {
      casesByAgeAndSex: {
        title: "Cases by Age and Sex",
        column_name: "Age",
        description: "Number of cases broken down by age and sex",
        data: {
          "0-5": {
            Female: 3,
            Male: 6,
            Other: 0
          },
          "6-11": {
            Female: 1,
            Male: 13,
            Other: 0
          },
          "12-17": {
            Female: 19,
            Male: 29,
            Other: 1
          },
          "18+": {
            Female: 7,
            Male: 10,
            Other: 0
          }
        }
      }
    };
    const store = configureStore()({});
    const dispatch = sinon.spy(store, "dispatch");

    actionCreators.fetchCasesByAgeAndSex()(dispatch);

    expect(dispatch).to.have.been.calledWithMatch({
      payload: options,
      type: "Reports/CASES_BY_AGE_AND_SEX"
    });
  });

  it("should check the 'fetchCasesByProtectionConcern' action creator to return the correct object", () => {
    const options = {
      casesByProtectionConcern: {
        title: "Cases by Protection Concern",
        column_name: "Protection Concern",
        description:
          "Number of cases broken down by protection concern and sex",
        data: {
          "HIGH VULNERABILITY TO ABUSE": {
            Female: 4,
            Male: 0
          },
          "AFFILIATED / ASSOCIATED TO STIGMATIZED PARENTS": {
            Female: 2,
            Male: 0
          },
          "IN CONFLICT WITH THE LAW": {
            Female: 7,
            Male: 0
          },
          "DELINQUENT BEHAVIOR": {
            Female: 4,
            Male: 0
          },
          "HIGH VULNERABILITY TO EXPLOITATION": {
            Female: 3,
            Male: 1
          }
        }
      }
    };
    const store = configureStore()({});
    const dispatch = sinon.spy(store, "dispatch");

    actionCreators.fetchCasesByProtectionConcern()(dispatch);

    expect(dispatch).to.have.been.calledWithMatch({
      payload: options,
      type: "Reports/CASES_BY_PROTECTION_CONCERN"
    });
  });

  it("should check the 'fetchCasesByAgency' action creator to return the correct object", () => {
    const options = {
      casesByAgency: {
        title: "Cases by Agency",
        column_name: "Agency",
        description: "Number of cases broken down by agency",
        data: {
          UNICEF: 3,
          "SAVE THE CHILDREN": 5,
          DOLSA: 1
        }
      }
    };
    const store = configureStore()({});
    const dispatch = sinon.spy(store, "dispatch");

    actionCreators.fetchCasesByAgency()(dispatch);

    expect(dispatch).to.have.been.calledWithMatch({
      payload: options,
      type: "Reports/CASES_BY_AGENCY"
    });
  });

});
