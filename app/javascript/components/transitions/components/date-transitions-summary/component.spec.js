import { fromJS } from "immutable";

import { mountedComponent, screen } from "../../../../test-utils";

import DateTransitionsSummary from "./component";

describe("<DateTransitionsSummary />", () => {
  const props = {
    value: "2020-04-150T14:04",
    label: "label-test",
    name: "this-is-name"
  };

  it("renders a <DateTransitionsSummary />", () => {
    mountedComponent(<DateTransitionsSummary {...props} />, fromJS({}));
    expect(screen.getByTestId("localize-date")).toBeInTheDocument();
  });

  describe("when ne locale", () => {
    it.skip("renders NepaliCalendar", () => {
      mountedComponent(
        <DateTransitionsSummary {...props} />,
        fromJS({
          locale: "ne"
        })
      );
      expect(screen.queryAllByTestId("nepali-container")).toHaveLength(1);
    });
  });
});
