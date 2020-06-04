import { fromJS } from "immutable";

import { setupMountedComponent } from "../../../test";
import { MODULES } from "../../../config";

import {
  TransitionDialog,
  ReferralForm,
  ReassignForm,
  TransferForm
} from "./components";
import mockUsers from "./mocked-users";
import Transitions from "./component";

describe("<Transitions />", () => {
  let component;
  const initialState = fromJS({
    application: {
      agencies: [{ unique_id: "agency-unicef", name: "UNICEF" }]
    },
    transitions: {
      reassign: {
        users: [{ user_name: "primero" }]
      },
      mockUsers,
      transfer: {
        users: [{ user_name: "primero_cp" }]
      }
    }
  });
  const record = fromJS({
    id: "03cdfdfe-a8fc-4147-b703-df976d200977",
    case_id: "1799d556-652c-4ad9-9b4c-525d487b5e7b",
    case_id_display: "9b4c525",
    name_first: "W",
    name_last: "D",
    name: "W D",
    module_id: MODULES.CP,
    consent_for_services: true
  });

  describe("when Transitions is rendered", () => {
    const props = {
      assignDialog: true,
      currentPage: 0,
      handleAssignClose: () => {},
      handleReferClose: () => {},
      handleTransferClose: () => {},
      pending: false,
      record,
      recordType: "cases",
      referDialog: false,
      selectedRecords: {},
      setPending: () => {},
      transferDialog: false,
      userPermissions: {}
    };

    beforeEach(() => {
      ({ component } = setupMountedComponent(Transitions, props, initialState));
    });

    it("should accept valid props", () => {
      const transitionsProps = { ...component.find(Transitions).props() };

      expect(component.find(Transitions)).to.have.lengthOf(1);
      [
        "assignDialog",
        "currentPage",
        "handleAssignClose",
        "handleReferClose",
        "handleTransferClose",
        "pending",
        "record",
        "recordType",
        "referDialog",
        "selectedRecords",
        "setPending",
        "transferDialog",
        "userPermissions"
      ].forEach(property => {
        expect(transitionsProps).to.have.property(property);
        delete transitionsProps[property];
      });
      expect(transitionsProps).to.be.empty;
    });
  });

  describe("when transitionType is 'referral'", () => {
    const props = {
      record,
      recordType: "cases",
      userPermissions: fromJS({ cases: ["manage"] }),
      referDialog: true,
      assignDialog: false,
      transferDialog: false,
      handleReferClose: () => {},
      handleAssignClose: () => {},
      handleTransferClose: () => {},
      pending: false,
      setPending: () => {}
    };

    beforeEach(() => {
      ({ component } = setupMountedComponent(Transitions, props, initialState));
    });

    it("renders TransitionDialog", () => {
      expect(component.find(TransitionDialog)).to.have.lengthOf(1);
    });

    it("renders ReferralForm", () => {
      expect(component.find(ReferralForm)).to.have.lengthOf(1);
    });

    describe("with props", () => {
      it("should check the allowed props", () => {
        const referralForm = component.find(ReferralForm);
        const validProps = [
          "userPermissions",
          "providedConsent",
          "recordType",
          "record",
          "setPending",
          "selectedIds",
          "referralRef",
          "disabled",
          "setDisabled"
        ];

        expect(Object.keys(referralForm.props())).to.deep.equal(validProps);
      });
      it("should check the providedConsent prop", () => {
        const referralForm = component.find(ReferralForm);

        expect(referralForm.props().providedConsent).to.equal(true);
      });
      it("should check the userPermissions prop", () => {
        const referralForm = component.find(ReferralForm);

        expect(referralForm.props().userPermissions).to.deep.equal(
          fromJS({
            cases: ["manage"]
          })
        );
      });
      it("should check the setPending prop", () => {
        const referralForm = component.find(ReferralForm);

        expect(referralForm.props().setPending).to.be.a("function");
      });
      it("should check the setDisabled prop", () => {
        const referralForm = component.find(ReferralForm);

        expect(referralForm.props().setDisabled).to.be.a("function");
      });
      it("should check the referralRef prop", () => {
        const referralForm = component.find(ReferralForm);

        expect(referralForm.props().referralRef).to.be.an("object");
      });
      it("should check the disabled prop", () => {
        const referralForm = component.find(ReferralForm);

        expect(referralForm.props().disabled).to.be.false;
      });
      it("should check the recordType prop", () => {
        const referralForm = component.find(ReferralForm);

        expect(referralForm.props().recordType).to.deep.equal("cases");
      });
      it("should check the record prop", () => {
        const referralForm = component.find(ReferralForm);

        expect(referralForm.props().record).to.deep.equal(record);
      });
    });
  });

  describe("when transitionType is 'reassign'", () => {
    const props = {
      record,
      recordType: "cases",
      userPermissions: fromJS({ cases: ["manage"] }),
      referDialog: false,
      assignDialog: true,
      transferDialog: false,
      handleReferClose: () => {},
      handleAssignClose: () => {},
      handleTransferClose: () => {},
      pending: false,
      setPending: () => {}
    };

    beforeEach(() => {
      ({ component } = setupMountedComponent(Transitions, props, initialState));
    });

    it("renders TransitionDialog", () => {
      expect(component.find(TransitionDialog)).to.have.lengthOf(1);
    });

    it("renders ReassignForm", () => {
      expect(component.find(ReassignForm)).to.have.lengthOf(1);
    });

    it("should check the allowed props", () => {
      const reassignForm = component.find(ReassignForm);
      const validProps = [
        "userPermissions",
        "providedConsent",
        "recordType",
        "record",
        "setPending",
        "selectedIds",
        "assignRef"
      ];

      expect(Object.keys(reassignForm.props())).to.deep.equal(validProps);
    });
  });

  describe("when transitionType is 'transfer'", () => {
    const props = {
      record,
      recordType: "cases",
      userPermissions: fromJS({ cases: ["manage"] }),
      referDialog: false,
      assignDialog: false,
      transferDialog: true,
      handleReferClose: () => {},
      handleAssignClose: () => {},
      handleTransferClose: () => {},
      pending: false,
      isBulkTransfer: false,
      setPending: () => {}
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
          "userPermissions",
          "providedConsent",
          "recordType",
          "record",
          "setPending",
          "selectedIds",
          "isBulkTransfer",
          "transferRef",
          "disabled",
          "setDisabled"
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
        expect(transferForm.props().userPermissions).to.deep.equal(
          fromJS({
            cases: ["manage"]
          })
        );
      });
      it("should check the setPending prop", () => {
        expect(transferForm.props().setPending).to.be.a("function");
      });
      it("should check the setDisabled prop", () => {
        expect(transferForm.props().setDisabled).to.be.a("function");
      });
      it("should check the transferRef prop", () => {
        expect(transferForm.props().transferRef).to.be.an("object");
      });
      it("should check the disabled prop", () => {
        expect(transferForm.props().disabled).to.be.false;
      });
      it("should check the isBulkTransfer prop", () => {
        expect(transferForm.props().isBulkTransfer).to.be.false;
      });
      it("should check the record prop", () => {
        expect(transferForm.props().record).to.deep.equal(record);
      });
      it("should check the recordType prop", () => {
        expect(transferForm.props().recordType).to.deep.equal("cases");
      });
    });
  });
});
