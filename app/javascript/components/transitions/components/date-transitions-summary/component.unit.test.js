// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { setupMountedComponent } from "../../../../test";
import NepaliCalendar from "../../../nepali-calendar-input";

import DateTransitionsSummary from "./component";

describe("<DateTransitionsSummary />", () => {
  let component;

  const props = {
    value: "2020-04-150T14:04",
    label: "label-test",
    name: "this-is-name"
  };

  beforeEach(() => {
    ({ component } = setupMountedComponent(DateTransitionsSummary, props, fromJS({})));
  });

  it("renders a <DateTransitionsSummary />", () => {
    expect(component.find(DateTransitionsSummary)).to.have.lengthOf(1);
  });

  describe("when ne locale", () => {
    it.skip("renders NepaliCalendar", () => {
      window.I18n.locale = "ne";

      expect(component.find(NepaliCalendar)).to.have.lengthOf(1);
    });

    after(() => {
      window.I18n.locale = "en";
    });
  });
});
