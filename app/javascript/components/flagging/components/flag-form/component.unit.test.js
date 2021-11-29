import Form from "../../../form";
import { setupMountedComponent } from "../../../../test";
import { RECORD_TYPES } from "../../../../config/constants";
import ActionButton from "../../../action-button";
import NepaliCalendar from "../../../nepali-calendar-input";

import FlagForm from "./component";

describe("<FlagForm />", () => {
  describe("form inputs", () => {
    let component;

    const props = {
      recordType: RECORD_TYPES.cases,
      record: "230590",
      handleActiveTab: () => {}
    };

    beforeEach(() => {
      ({ component } = setupMountedComponent(FlagForm, props));
    });

    it("should render the FlagForm", () => {
      expect(component.find(FlagForm)).to.have.lengthOf(1);
    });

    it("renders Form", () => {
      expect(component.find(Form)).to.have.lengthOf(1);
    });

    it("renders ActionButton", () => {
      expect(component.find(ActionButton)).to.have.lengthOf(2);
    });

    it("renders component with valid props", () => {
      const flagFormProps = { ...component.find(FlagForm).props() };

      ["handleActiveTab", "record", "recordType"].forEach(property => {
        expect(flagFormProps).to.have.property(property);
        delete flagFormProps[property];
      });
      expect(flagFormProps).to.be.empty;
    });
  });

  describe("when ne locale", () => {
    it.skip("renders Nepali date picker", () => {
      const props = {
        recordType: RECORD_TYPES.cases,
        record: "230590",
        handleActiveTab: () => {}
      };

      window.I18n.locale = "ne";

      const { component } = setupMountedComponent(FlagForm, props);

      expect(component.find(NepaliCalendar)).to.have.lengthOf(1);
    });

    after(() => {
      window.I18n.locale = "en";
    });
  });
});
