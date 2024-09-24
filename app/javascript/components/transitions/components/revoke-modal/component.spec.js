// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { mountedComponent, screen } from "../../../../test-utils";

import RevokeModal from "./component";

describe("<RevokeModal /> - Component", () => {
  const props = {
    name: "transferModal-1",
    close: () => {},
    open: true,
    pending: false,
    recordType: "cases",
    setPending: () => {},
    transition: {
      id: "1",
      record_id: "5a291f55-c92a-4786-be2a-13b98fd143e1",
      record_type: "case",
      created_at: "2020-02-14T23:00:35.345Z",
      notes: "",
      rejected_reason: "",
      status: "in_progress",
      type: "Transfer",
      consent_overridden: true,
      consent_individual_transfer: false,
      transitioned_by: "primero_admin_cp",
      transitioned_to: "primero_cp_ar",
      service: "legal_assistance_service"
    }
  };
  const state = fromJS({});

  beforeEach(() => {
    mountedComponent(<RevokeModal {...props} />, state);
  });

  it("renders ActionDialog component", () => {
    expect(screen.getByRole("dialog")).toBeInTheDocument(1);
  });
});
