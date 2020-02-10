import { fromJS } from "immutable";

import { PageContainer, PageContent, PageHeading } from "../../page";
import { expect, setupMountedComponent } from "../../../test";
import { TableValues } from "../../charts";
import { LoadingIndicator } from "../../loading-indicator";

import Report from "./container";

describe("<Report />", () => {
  let component;

  const initialState = fromJS({
    records: {
      reports: {
        loading: false,
        errors: false,
        selectedReport: {
          id: 1,
          name: {
            en: "Registration CP",
            es: "Registration CP"
          },
          description: {
            en: "Case registrations over time",
            es: "Case registrations over time"
          },
          fields: [
            {
              name: "registration_date",
              display_name: {
                en: "Date of Registration or Interview",
                es: ""
              },
              position: {
                type: "horizontal",
                order: 0
              }
            }
          ],
          report_data: {
            "Feb-2020": {
              _total: 3
            }
          }
        }
      }
    }
  });

  before(() => {
    component = setupMountedComponent(Report, {}, initialState).component;
  });

  it("renders report component", () => {
    expect(component.find(Report)).to.have.lengthOf(1);
  });

  it("renders PageContainer, PageHeading and PageContent", () => {
    expect(component.find(PageContainer)).to.have.lengthOf(1);
    expect(component.find(PageContent)).to.have.lengthOf(1);
    expect(component.find(PageHeading)).to.have.lengthOf(1);
  });

  it("renders TableValues", () => {
    expect(component.find(TableValues)).to.have.lengthOf(1);
  });

  describe("When data still loading", () => {
    let component;
    const initialState = fromJS({
      records: {
        reports: {
          loading: true,
          errors: false,
          selectedReport: {}
        }
      }
    });

    before(() => {
      component = setupMountedComponent(Report, {}, initialState).component;
    });

    it("renders report component", () => {
      expect(component.find(Report)).to.have.lengthOf(1);
    });
    it("renders LoadingIndicator", () => {
      expect(component.find(LoadingIndicator)).to.have.lengthOf(1);
      expect(component.find(TableValues)).to.have.lengthOf(0);
    });
  });
});
