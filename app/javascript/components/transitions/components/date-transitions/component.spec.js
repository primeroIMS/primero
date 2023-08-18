import { fromJS } from "immutable";

import { mountedComponent, screen } from "../../../../test-utils";

import DateTransitions from "./component";

describe("<DateTransitions />", () => {
  const props = {
    value: "2020-04-150T14:04",
    label: "label-test",
    name: "this-is-name"
  };

  it("renders a <DateTransitions />", () => {
    mountedComponent(<DateTransitions {...props} />, fromJS({}));
    expect(screen.getByText(/label-test/i)).toBeInTheDocument();
  });

  it("renders a <DisplayData />", () => {
    mountedComponent(<DateTransitions {...props} />, fromJS({}));
    expect(screen.queryAllByTestId("display-data")).toHaveLength(1);
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
