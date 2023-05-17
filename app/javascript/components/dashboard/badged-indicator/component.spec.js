import { fromJS } from "immutable";
import { mountedComponent, screen } from "test-utils";

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
    mountedComponent(<BadgedIndicator {...props} />);
  });

  it("renders a BadgedIndicator with a DashboardChip />", () => {
    expect(screen.getAllByRole("DashboardChip")).toHaveLength(4);
  });

  describe("When data still loading", () => {
    let loadingComponent;
    const propsDataLoading = {
      ...props,
      data: fromJS({}),
      loading: true
    };

    beforeEach(() => {
      mountedComponent(<BadgedIndicator {...propsDataLoading} />);
    });

    it("renders BadgedIndicator component", () => {
      expect(screen.getByTestId("badged-indicator")).toBeInTheDocument();
    });
    it("renders CircularProgress", () => {
      expect(screen.getAllByRole("progressbar")).toHaveLength(1);
    });
  });
});
0;
