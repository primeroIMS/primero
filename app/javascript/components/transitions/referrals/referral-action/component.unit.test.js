import { fromJS } from "immutable";

import TextInput from "../../../form/fields/text-input";
import { setupMountedComponent } from "../../../../test";
import { DONE } from "../constants";

import ReferralAction from "./component";

describe("<ReferralAction /> - Component", () => {
  const props = {
    openReferralDialog: true,
    close: () => {},
    recordType: "cases",
    recordId: "10",
    transistionId: "20",
    referralType: DONE
  };

  context("when note_on_referral_from_provider is false", () => {
    const initialState = fromJS({});
    let component;

    beforeEach(() => {
      ({ component } = setupMountedComponent(ReferralAction, props, initialState));
    });

    it("renders ReferralAction component", () => {
      expect(component.find(ReferralAction)).to.have.lengthOf(1);
    });

    it("does not render a text field component", () => {
      expect(component.find(TextInput)).to.have.lengthOf(0);
    });
  });

  context("when note_on_referral_from_provider is true", () => {
    const initialState = fromJS({
      application: {
        systemOptions: { show_provider_note_field: true }
      }
    });
    let component;

    beforeEach(() => {
      ({ component } = setupMountedComponent(ReferralAction, props, initialState));
    });

    it("renders a text field for note_on_referral_from_provider ", () => {
      expect(component.find(TextInput)).to.have.lengthOf(1);
    });
  });
});
