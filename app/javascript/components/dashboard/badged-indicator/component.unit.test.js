import { expect } from "chai";
import { fromJS } from "immutable";
import { CircularProgress } from "@material-ui/core";

import { setupMountedComponent } from "../../../test";
import DashboardChip from "../dashboard-chip";
import { DASHBOARD_NAMES } from "../../pages/dashboard";
import { INDICATOR_NAMES } from "../../pages/dashboard/constants";

import BadgedIndicator from "./component";

describe("<BadgedIndicator />", () => {
  let component;
  const props = {
    data: fromJS({
      name: DASHBOARD_NAMES.CASE_RISK,
      type: "indicator",
      indicators: {
        risk_level: {
          medium: {
            count: 1,
            query: ["record_state=true", "status=open", "risk_level=medium"]
          },
          low: {
            count: 0,
            query: ["record_state=true", "status=open", "risk_level=low"]
          },
          high: {
            count: 2,
            query: ["record_state=true", "status=open", "risk_level=none"]
          }
        }
      }
    }),
    lookup: [
      {
        id: "high",
        display_text: { en: "High", es: "" }
      },
      {
        id: "medium",
        display_text: { en: "Medium", es: "" }
      },
      {
        id: "low",
        display_text: { en: "Low", es: "" }
      },
      {
        id: "no_risk",
        display_text: { en: "No Risk", es: "" }
      }
    ],
    indicator: INDICATOR_NAMES.RISK_LEVEL
  };

  beforeEach(() => {
    ({ component } = setupMountedComponent(BadgedIndicator, props, {}));
  });

  it("renders a BadgedIndicator with a DashboardChip />", () => {
    expect(component.find(BadgedIndicator)).to.have.lengthOf(1);
    expect(component.find(DashboardChip)).to.have.lengthOf(4);
  });

  describe("When data still loading", () => {
    let component;
    const propsDataLoading = {
      ...props,
      data: fromJS({}),
      loading: true
    };

    before(() => {
      ({ component } = setupMountedComponent(
        BadgedIndicator,
        propsDataLoading,
        {}
      ));
    });

    it("renders BadgedIndicator component", () => {
      expect(component.find(BadgedIndicator)).to.have.lengthOf(1);
    });
    it("renders CircularProgress", () => {
      expect(component.find(CircularProgress)).to.have.lengthOf(1);
    });
  });
});
