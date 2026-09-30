import { fromJS } from "immutable";

import { mountedComponent, screen } from "../../../test-utils";
import { MODULES } from "../../../config";

import mockUsers from "./mocked-users";
import Transitions from "./component";

describe("<Transitions />", () => {
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
    consent_for_services: true,
    disclosure_other_orgs: true
  });

  describe("when transitionType is 'referral'", () => {
    const referralProps = {
      record,
      recordType: "cases",
      userPermissions: fromJS({ cases: ["manage"] }),
      currentDialog: "referral",
      open: true,
      close: () => {},
      pending: false,
      setPending: () => {}
    };

    it("renders TransitionDialog", () => {
      mountedComponent(<Transitions {...referralProps} />, initialState);
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("renders ReferralForm", () => {
      mountedComponent(<Transitions {...referralProps} />, initialState);
      expect(screen.getByText(/forms.record_types.case/)).toBeInTheDocument();
    });
  });

  describe("when transitionType is 'reassign'", () => {
    const reassignProps = {
      record,
      recordType: "cases",
      userPermissions: fromJS({ cases: ["manage"] }),
      currentDialog: "assign",
      open: true,
      close: () => {},
      pending: false,
      setPending: () => {}
    };

    it("renders TransitionDialog", () => {
      mountedComponent(<Transitions {...reassignProps} />, initialState);
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("renders ReassignForm", () => {
      mountedComponent(<Transitions {...reassignProps} />, initialState);
      expect(screen.getByText((content, element) => element.tagName.toLowerCase() === "form")).toBeInTheDocument();
    });

    describe("when assigning from the record list", () => {
      const listState = initialState.setIn(
        ["records", "cases"],
        fromJS({ data: [{ id: "abc123" }, { id: "def456" }], metadata: { total: 10 } })
      );
      const listProps = { ...reassignProps, record: undefined, currentPage: 0, selectedRecords: { 0: [0, 1] } };

      it("does not show the pending transition message when no selected record is pending", () => {
        mountedComponent(<Transitions {...listProps} />, listState);

        expect(screen.queryByText("case.messages.pending_transition_excluded")).not.toBeInTheDocument();
        expect(screen.getByText("buttons.save").closest("button")).not.toBeDisabled();
      });

      it("shows the pending transition message when some selected records are pending", () => {
        mountedComponent(<Transitions {...listProps} pendingTransitionIds={["abc123"]} />, listState);

        expect(screen.getByText("case.messages.pending_transition_excluded")).toBeInTheDocument();
        expect(screen.getByText("buttons.save").closest("button")).not.toBeDisabled();
      });

      it("disables the save button when all the selected records are pending", () => {
        mountedComponent(<Transitions {...listProps} pendingTransitionIds={["abc123", "def456"]} />, listState);

        expect(screen.getByText("buttons.save").closest("button")).toBeDisabled();
      });
    });
  });

  describe("when transitionType is 'transfer'", () => {
    const transferProps = {
      record,
      recordType: "cases",
      userPermissions: fromJS({ cases: ["manage"] }),
      currentDialog: "transfer",
      open: true,
      close: () => {},
      pending: false,
      isBulkTransfer: false,
      setPending: () => {}
    };

    it("renders TransitionDialog", () => {
      mountedComponent(<Transitions {...transferProps} />, initialState);
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("renders TransferForm", () => {
      mountedComponent(<Transitions {...transferProps} />, initialState);
      expect(screen.getByText((content, element) => element.tagName.toLowerCase() === "form")).toBeInTheDocument();
    });

    it("enables the transfer button when the current user has no pending transfer", () => {
      const state = initialState.set("user", fromJS({ username: "user_1" }));

      mountedComponent(<Transitions {...transferProps} />, state);

      expect(screen.getByRole("button", { name: /buttons.transfer/ })).not.toBeDisabled();
      expect(screen.queryByText("transfer.pending_transfer_received")).toBeNull();
    });

    describe("when the current user has a pending transfer for the record", () => {
      const state = initialState.set("user", fromJS({ username: "user_1" }));
      const props = { ...transferProps, record: record.set("transferred_to_users", fromJS(["user_1"])) };

      it("disables the transfer button", () => {
        mountedComponent(<Transitions {...props} />, state);

        expect(screen.getByRole("button", { name: /buttons.transfer/ })).toBeDisabled();
      });

      it("renders the pending transfer message", () => {
        mountedComponent(<Transitions {...props} />, state);

        expect(screen.getByText("transfer.pending_transfer_received")).toBeInTheDocument();
      });
    });
  });
});
