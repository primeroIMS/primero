import { fromJS } from "immutable";

import { mountedComponent, screen } from "../../../../test-utils";

import DateTransitions from "./component";

describe("<DateTransitions />", () => {
  const props = {
    value: "2020-04-15T14:04",
    label: "label-test",
    name: "this-is-name"
  };

  it("renders label", () => {
    mountedComponent(<DateTransitions {...props} />, fromJS({}));
    expect(screen.getByText(/label-test/i)).toBeInTheDocument();
  });

  describe("when ne locale", () => {
    it("renders NepaliCalendar", () => {
      global.I18n.locale = "ne";
      mountedComponent(<DateTransitions {...props} />);
      expect(screen.queryAllByTestId("nepali-container")).toHaveLength(1);
    });
  });
});
