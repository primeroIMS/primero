<<<<<<< HEAD:app/javascript/components/transitions/referrals/summary.unit.test.js
// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { setupMountedComponent } from "../../../test";
import DateTransitionsSummary from "../components/date-transitions-summary";
=======
import { mountedComponent, screen } from "../../../test-utils";
>>>>>>> e5ec5b3b64 ([New] Added test cases for transitions referrals):app/javascript/components/transitions/referrals/summary.spec.js

import ReferralSummary from "./summary";

describe("<ReferralSummary />", () => {
  const props = {
    transition: {
      id: "4142488e-ccd9-4ac5-a3c1-c3c0fd063fc8",
      record_id: "6b0018e7-d421-4d6b-80bf-ca4cbf488907",
      record_type: "case",
      created_at: "2019-10-21T16:13:33.890Z",
      notes: "This is a note",
      status: "done",
      type: "Referral",
      consent_overridden: false,
      consent_individual_transfer: true,
      transitioned_by: "primero",
      transitioned_to: "primero_mgr_cp"
    },
    classes: {
      wrapper: "wrapperStyle",
      titleHeader: "titleHeaderStyle",
      date: "dateStyle"
    }
  };

  it("renders divs with its corresponding class", () => {
    mountedComponent(<ReferralSummary {...props} />);
    expect(screen.getByText(/transition.status.done/i)).toBeInTheDocument();
    expect(screen.getByText(/transition.type.referral/i)).toBeInTheDocument();
    expect(screen.getByTestId("date")).toBeInTheDocument();
  });
});
