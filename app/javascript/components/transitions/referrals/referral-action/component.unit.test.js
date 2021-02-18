import { fromJS } from "immutable";

import TextInput from "../../../form/fields/text-input";
import { setupMountedComponent } from "../../../../test";
import { DONE } from "../constants";

import ReferralAction from "./component";

describe("<ReferralAction /> - Component", () => {
  let component;
  const initialState = fromJS({});

  const props = {
    openReferralDialog: true,
    close: () => {},
    recordType: "cases",
    recordId: "10",
    transistionId: "20",
    referralType: DONE
  };

  beforeEach(() => {
    ({ component } = setupMountedComponent(ReferralAction, props, initialState));
  });

  it("renders ReferralAction component", () => {
    expect(component.find(ReferralAction)).to.have.lengthOf(1);
  });

  it("renders a text field for note_on_referral_from_provider ", () => {
    expect(component.find(TextInput)).to.have.lengthOf(1);
  });

  describe("with rejected status", () => {
    beforeEach(() => {
      ({ component } = setupMountedComponent(
        ReferralAction,
        { ...props, openReferralDialog: true, referralType: "rejected" },
        initialState
      ));
    });

    it("should render the rejected reason text field", () => {
      expect(component.find(TextInput)).to.have.lengthOf(1);
    });
  });
});
