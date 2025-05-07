import { mountedComponent, screen, abbrMonthNames, freezeTimeZone } from "test-utils";

import DateHeader from "./component";

describe("<DateHeader /> - Form - Subforms", () => {
  beforeAll(() => {
    jest.spyOn(window.I18n, "t").mockReturnValue(abbrMonthNames);
    freezeTimeZone();
  });

  it("should render a date value formatted to DATE_FORMAT, when includeTime is false", () => {
    const props = {
      value: "2019-10-02T20:07:00.000Z",
      includeTime: false
    };

    mountedComponent(<DateHeader {...props} />);
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
    jest.restoreAllMocks();
  });
});
