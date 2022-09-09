import { fromJS } from "immutable";

import { setupMountedComponent } from "../../../../test";
import { ConditionalWrapper } from "../../../../libs";
import NepaliCalendar from "../../../nepali-calendar-input";

import DateColumn from "./component";

describe("<DateColumn />", () => {
  let component;

  const props = {
    value: "2020-04-150T14:04",
    rowAvailable: true,
    wrapper: null,
    valueWithTime: false
  };

  beforeEach(() => {
    ({ component } = setupMountedComponent(DateColumn, props, fromJS({})));
  });

  it("renders a <DateColumn />", () => {
    expect(component.find(DateColumn)).to.have.lengthOf(1);
  });

  it("renders a <ConditionalWrapper />", () => {
    expect(component.find(DateColumn).find(ConditionalWrapper)).to.have.lengthOf(1);
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
