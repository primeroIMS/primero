import { mountedComponent, screen } from "../../../../test-utils";

import DateTransitionsSummary from "./component";

describe("<DateTransitionsSummary />", () => {
  const props = {
    value: "2020-04-15T14:04",
    label: "label-test",
    name: "this-is-name"
  };

  it("renders a <DateTransitionsSummary />", () => {
    mountedComponent(<DateTransitionsSummary {...props} />);
    expect(screen.getByTestId("date")).toBeInTheDocument();
  });

  describe("when ne locale", () => {
    it("renders NepaliCalendar", () => {
      global.I18n.locale = "ne";
      mountedComponent(<DateTransitionsSummary {...props} />);

      expect(screen.queryAllByTestId("nepali-calendar")).toHaveLength(1);
    });
  });
});
