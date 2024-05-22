// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { mountedComponent, screen } from "test-utils";

import SummaryFields from "./component";

describe("<SummaryFields />", () => {
  const values = {
    age: 10,
    case_id_display: "1234abcd",
    id: "1234567",
    name: "Test user",
    owned_by: "aa",
    owned_by_agency_id: "aa",
    sex: "aa",
    incident_date: "2022-05-02",
    incident_location: "IQG08Q02N02",
    incident_total_tally: {
      boys: 1,
      total: 2,
      unknown: 1
    },
    killing: []
  };
  const props = {
    recordType: "incident",
    recordID: "1234abcd",
    mode: { isNew: false, isEdit: false, isShow: true }
  };

  beforeEach(() => {
    mountedComponent(<SummaryFields {...props} />, {}, {}, [], { values });
  });

  it("should render custom title", () => {
    expect(screen.getByText("incidents.summary_mrm.fields.summary_of_incident.label")).toBeInTheDocument();
  });
});
