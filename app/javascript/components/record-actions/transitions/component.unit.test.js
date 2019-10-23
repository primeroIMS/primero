import "test/test.setup";
import { expect } from "chai";
import { setupMountedComponent } from "test";
import { Map, List } from "immutable";
import { MODULES } from "config";
import {
  TransitionDialog,
  ReferralForm,
  ReassignForm,
  TransferForm
} from "./parts";
import mockUsers from "./mocked-users";
import Transitions from "./component";

describe("<Transitions />", () => {
  let component;
  const initialState = Map({
    application: Map({
      agencies: List([Map({ unique_id: "agency-unicef", name: "UNICEF" })])
    }),
    transitions: Map({
      reassign: Map({
        users: [{ user_name: "primero" }]
      }),
      mockUsers,
      transfer: Map({
        users: [{ user_name: "primero_cp" }]
      })
    })
  });
  const record = Map({
    id: "03cdfdfe-a8fc-4147-b703-df976d200977",
    case_id: "1799d556-652c-4ad9-9b4c-525d487b5e7b",
    case_id_display: "9b4c525",
    name_first: "W",
    name_last: "D",
    name: "W D",
    module_id: MODULES.CP,
    consent_for_services: true
  });
  describe("when transitionType is 'referral'", () => {
    const props = {
      recordType: "cases",
      transitionType: "referral",
      setTransitionType: () => {},
      record,
      userPermissions: Map({ cases: ["manage"] })
    };
    beforeEach(() => {
      ({ component } = setupMountedComponent(Transitions, props, initialState));
    });

    it("renders TransitionDialog", () => {
      expect(component.find(TransitionDialog)).to.have.length(1);
    });

    it("renders ReferralForm", () => {
      expect(component.find(ReferralForm)).to.have.length(1);
    });

    describe("with props", () => {
      it("should check the allowed props", () => {
        const referralForm = component.find(ReferralForm);
        const validProps = [
          "handleClose",
          "userPermissions",
          "providedConsent",
          "recordType",
          "record"
        ];
        expect(Object.keys(referralForm.props())).to.deep.equal(validProps);
      });
      it("should check the providedConsent prop", () => {
        const referralForm = component.find(ReferralForm);
        expect(referralForm.props().providedConsent).to.equal(true);
      });
      it("should check the userPermissions prop", () => {
        const referralForm = component.find(ReferralForm);
        expect(referralForm.props().userPermissions.toJS()).to.deep.equal({
          cases: ["manage"]
        });
      });
      it("should check the handleClose prop", () => {
        const referralForm = component.find(ReferralForm);
        expect(typeof referralForm.props().handleClose).to.be.equal("function");
      });
      it("should check the recordType prop", () => {
        const referralForm = component.find(ReferralForm);
        expect(referralForm.props().recordType).to.deep.equal("cases");
      });
      it("should check the record prop", () => {
        const referralForm = component.find(ReferralForm);
        expect(referralForm.props().record.toJS()).to.deep.equal(record.toJS());
      });
    });
  });

  describe("when transitionType is 'reassign'", () => {
    const props = {
      recordType: "cases",
      transitionType: "reassign",
      setTransitionType: () => {},
      record,
      userPermissions: Map({ cases: ["manage"] })
    };
    beforeEach(() => {
      ({ component } = setupMountedComponent(Transitions, props, initialState));
    });

    it("renders TransitionDialog", () => {
      expect(component.find(TransitionDialog)).to.have.length(1);
    });

    it("renders ReassignForm", () => {
      expect(component.find(ReassignForm)).to.have.length(1);
    });
  });

  describe("when transitionType is 'transfer'", () => {
    const props = {
      recordType: "cases",
      transitionType: "transfer",
      record,
      userPermissions: Map({ cases: ["manage"] })
    };
    beforeEach(() => {
      ({ component } = setupMountedComponent(Transitions, props, initialState));
    });

    it("renders TransitionDialog", () => {
      expect(component.find(TransitionDialog)).to.have.length(1);
    });

    it("renders TransferForm", () => {
      expect(component.find(TransferForm)).to.have.length(1);
    });
    describe("with props", () => {
      let transferForm;
      beforeEach(() => {
        transferForm = component.find(TransferForm);
      });
      it("should check the allowed props", () => {
        const validProps = [
          "providedConsent",
          "isBulkTransfer",
          "userPermissions",
          "handleClose",
          "transitionType",
          "record",
          "recordType"
        ];
        expect(Object.keys(transferForm.props())).to.deep.equal(validProps);
      });
      it("should check the providedConsent prop", () => {
        expect(transferForm.props().providedConsent).to.equal(true);
      });
      it("should check the isBulkTransfer prop", () => {
        expect(transferForm.props().isBulkTransfer).to.equal(false);
      });
      it("should check the userPermissions prop", () => {
        expect(transferForm.props().userPermissions.toJS()).to.deep.equal({
          cases: ["manage"]
        });
      });
      it("should check the handleClose prop", () => {
        expect(typeof transferForm.props().handleClose).to.be.equal("function");
      });
      it("should check the transitionType prop", () => {
        expect(transferForm.props().transitionType).to.deep.equal("transfer");
      });
      it("should check the record prop", () => {
        expect(transferForm.props().record.toJS()).to.deep.equal(record.toJS());
      });
      it("should check the recordType prop", () => {
        expect(transferForm.props().recordType).to.deep.equal("cases");
      });
    });
  });
});
