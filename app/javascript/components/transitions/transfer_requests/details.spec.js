// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { mountedComponent, screen } from "../../../test-utils";

import ReferralDetail from "./details";

describe("<ReferralDetail />", () => {
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

  it("renders 2 <DisplayData />", () => {
    mountedComponent(<ReferralDetail {...props} />, initialState);
    expect(screen.getAllByTestId("display-data")).toHaveLength(3);
  });

  it("renders a <Divider />", () => {
    mountedComponent(<ReferralDetail {...props} />, initialState);
    expect(screen.getAllByTestId("divider")).toHaveLength(1);
  });

  describe("with status", () => {
    const rejectedProps = {
      ...props,
      ...{ transition: { status: "rejected" } }
    };

    describe("when is rejected", () => {
      it("should render rejected reason", () => {
        mountedComponent(<ReferralDetail {...rejectedProps} />, initialState);
        expect(screen.getAllByTestId("display-data")).toHaveLength(3);
      });
    });

    describe("when is pending, done, in_progress, accepted", () => {
      it("should render rejected reason", () => {
        mountedComponent(<ReferralDetail {...rejectedProps} />, initialState);
        expect(screen.getAllByTestId("display-data")).toHaveLength(3);
      });
    });
  });
});
