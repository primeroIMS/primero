import { fromJS } from "immutable";

import { mountedComponent, screen, waitFor, userEvent } from "../../../../test-utils";
import { TRANSITION_STATUS } from "../../constants";

import RevokeModal from "./component";

describe("<RevokeModal /> - Component", () => {
  const baseProps = {
    name: "transferModal-1",
    close: () => {},
    open: true,
    pending: false,
    recordType: "cases",
    setPending: () => {}
  };

  const baseState = fromJS({});

  const transfer = {
    id: "1",
    record_id: "5a291f55-c92a-4786-be2a-13b98fd143e1",
    record_type: "case",
    created_at: "2020-02-14T23:00:35.345Z",
    notes: "",
    rejected_reason: "",
    status: TRANSITION_STATUS.inProgress,
    type: "Transfer",
    consent_overridden: true,
    consent_individual_transfer: false,
    transitioned_by: "primero_admin_cp",
    transitioned_to: "primero_cp_ar",
    service: "legal_assistance_service"
  };

  const referral = {
    id: "2",
    record_id: "5a291f55-c92a-4786-be2a-13b98fd143e1",
    record_type: "case",
    created_at: "2020-02-14T23:00:35.345Z",
    notes: "",
    rejected_reason: "",
    status: TRANSITION_STATUS.inProgress,
    type: "Referral",
    consent_overridden: true,
    consent_individual_transfer: false,
    transitioned_by: "primero_admin_cp",
    transitioned_to: "primero_cp_ar",
    service: "legal_assistance_service"
  };

  describe("with transfer transition type", () => {
    const props = {
      ...baseProps,
      serviceRecordId: undefined,
      transition: transfer
    };

    beforeEach(() => {
      mountedComponent(<RevokeModal {...props} />, baseState);
    });

    it("renders ActionDialog component", () => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("renders the revoke message for transfer", () => {
      expect(screen.getByText(/cases.revoke_message/i)).toBeInTheDocument();
    });

    it("does not render referral form fields", () => {
      expect(screen.queryByRole("textbox", { name: /referral.notes_on_referral/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("combobox", { name: /referral.success_status/i })).not.toBeInTheDocument();
    });

    it("has the correct confirm button label", () => {
      expect(screen.getByRole("button", { name: /actions.revoke/i })).toBeInTheDocument();
    });
  });

  describe("with referral transition type", () => {
    const props = {
      ...baseProps,
      transition: referral
    };

    beforeEach(() => {
      mountedComponent(<RevokeModal {...props} />, baseState);
    });

    it("renders ActionDialog component", () => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("renders the revoke message for referral", () => {
      expect(screen.getByText(/cases.revoke_message/i)).toBeInTheDocument();
    });

    it("renders notes_on_referral text field", () => {
      expect(screen.getByRole("textbox", { name: /referral.notes_on_referral/i })).toBeInTheDocument();
    });

    it("renders success_status select field", () => {
      expect(screen.getByRole("combobox", { name: /referral.success_status/i })).toBeInTheDocument();
    });

    it("does not render service_implemented select field", () => {
      expect(screen.queryByRole("combobox", { name: /referral.service_implemented/i })).not.toBeInTheDocument();
    });

    describe("when success_status is not_successful", () => {
      it("renders reason_not_successful select field", async () => {
        const select = screen.getByRole("combobox", { name: /referral.success_status/i });

        await userEvent.click(select);
        await userEvent.click(await screen.findByText(/referral.success_status_options.not_successful/i));

        await waitFor(() => {
          expect(screen.getByRole("combobox", { name: /referral.reason_not_successful/i })).toBeInTheDocument();
        });
      });
    });

    describe("when serviceRecordId is provided", () => {
      const propsWithServiceRecord = {
        ...baseProps,
        serviceRecordId: "service-123",
        transition: referral
      };

      it("renders service_implemented select field", () => {
        mountedComponent(<RevokeModal {...propsWithServiceRecord} />, baseState);
        expect(screen.getByRole("combobox", { name: /referral.service_implemented/i })).toBeInTheDocument();
      });
    });
  });
});
