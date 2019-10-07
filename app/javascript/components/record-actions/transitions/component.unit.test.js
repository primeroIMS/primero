import "test/test.setup";
import { expect } from "chai";
import { setupMountedComponent } from "test";
import { Map } from "immutable";
import {
  TransitionDialog,
  ReferralForm,
  ReassignForm,
  TransferForm
} from "./parts";
import Transitions from "./component";

describe("<Transitions />", () => {
  let component;
  const record = Map({
    id: "03cdfdfe-a8fc-4147-b703-df976d200977",
    case_id: "1799d556-652c-4ad9-9b4c-525d487b5e7b",
    case_id_display: "9b4c525",
    name_first: "W",
    name_last: "D",
    name: "W D"
  });
  describe("Should render ReferralForm if transitionType is 'referral'", () => {
    const props = {
      transitionType: "referral",
      record,
      setTransitionType: () => {}
    };
    beforeEach(() => {
      ({ component } = setupMountedComponent(Transitions, props));
    });

    it("renders TransitionDialog", () => {
      expect(component.find(TransitionDialog)).to.have.length(1);
    });

    it("renders ReferralForm", () => {
      expect(component.find(ReferralForm)).to.have.length(1);
    });
  });

  describe("Should render ReassignForm if transitionType is 'reassign'", () => {
    const props = {
      transitionType: "reassign",
      record
    };
    beforeEach(() => {
      ({ component } = setupMountedComponent(Transitions, props));
    });

    it("renders TransitionDialog", () => {
      expect(component.find(TransitionDialog)).to.have.length(1);
    });

    it("renders ReassignForm", () => {
      expect(component.find(ReassignForm)).to.have.length(1);
    });
  });

  describe("Should render TransferForm if transitionType is 'transfer'", () => {
    const props = {
      transitionType: "transfer",
      record
    };
    beforeEach(() => {
      ({ component } = setupMountedComponent(Transitions, props));
    });

    it("renders TransitionDialog", () => {
      expect(component.find(TransitionDialog)).to.have.length(1);
    });

    it("renders TransferForm", () => {
      expect(component.find(TransferForm)).to.have.length(1);
    });
  });
});
