import { mountedComponent, screen, stub, abbrMonthNames, freezeTimeZone } from "test-utils";

import DateHeader from "./component";

describe("<DateHeader /> - Form - Subforms", () => {
  let stubI18n = null;

  beforeAll(() => {
    stubI18n = stub(window.I18n, "t").withArgs("date.abbr_month_names").returns(abbrMonthNames);
    freezeTimeZone();
  });

  it("should render a date value formatted to DATE_FORMAT, when includeTime is false", () => {
    const props = {
      value: "2019-10-02T20:07:00.000Z",
      includeTime: false
    };

    mountedComponent(<DateHeader {...props} />);
    screen.debug();
    expect(screen.getByText("02-Oct-2019")).toBeInTheDocument();
  });

  it("should render a date value formatted to DATE_TIME_FORMAT, when includeTime is true", () => {
    const props = {
      value: "2019-10-02T20:07:00.000Z",
      includeTime: true
    };

    mountedComponent(<DateHeader {...props} />);

    expect(screen.getByText(/02-Oct-2019 20:07/i)).toBeInTheDocument();
  });

  it("should render an empty string if any value is passed", () => {
    const props = {
      value: undefined,
      includeTime: true
    };

    mountedComponent(<DateHeader {...props} />);

    expect(screen.queryByTestId("date-header")).toBeNull();
  });

  afterAll(() => {
    if (stubI18n) {
      window.I18n.t.restore();
    }
  });
});
