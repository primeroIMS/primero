import { mountedComponent, screen } from "../../../../test-utils";

import DateTransitionsSummary from "./component";

describe("<DateTransitionsSummary />", () => {
  const props = {
    value: "2020-04-150T14:04",
    label: "label-test",
    name: "this-is-name"
  };

  it("renders a <DateTransitionsSummary />", () => {
    mountedComponent(<DateTransitionsSummary {...props} />);
    expect(screen.getByTestId("date")).toBeInTheDocument();
  });

  describe("when ne locale", () => {
    it.skip("renders NepaliCalendar", () => {
      mountedComponent(<DateTransitionsSummary {...props} />, {
        locale: "ne"
      });

      expect(screen.queryAllByTestId("nepali-calendar")).toHaveLength(1);
    });
  });
});
