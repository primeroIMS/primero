import { fromJS } from "immutable";

import { fireEvent, mountedComponent, screen } from "../../../../test-utils";
import { ACTIONS } from "../../../permissions";
import { TransitionRecord } from "../../records";

import TransitionActions from "./component";

describe("<MenuActions /> - Component", () => {
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

      const referral = TransitionRecord({
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
      });

      const props = {
        transition: referral,
        showMode: true,
        recordType: "cases",
        classes: {}
      };

      describe("when user has access to all menus", () => {
        it("renders Menu", () => {
          mountedComponent(<TransitionActions {...props} />, state);
          expect(screen.getByLabelText(/more/i)).toBeInTheDocument();
        });

        it("renders MenuItem", () => {
          mountedComponent(<TransitionActions {...props} />, state);

          expect(screen.getAllByTestId("menu-item")).toHaveLength(1);
        });

        it("should only render the revoke option", () => {
          mountedComponent(<TransitionActions {...props} />, state);
          expect(screen.getByText(/actions.revoke/i)).toBeInTheDocument();
        });

        describe("when is offline", () => {
          it("should disable the actions", () => {
            mountedComponent(<TransitionActions {...props} />, {
              ...state,
              connectivity: { online: false }
            });
            expect(screen.getByLabelText(/more/i)).toBeDisabled();
          });
        });
      });

      describe("when current user is recipient", () => {
        const userRecipientState = fromJS(state).setIn(["user", "username"], "primero_cp_ar");
        const referralWithAcceptOrReject = referral.set("user_can_accept_or_reject", true);

        const recipientProps = {
          ...props,
          transition: referralWithAcceptOrReject
        };

        it("should render the accept and reject actions", () => {
          mountedComponent(<TransitionActions {...recipientProps} />, userRecipientState);
          expect(screen.getByText(/buttons.accept/i)).toBeInTheDocument();
          expect(screen.getByText(/buttons.reject/i)).toBeInTheDocument();
        });

        describe("when the referral is accepted", () => {
          const acceptedProps = { ...props, transition: props.transition.set("status", "accepted") };

          it("should only render the done action", () => {
            mountedComponent(<TransitionActions {...acceptedProps} />, userRecipientState);
            expect(screen.getByText(/buttons.done/i)).toBeInTheDocument();
          });
        });

        describe("when the referral is rejected", () => {
          const rejectedProps = { ...props, transition: props.transition.set("status", "rejected") };

          it("should not render actions", () => {
            mountedComponent(<TransitionActions {...rejectedProps} />, userRecipientState);
            expect(screen.queryByTestId(/long-menu/i)).toBeNull();
          });
        });
      });

      describe("when user has not access to all menus", () => {
        it("renders Menu", () => {
          mountedComponent(<TransitionActions {...props} />, {
            ...state,
            user: { permissions: { cases: [ACTIONS.READ] } }
          });
          expect(screen.queryByTestId(/long-menu/i)).toBeNull();
        });
      });
    });

    describe("with transfer transition type", () => {
      const transfer = TransitionRecord({
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
      });

      const state = {
        records: {
          cases: {
            data: [
              {
                id: "804d74bc-53b0-4b71-9a81-8ac419792f75",
                case_id_display: "804d74bc"
              }
            ]
          },
          transitions: { data: [transfer] }
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
        transition: transfer,
        showMode: true,
        recordType: "cases",
        classes: {}
      };

      describe("when user has access to all menus", () => {
        it("renders Menu", () => {
          mountedComponent(<TransitionActions {...props} />, state);
          expect(screen.getByRole("button")).toBeInTheDocument();
        });

        it("renders MenuItem", () => {
          mountedComponent(<TransitionActions {...props} />, state);
          expect(screen.getAllByTestId(/menu-item/i)).toHaveLength(1);
        });

        it("renders MenuItem with revoke option", () => {
          mountedComponent(<TransitionActions {...props} />, state);
          expect(screen.getByText(/actions.revoke/i)).toBeInTheDocument();
        });
      });

      describe("when user has not access to all menus", () => {
        it("renders Menu", () => {
          mountedComponent(<TransitionActions {...props} />, {
            ...state,
            user: { permissions: { cases: [ACTIONS.READ] } }
          });

          expect(screen.queryByTestId(/long-menu/i)).toBeNull();
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

    it("renders RevokeModal", () => {
      mountedComponent(<TransitionActions {...props} />, state);
      fireEvent.click(screen.getByRole("button"));
      fireEvent.click(screen.getByRole("menuitem"));
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
  });

  describe("Component TransferApproval", () => {
    const transfer = TransitionRecord({
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
    });

    const state = {
      records: {
        cases: {
          data: [
            {
              id: "804d74bc-53b0-4b71-9a81-8ac419792f75",
              case_id_display: "804d74bc"
            }
          ]
        },
        transitions: {
          data: [transfer]
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
      transition: transfer,
      showMode: true,
      recordType: "cases",
      classes: {}
    };

    it("renders TransferApproval", () => {
      mountedComponent(<TransitionActions {...props} />, state);
      expect(screen.getByText(/actions.revoke/i)).toBeInTheDocument();
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

    it("renders ReferralAction", () => {
      mountedComponent(<TransitionActions {...props} />, state);
      fireEvent.click(screen.getByRole("button"));
      expect(screen.getByRole("menuitem")).toBeInTheDocument();
    });
  });
});
