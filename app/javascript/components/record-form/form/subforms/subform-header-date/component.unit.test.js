import { expect } from "chai";
import { parseISO, format } from "date-fns";

import { setupMountedComponent } from "../../../../../test";
import { DATE_TIME_FORMAT } from "../../../../../config";

import DateHeader from "./component";

describe("<DateHeader /> - Form - Subforms", () => {
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
    const expected = format(parseISO(props.value), DATE_TIME_FORMAT);
    const { component } = setupMountedComponent(DateHeader, props);

    expect(component.text()).to.be.equal(expected);
  });

  it("should render an empty string if any value is passed", () => {
    const props = {
      value: undefined,
      includeTime: true
    };
    const { component } = setupMountedComponent(DateHeader, props);

    expect(component.text()).to.be.empty;
  });
});
