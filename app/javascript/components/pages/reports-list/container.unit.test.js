import { expect } from "chai";
import { fromJS } from "immutable";

import { BarChart } from "./../../charts/bar-chart";
import { setupMountedComponent } from "./../../../test";

import { OptionsBox, ActionMenu } from "./../dashboard";
import Reports from "./container";

describe("<Reports /> - Component", () => {
  let component;

  before(() => {
    component = setupMountedComponent(
      Reports,
      {},
      fromJS({
        records: {
          Reports: {
            casesByNationality: {
              title: "Cases by Nationality",
              column_name: "Nationality",
              description: "Number of cases broken down by nationality",
              data: {
                Nicaragua: 1,
                Argentina: 2,
                Alemania: 3
              }
            },
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
            },
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
            },
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
        }
      })
    ).component;
  });

  it("renders the OptionsBox", () => {
    expect(component.find(OptionsBox)).to.have.length(4);
  });

  it("renders the ActionMenu", () => {
    expect(component.find(ActionMenu)).to.have.length(4);
  });

  it("renders the BarChart", () => {
    expect(component.find(BarChart)).to.have.length(4);
  });

});