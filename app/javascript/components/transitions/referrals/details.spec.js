import { fromJS } from "immutable";

import { mountedComponent, screen } from "../../../test-utils";

import ReferralDetail from "./details";

describe("<ReferralDetail />", () => {
  // TODO: fromJS() must be used in here once options been used with Immutable
  const initialState = fromJS({
    forms: {
      options: {
        lookups: [
          {
            id: 1,
            unique_id: "lookup-service-type",
            values: [{ id: "health", display_text: { en: "Health", es: "Salud" } }]
          }
        ]
      }
    }
  });
  const props = {
    transition: {
      id: "4142488e-ccd9-4ac5-a3c1-c3c0fd063fc8",
      record_id: "6b0018e7-d421-4d6b-80bf-ca4cbf488907",
      record_type: "case",
      created_at: "2019-10-21T16:13:33.890Z",
      notes: "This is a note for Referral",
      status: "done",
      type: "Referral",
      consent_overridden: false,
      consent_individual_transfer: true,
      transitioned_by: "primero",
      transitioned_to: "primero_mgr_cp"
    },
    classes: {
      spaceGrid: "testStyle",
      transtionLabel: "testStyle",
      transtionValue: "testStyle"
    }
  };

  it("renders 2 <DisplayData />", () => {
    mountedComponent(<ReferralDetail {...props} />, initialState);
    expect(screen.getAllByTestId("display-data")).toHaveLength(6);
  });

  it("renders a <Divider />", () => {
    mountedComponent(<ReferralDetail {...props} />, initialState);
    expect(screen.getAllByTestId("divider")).toHaveLength(1);
  });

  describe("with status", () => {
    describe("when is rejected", () => {
      const rejectedProps = { ...props, ...{ transition: { ...props.transition, status: "rejected" } } };

      it("should render rejected reason", () => {
        mountedComponent(<ReferralDetail {...rejectedProps} />, initialState);
        expect(screen.getAllByTestId("display-data")).toHaveLength(7);
      });
    });
    describe("when is pending, done, in_progress, accepted", () => {
      it("should render rejected reason", () => {
        mountedComponent(<ReferralDetail {...props} />, initialState);
        expect(screen.getAllByTestId("display-data")).toHaveLength(6);
      });
    });
  });

  describe("when rejection_note is set", () => {
    it("should render the rejection_note", () => {
      const notesFromProvider = "Some notes";
      const noteProps = {
        ...props,
        ...{
          transition: {
            transitioned_to: "to_some_user",
            transitioned_by: "by_some_user",
            rejection_note: notesFromProvider
          }
        }
      };

      mountedComponent(<ReferralDetail {...noteProps} />, initialState);
      expect(screen.getByText(/referral.note_on_referral_from_provider/i)).toBeInTheDocument();
    });
  });

  describe("with responded at", () => {
    it("should render responded_at", () => {
      const respondedProps = {
        ...props,
        ...{ transition: { ...props.transition, responded_at: "2020-04-150T14:04" } }
      };

      mountedComponent(<ReferralDetail {...respondedProps} />, initialState);
      expect(screen.getByText(/transition.responded_at/i)).toBeInTheDocument();
    });

    it("should render DateTransitions component", () => {
      mountedComponent(<ReferralDetail {...props} />, initialState);
      expect(screen.getAllByTestId("display-data")).toHaveLength(6);
    });
  });
});
