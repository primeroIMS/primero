import { fromJS } from "immutable";

import { mountedComponent, screen } from "../../../../test-utils";

import DateTransitions from "./component";

describe("<DateTransitions />", () => {
  const props = {
    value: "2020-04-150T14:04",
    label: "label-test",
    name: "this-is-name"
  };

  it("renders label", () => {
    mountedComponent(<DateTransitions {...props} />, fromJS({}));
    expect(screen.getByText(/label-test/i)).toBeInTheDocument();
  });

  describe("when ne locale", () => {
    it.skip("renders NepaliCalendar", () => {
      mountedComponent(
        <DateTransitions {...props} />,
        fromJS({
          locale: "ne"
        })
      );
      expect(screen.queryAllByTestId("nepali-container")).toHaveLength(1);
    });
  });
});
