import { fromJS } from "immutable";

import { mountedComponent, screen } from "../../../../test-utils";

import DateColumn from "./component";

describe("<DateColumn />", () => {
  const props = {
    value: "2020-04-15T14:04",
    rowAvailable: true,
    wrapper: null,
    valueWithTime: false
  };

  it("renders a <DateColumn />", () => {
    mountedComponent(<DateColumn {...props} />);
    expect(screen.getByTestId("parsed-date")).toBeInTheDocument();
  });

  describe("when ne locale", () => {
    it("renders NepaliCalendar", () => {
      global.I18n.locale = "ne";
      mountedComponent(<DateColumn {...props} />));
      expect(screen.getByTestId("nepali-calendar")).toBeInTheDocument();
    });
  });
});
