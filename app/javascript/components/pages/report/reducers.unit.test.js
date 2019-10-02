import chai, { expect } from "chai";
import { Map } from "immutable";
import chaiImmutable from "chai-immutable";
import * as r from "./reducers";

chai.use(chaiImmutable);

describe("<Reports /> - Reducers", () => {
  it("should handle Reports/CASES_BY_NATIONALITY", () => {
    const expected = Map({
      title: "Cases by Nationality",
      column_name: "Nationality",
      description: "Number of cases broken down by nationality",
      data: Map({
        Nicaragua: 1,
        Argentina: 2,
        Alemania: 3
      })
    });
    const action = {
      type: "Reports/CASES_BY_NATIONALITY",
      payload: {
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
      }
    };
    const newState = r.reducers.reports(Map({}), action);
    expect(newState.get("casesByNationality")).to.deep.equal(expected);
  });

  it("should handle Reports/CASES_BY_AGE_AND_SEX", () => {
    const expected = Map({
      title: "Cases by Age and Sex",
      column_name: "Age",
      description: "Number of cases broken down by age and sex",
      data: Map({
        "0-5": Map({
          Female: 3,
          Male: 6,
          Other: 0
        }),
        "6-11": Map({
          Female: 1,
          Male: 13,
          Other: 0
        }),
        "12-17": Map({
          Female: 19,
          Male: 29,
          Other: 1
        }),
        "18+": Map({
          Female: 7,
          Male: 10,
          Other: 0
        })
      })
    });
    const action = {
      type: "Reports/CASES_BY_AGE_AND_SEX",
      payload: {
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
      }
    };
    const newState = r.reducers.reports(Map({}), action);
    expect(newState.get("casesByAgeAndSex")).to.deep.equal(expected);
  });

  it("should handle Reports/CASES_BY_PROTECTION_CONCERN", () => {
    const expected = Map({
      title: "Cases by Protection Concern",
      column_name: "Protection Concern",
      description: "Number of cases broken down by protection concern and sex",
      data: Map({
        "HIGH VULNERABILITY TO ABUSE": Map({
          Female: 4,
          Male: 0
        }),
        "AFFILIATED / ASSOCIATED TO STIGMATIZED PARENTS": Map({
          Female: 2,
          Male: 0
        }),
        "IN CONFLICT WITH THE LAW": Map({
          Female: 7,
          Male: 0
        }),
        "DELINQUENT BEHAVIOR": Map({
          Female: 4,
          Male: 0
        }),
        "HIGH VULNERABILITY TO EXPLOITATION": Map({
          Female: 3,
          Male: 1
        })
      })
    });
    const action = {
      type: "Reports/CASES_BY_PROTECTION_CONCERN",
      payload: {
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
      }
    };
    const newState = r.reducers.reports(Map({}), action);
    expect(newState.get("casesByProtectionConcern")).to.deep.equal(expected);
  });

  it("should handle Reports/CASES_BY_AGENCY", () => {
    const expected = Map({
      title: "Cases by Agency",
      column_name: "Agency",
      description: "Number of cases broken down by agency",
      data: Map({
        UNICEF: 3,
        "SAVE THE CHILDREN": 5,
        DOLSA: 1
      })
    });
    const action = {
      type: "Reports/CASES_BY_AGENCY",
      payload: {
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
      }
    };
    const newState = r.reducers.reports(Map({}), action);
    expect(newState.get("casesByAgency")).to.deep.equal(expected);
  });
});
