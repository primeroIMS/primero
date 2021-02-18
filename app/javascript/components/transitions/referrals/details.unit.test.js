import { Box, Divider, Grid } from "@material-ui/core";
import { fromJS } from "immutable";

import TransitionUser from "../TransitionUser";
import { setupMountedComponent } from "../../../test";

import ReferralDetail from "./details";

describe("<ReferralDetail />", () => {
  let component;
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

  beforeEach(() => {
    ({ component } = setupMountedComponent(ReferralDetail, props, initialState));
  });

  it("renders 2 <TransitionUser />", () => {
    expect(component.find(TransitionUser)).to.have.lengthOf(2);
  });

  it("renders 5 <Box />", () => {
    expect(component.find(Box)).to.have.lengthOf(5);
  });

  it("renders a <Divider />", () => {
    expect(component.find(Divider)).to.have.lengthOf(1);
  });

  describe("with status", () => {
    describe("when is rejected", () => {
      beforeEach(() => {
        ({ component } = setupMountedComponent(
          ReferralDetail,
          {
            ...props,
            ...{ transition: { ...props.transition, status: "rejected" } }
          },
          initialState
        ));
      });
      it("should render rejected reason", () => {
        expect(component.find(ReferralDetail).find(Box)).to.have.lengthOf(6);
      });
    });
    describe("when is pending, done, in_progress, accepted", () => {
      it("should render rejected reason", () => {
        expect(component.find(ReferralDetail).find(Box)).to.have.lengthOf(5);
      });
    });
  });

  context("when rejection_note is set", () => {
    it("should render the rejection_note", () => {
      const notesFromProvider = "Some notes";
      const { component: compWithNoteFromProvider } = setupMountedComponent(
        ReferralDetail,
        {
          ...props,
          ...{
            transition: {
              transitioned_to: "to_some_user",
              transitioned_by: "by_some_user",
              rejection_note: notesFromProvider
            }
          }
        },
        initialState
      );

      expect(
        compWithNoteFromProvider
          .find(Box)
          .last()
          .find("div div")
          .map(elem => elem.text())
      ).to.deep.equal(["referral.note_on_referral_from_provider", notesFromProvider]);
    });
  });

  describe("with responded at", () => {
    beforeEach(() => {
      ({ component } = setupMountedComponent(
        ReferralDetail,
        {
          ...props,
          ...{ transition: { ...props.transition, responded_at: "2020-04-150T14:04" } }
        },
        initialState
      ));
    });

    it("should render responded_at", () => {
      expect(component.find(ReferralDetail).find(Grid).find(Grid).at(6).text()).to.equal("transition.responded_at");
    });
  });
});
