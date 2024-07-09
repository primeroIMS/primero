// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { DASHBOARD_NAMES } from "../../pages/dashboard";
import { INDICATOR_NAMES } from "../../pages/dashboard/constants";
import { mountedComponent, screen } from "../../../test-utils";

import BadgedIndicator from "./component";

describe("<BadgedIndicator />", () => {
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
    mountedComponent(<BadgedIndicator {...props} />, props, {});
  });

  it("renders a BadgedIndicator with a DashboardChip />", () => {
    expect(screen.getAllByTestId("chip-button")).toHaveLength(4);
  });

  describe("When data still loading", () => {
    const propsDataLoading = {
      ...props,
      data: fromJS({}),
      loading: true
    };

    beforeEach(() => {
      mountedComponent(<BadgedIndicator {...propsDataLoading} />);
    });

    it("renders CircularProgress", () => {
      expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });
  });
});
