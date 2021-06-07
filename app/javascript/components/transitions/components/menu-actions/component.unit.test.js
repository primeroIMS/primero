import { Menu } from "@material-ui/core";
import { fromJS } from "immutable";

import DisableOffline from "../../../disable-offline";
import ActionButton from "../../../action-button";
import { setupMountedComponent } from "../../../../test";
import { ACTIONS } from "../../../../libs/permissions";
import { TransitionRecord } from "../../records";
import RevokeModal from "../revoke-modal";
import TransferApproval from "../../transfers/transfer-approval";
import ReferralAction from "../../referrals/referral-action";

import TransitionActions from "./component";

describe("<MenuActions /> - Component", () => {
  let component;

  describe("Component Menu", () => {
    describe("with referral transition type", () => {
      const state = {
        records: {
          cases: {
            data: [
              {
                id: "804d74bc-53b0-4b71-9a81-8ac419792f75",
                case_id_display: "804d74bc"
              }
            ]
          }
        },
        ui: {
          dialogs: {
            pending: false,
            "showReferral-804d74bc-53b0-4b71-9a81-8ac419792f75": false
          }
        },
        user: {
          username: "primero_test",
          permissions: {
            cases: [ACTIONS.MANAGE]
          }
        }
      };

      const props = {
        transition: TransitionRecord({
          id: "804d74bc-53b0-4b71-9a81-8ac419792f75",
          record_id: "5a291f55-c92a-4786-be2a-13b98fd143e1",
          record_type: "case",
          created_at: "2020-02-14T23:00:35.345Z",
          notes: "",
          rejected_reason: "",
          status: "in_progress",
          type: "Referral",
          consent_overridden: true,
          consent_individual_transfer: false,
          transitioned_by: "primero_admin_cp",
          transitioned_to: "primero_cp_ar",
          service: "legal_assistance_service"
        }),
        showMode: true,
        recordType: "cases",
        classes: {}
      };

      describe("when user has access to all menus", () => {
        beforeEach(() => {
          ({ component } = setupMountedComponent(TransitionActions, props, state));
        });

        it("renders Menu", () => {
          expect(component.find(Menu)).to.have.lengthOf(1);
        });

        it("renders MenuItem", () => {
          const menuChildren = component.find(Menu).props().children;

          expect(menuChildren).to.have.lengthOf(1);
        });

        it("should only render the revoke option", () => {
          const menuChildrenAction = component
            .find(Menu)
            .props()
            .children.map(elem => elem.props.children);

          expect(menuChildrenAction).to.deep.equals(["actions.revoke"]);
        });

        context("when is offline", () => {
          it("should disable the actions", () => {
            const { component: offlineComp } = setupMountedComponent(TransitionActions, props, {
              ...state,
              connectivity: { online: false }
            });

            expect(offlineComp.find(DisableOffline)).to.have.lengthOf(1);
            expect(offlineComp.find(ActionButton).props().disabled).to.be.true;
          });
        });
      });

      context("when current user is recipient", () => {
        const userRecipientState = fromJS(state).setIn(["user", "username"], "primero_cp_ar");

        beforeEach(() => {
          ({ component } = setupMountedComponent(TransitionActions, props, userRecipientState));
        });

        it("should render the accept and reject actions", () => {
          const menuChildrenAction = component
            .find(Menu)
            .props()
            .children.map(elem => elem.props.children);

          expect(menuChildrenAction).to.deep.equals(["buttons.accept", "buttons.reject"]);
        });

        context("when the referral is accepted", () => {
          beforeEach(() => {
            ({ component } = setupMountedComponent(
              TransitionActions,
              { ...props, transition: props.transition.set("status", "accepted") },
              userRecipientState
            ));
          });

          it("should only render the done action", () => {
            const menuChildrenAction = component
              .find(Menu)
              .props()
              .children.map(elem => elem.props.children);

            expect(menuChildrenAction).to.deep.equals(["buttons.done"]);
          });
        });

        context("when the referral is rejected", () => {
          beforeEach(() => {
            ({ component } = setupMountedComponent(
              TransitionActions,
              { ...props, transition: props.transition.set("status", "rejected") },
              userRecipientState
            ));
          });

          it("should not render actions", () => {
            expect(component.find(Menu)).to.have.lengthOf(0);
          });
        });
      });

      describe("when user has not access to all menus", () => {
        beforeEach(() => {
          ({ component } = setupMountedComponent(TransitionActions, props, {
            ...state,
            user: { permissions: { cases: [ACTIONS.READ] } }
          }));
        });

        it("renders Menu", () => {
          expect(component.find(Menu)).to.be.empty;
        });
      });
    });

    describe("with transfer transition type", () => {
      const state = {
        records: {
          cases: {
            data: [
              {
                id: "804d74bc-53b0-4b71-9a81-8ac419792f75",
                case_id_display: "804d74bc"
              }
            ]
          }
        },
        ui: {
          dialogs: {
            pending: false,
            "showTransfer-804d74bc-53b0-4b71-9a81-8ac419792f75": false
          }
        },
        user: {
          username: "primero_test",
          permissions: {
            cases: [ACTIONS.MANAGE]
          }
        }
      };

      const props = {
        transition: TransitionRecord({
          id: "d3d909ed-2203-4c85-9b52-b9ed8883a76c",
          record_id: "5a291f55-c92a-4786-be2a-13b98fd143e1",
          record_type: "case",
          created_at: "2020-02-14T23:00:35.345Z",
          notes: "",
          rejected_reason: "",
          status: "in_progress",
          type: "Transfer",
          consent_overridden: true,
          consent_individual_transfer: false,
          transitioned_by: "primero_admin_cp",
          transitioned_to: "primero_cp_ar",
          service: "legal_assistance_service"
        }),
        showMode: true,
        recordType: "cases",
        classes: {}
      };

      describe("when user has access to all menus", () => {
        beforeEach(() => {
          ({ component } = setupMountedComponent(TransitionActions, props, state));
        });

        it("renders Menu", () => {
          expect(component.find(Menu)).to.have.lengthOf(1);
        });

        it("renders MenuItem", () => {
          const menuChildren = component.find(Menu).props().children;

          expect(menuChildren).to.have.lengthOf(1);
        });

        it("renders MenuItem with revoke option", () => {
          const menuChildrenAction = component.find(Menu).props().children[0].props.children;

          expect(menuChildrenAction).to.be.equals("actions.revoke");
        });
      });

      describe("when user has not access to all menus", () => {
        beforeEach(() => {
          ({ component } = setupMountedComponent(TransitionActions, props, {
            ...state,
            user: { permissions: { cases: [ACTIONS.READ] } }
          }));
        });

        it("renders Menu", () => {
          expect(component.find(Menu)).to.be.empty;
        });
      });
    });
  });

  describe("Component RevokeModal", () => {
    const state = {
      records: {
        cases: {
          data: [
            {
              id: "804d74bc-53b0-4b71-9a81-8ac419792f75",
              case_id_display: "804d74bc"
            }
          ]
        }
      },
      ui: {
        dialogs: {
          pending: false,
          "showReferral-804d74bc-53b0-4b71-9a81-8ac419792f75": false
        }
      },
      user: {
        username: "primero_test",
        permissions: {
          cases: [ACTIONS.MANAGE]
        }
      }
    };

    const props = {
      transition: TransitionRecord({
        id: "804d74bc-53b0-4b71-9a81-8ac419792f75",
        record_id: "5a291f55-c92a-4786-be2a-13b98fd143e1",
        record_type: "case",
        created_at: "2020-02-14T23:00:35.345Z",
        notes: "",
        rejected_reason: "",
        status: "in_progress",
        type: "Referral",
        consent_overridden: true,
        consent_individual_transfer: false,
        transitioned_by: "primero_admin_cp",
        transitioned_to: "primero_cp_ar",
        service: "legal_assistance_service"
      }),
      showMode: true,
      recordType: "cases",
      classes: {}
    };

    beforeEach(() => {
      ({ component } = setupMountedComponent(TransitionActions, props, state));
    });

    it("renders RevokeModal", () => {
      expect(component.find(RevokeModal)).to.have.lengthOf(1);
    });

    it("renders valid props for RevokeModal components", () => {
      const exportProps = { ...component.find(RevokeModal).props() };

      expect(component.find(RevokeModal)).to.have.lengthOf(1);
      ["name", "open", "transition", "close", "recordType", "pending", "setPending"].forEach(property => {
        expect(exportProps).to.have.property(property);
        delete exportProps[property];
      });
      expect(exportProps).to.be.empty;
    });
  });

  describe("Component TransferApproval", () => {
    const state = {
      records: {
        cases: {
          data: [
            {
              id: "804d74bc-53b0-4b71-9a81-8ac419792f75",
              case_id_display: "804d74bc"
            }
          ]
        }
      },
      ui: {
        dialogs: {
          pending: false,
          "showReferral-804d74bc-53b0-4b71-9a81-8ac419792f75": false
        }
      },
      user: {
        username: "primero_test",
        permissions: {
          cases: [ACTIONS.MANAGE]
        }
      }
    };

    const props = {
      transition: TransitionRecord({
        id: "804d74bc-53b0-4b71-9a81-8ac419792f75",
        record_id: "5a291f55-c92a-4786-be2a-13b98fd143e1",
        record_type: "case",
        created_at: "2020-02-14T23:00:35.345Z",
        notes: "",
        rejected_reason: "",
        status: "in_progress",
        type: "Transfer",
        consent_overridden: true,
        consent_individual_transfer: false,
        transitioned_by: "primero_admin_cp",
        transitioned_to: "primero_cp_ar",
        service: "legal_assistance_service"
      }),
      showMode: true,
      recordType: "cases",
      classes: {}
    };

    beforeEach(() => {
      ({ component } = setupMountedComponent(TransitionActions, props, state));
    });

    it("renders TransferApproval", () => {
      expect(component.find(TransferApproval)).to.have.lengthOf(1);
    });

    it("renders valid props for TransferApproval components", () => {
      const exportProps = { ...component.find(TransferApproval).props() };

      expect(component.find(TransferApproval)).to.have.lengthOf(1);
      [
        "openTransferDialog",
        "close",
        "approvalType",
        "recordId",
        "transferId",
        "recordType",
        "pending",
        "setPending",
        "dialogName"
      ].forEach(property => {
        expect(exportProps).to.have.property(property);
        delete exportProps[property];
      });
      expect(exportProps).to.be.empty;
    });
  });

  describe("Component ReferralAction", () => {
    const state = {
      records: {
        cases: {
          data: [
            {
              id: "804d74bc-53b0-4b71-9a81-8ac419792f75",
              case_id_display: "804d74bc"
            }
          ]
        }
      },
      ui: {
        dialogs: {
          pending: false,
          "showReferral-804d74bc-53b0-4b71-9a81-8ac419792f75": false
        }
      },
      user: {
        username: "primero_test",
        permissions: {
          cases: [ACTIONS.MANAGE]
        }
      }
    };

    const props = {
      transition: TransitionRecord({
        id: "804d74bc-53b0-4b71-9a81-8ac419792f75",
        record_id: "5a291f55-c92a-4786-be2a-13b98fd143e1",
        record_type: "case",
        created_at: "2020-02-14T23:00:35.345Z",
        notes: "",
        rejected_reason: "",
        status: "in_progress",
        type: "Referral",
        consent_overridden: true,
        consent_individual_transfer: false,
        transitioned_by: "primero_admin_cp",
        transitioned_to: "primero_cp_ar",
        service: "legal_assistance_service"
      }),
      showMode: true,
      recordType: "cases",
      classes: {}
    };

    beforeEach(() => {
      ({ component } = setupMountedComponent(TransitionActions, props, state));
    });

    it("renders ReferralAction", () => {
      expect(component.find(ReferralAction)).to.have.lengthOf(1);
    });

    it("renders valid props for ReferralAction components", () => {
      const exportProps = { ...component.find(ReferralAction).props() };

      expect(component.find(ReferralAction)).to.have.lengthOf(1);
      [
        "openReferralDialog",
        "close",
        "recordId",
        "pending",
        "setPending",
        "transistionId",
        "recordType",
        "dialogName",
        "referralType"
      ].forEach(property => {
        expect(exportProps).to.have.property(property);
        delete exportProps[property];
      });
      expect(exportProps).to.be.empty;
    });
  });
});
