import { expect } from "chai";
import { Box, Divider } from "@material-ui/core";
import { fromJS } from "immutable";

import TransitionUser from "../TransitionUser";
import { setupMountedComponent } from "../../../test";

import ReferralDetail from "./details";

describe("<ReferralDetail />", () => {
  let component;
  // TODO: fromJS() must be used in here once options been used with Immutable
  const initialState = fromJS({
    forms: {
      options: [
        {
          type: "lookup-service-type",
          options: [{ id: "health", display_text: "Health" }]
        }
      ]
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
    ({ component } = setupMountedComponent(
      ReferralDetail,
      props,
      initialState
    ));
  });

  it("renders 2 <TransitionUser />", () => {
    expect(component.find(TransitionUser)).to.have.lengthOf(2);
  });

  it("renders 5 <Box />", () => {
    expect(component.find(Box)).to.have.lengthOf(3);
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
            ...{ transition: { status: "rejected" } }
          },
          initialState
        ));
      });
      it("should render rejected reason", () => {
        expect(component.find(ReferralDetail).find(Box)).to.have.lengthOf(3);
      });
    });

    describe("when is pending, done, in_progress, accepted", () => {
      it("should render rejected reason", () => {
        expect(component.find(ReferralDetail).find(Box)).to.have.lengthOf(3);
      });
    });
  });
});
