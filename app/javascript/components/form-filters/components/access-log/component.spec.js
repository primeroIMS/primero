// Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

import { mountedComponent, screen } from "test-utils";
import { fromJS } from "immutable";

import AccessLogFilters from "./component";

describe("<AccessLogFilters />", () => {
  const initialState = fromJS({});
  const props = {
    selectedForm: "access_logs",
    formMode: "show",
    primeroModule: "primeromodule-cp",
    recordId: "bc24180b-c19f-495c-ac96-fe1883e13aef",
    recordType: "case",
    showDrawer: true
  };

  beforeEach(() => {
    mountedComponent(<AccessLogFilters {...props} />, initialState);
  });

  it("renders the AccessLogFilters", () => {
    expect(screen.getByText("access_log.filters.actions")).toBeInTheDocument();
    expect(screen.getByText("access_log.filters.timestamp")).toBeInTheDocument();
  });
});
