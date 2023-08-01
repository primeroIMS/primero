// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { mountedComponent, screen } from "../../../../test-utils";
import { DONE } from "../constants";

import ReferralAction from "./component";

describe("<ReferralAction /> - Component", () => {
  const initialState = fromJS({});

  const props = {
    openReferralDialog: true,
    close: () => {},
    recordType: "cases",
    recordId: "10",
    transistionId: "20",
    referralType: DONE
  };

  it("renders ReferralAction component", () => {
    mountedComponent(<ReferralAction {...props} />, initialState);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("renders a text field for note_on_referral_from_provider ", () => {
    mountedComponent(<ReferralAction {...props} />, initialState);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  describe("with rejected status", () => {
    const rejectedProps = { ...props, openReferralDialog: true, referralType: "rejected" };

    it("should render the rejected reason text field", () => {
      mountedComponent(<ReferralAction {...rejectedProps} />, initialState);
      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });
  });
});
