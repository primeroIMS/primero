import { fromJS } from "immutable";

import { mountedComponent, screen } from "../../../../test-utils";

import DateColumn from "./component";

describe("<DateColumn />", () => {

  const props = {
    value: "2020-04-150T14:04",
    rowAvailable: true,
    wrapper: null,
    valueWithTime: false
  };

  it("renders a <DateColumn />", () => {
    mountedComponent(<DateColumn {...props} />, fromJS({}));
    expect(screen.queryByText(/2020-04-150T14:04/i)).toBeNull();
  });

  it("renders a <ConditionalWrapper />", () => {
    mountedComponent(<DateColumn {...props} />, fromJS({}));
    expect(screen.queryByText(/2020-04-150T14:04/i)).toBeNull();
  });

  describe("when ne locale", () => {
    it.skip("renders NepaliCalendar", () => {
      window.I18n.locale = "ne";
      mountedComponent(<DateColumn {...props} />, fromJS({}));
      expect(screen.getByTestId("nepali-calendar")).toBeInTheDocument();
    });
  });
});
