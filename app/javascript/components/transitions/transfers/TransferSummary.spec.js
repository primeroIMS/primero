// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.
import { mountedComponent, screen } from "../../../test-utils";

import TransferSummary from "./TransferSummary";

describe("<TransferSummary />", () => {
  const props = {
    transition: {
      id: "4142488e-ccd9-4ac5-a3c1-c3c0fd063fc8",
      record_id: "6b0018e7-d421-4d6b-80bf-ca4cbf488907",
      record_type: "case",
      created_at: new Date("2019-10-21T16:13:33.890Z"),
      notes: "This is a note for Transfer",
      status: "done",
      type: "Transfer",
      consent_overridden: false,
      consent_individual_transfer: true,
      transitioned_by: "primero",
      transitioned_to: "primero_mgr_cp"
    },
    classes: {
      wrapper: "wrapperStyle",
      titleHeader: "titleHeaderStyle",
      date: "dateStyle"
    },
    currentUser: "primero"
  };

  it("renders divs with it correponds class", () => {
    mountedComponent(<TransferSummary {...props} />);
    expect(screen.getByText(/transition.status.done/i)).toBeInTheDocument();
    expect(screen.getByText(/transition.type.transfer/i)).toBeInTheDocument();
    expect(screen.queryByTestId("date")).toBeNull();
  });
});
