import { mountedComponent, screen, fireEvent } from "test-utils";
import { fromJS } from "immutable";

import { FormSectionRecord } from "../record-form/records";
import { MODULES } from "../../config";

import RecordFormAlerts from "./component";

describe("<RecordFormAlerts />", () => {
  const initialState = fromJS({
    records: {
      cases: {
        recordAlerts: [
          {
            alert_for: "field_change",
            type: "closure",
            date: "2020-06-19",
            form_unique_id: "form_1"
          }
        ]
      }
    },
    forms: {
      validationErrors: [
        {
          unique_id: "form_1",
          form_group_id: "group_1",
          errors: {
            field_1: "field_1 is required",
            tally_2: {
              boys: "Boys is required"
            }
          }
        }
      ]
    }
  });

  it("renders the RecordFormAlerts", () => {
    const props = {
      recordType: "cases",
      form: FormSectionRecord({ unique_id: "form_1", name: { en: "Form 1" } })
    };

    mountedComponent(<RecordFormAlerts {...props} />, initialState);
    expect(document.querySelector("#record-form-alerts-panel-header")).toBeInTheDocument();
  });

  it("first renders errors and then form alerts", () => {
    const props = {
      recordType: "cases",
      form: FormSectionRecord({ unique_id: "form_1", name: { en: "Form 1" } })
    };

    mountedComponent(<RecordFormAlerts {...props} />, initialState);
    expect(screen.getByText("error_message.address_form_fields")).toBeInTheDocument();
  });
  describe("when the current user has a pending referral", () => {
    const stateWithPendingReferral = fromJS({
      user: { username: "user_1" },
      application: {
        modules: [{ unique_id: MODULES.CP, options: { pending_transition_to_form: { referral: "basic_identity" } } }]
      },
      records: { cases: { recordAlerts: [] } }
    });
    const record = fromJS({ id: "case_1", module_id: MODULES.CP, referred_users_pending: ["user_1"] });
    const props = {
      recordType: "cases",
      form: FormSectionRecord({ unique_id: "basic_identity", name: { en: "Basic Identity" } }),
      formMode: { isShow: true },
      record,
      primeroModule: MODULES.CP
    };

    it("renders the pending referral alert on the configured form", () => {
      mountedComponent(<RecordFormAlerts {...props} />, stateWithPendingReferral);

      expect(screen.getByText(/case.messages.case_referral_pending/)).toBeInTheDocument();
      expect(screen.getByText("case.messages.pending_transition_link")).toBeInTheDocument();
    });

    it("navigates to the referral form when the link is clicked", () => {
      const { store } = mountedComponent(<RecordFormAlerts {...props} />, stateWithPendingReferral);

      fireEvent.click(screen.getByText("case.messages.pending_transition_link"));

      expect(store.getActions()).toEqual(
        expect.arrayContaining([{ type: "forms/SET_SELECTED_FORM", payload: "referral" }])
      );
    });

    it("does not render the alert when no record is given", () => {
      mountedComponent(<RecordFormAlerts {...props} record={undefined} />, stateWithPendingReferral);

      expect(screen.queryByText(/case.messages.case_referral_pending/)).not.toBeInTheDocument();
    });

    it("does not render the alert on other forms", () => {
      mountedComponent(
        <RecordFormAlerts {...props} form={FormSectionRecord({ unique_id: "other_form", name: { en: "Other" } })} />,
        stateWithPendingReferral
      );

      expect(screen.queryByText(/case.messages.case_referral_pending/)).not.toBeInTheDocument();
    });
  });
});
