import { expect } from "chai";
import timezoneMock from "timezone-mock";

import { setupMountedComponent } from "../../../../test";

import DateHeader from "./subform-header-date";

describe("<DateHeader /> - Form - Subforms", () => {
  before(() => {
    timezoneMock.register("US/Eastern");
  });

  it("should render a date value formatted to DATE_FORMAT, when includeTime is false", () => {
    const props = {
      value: "2019-10-02T20:07:00.000Z",
      includeTime: false
    };
    const { component } = setupMountedComponent(DateHeader, props);

    expect(component.text()).to.be.equal("02-Oct-2019");
  });

  it("should render a date value formatted to DATE_TIME_FORMAT, when includeTime is true", () => {
    const props = {
      value: "2019-10-02T20:07:00.000Z",
      includeTime: true
    };
    const { component } = setupMountedComponent(DateHeader, props);

    expect(component.text()).to.be.equal("02-Oct-2019 16:07");
  });
});
