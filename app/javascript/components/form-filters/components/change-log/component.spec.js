// Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

import { mountedComponent, screen } from "test-utils";
import { fromJS } from "immutable";

import ChangeLogFilters from "./component";

describe("<ChangeLogFilters />", () => {
  const initialState = fromJS({});
  const props = {
    selectedForm: "change_logs",
    formMode: "show",
    primeroModule: "primeromodule-cp",
    recordId: "bc24180b-c19f-495c-ac96-fe1883e13aef",
    recordType: "case",
    showDrawer: true
  };

  beforeEach(() => {
    mountedComponent(<ChangeLogFilters {...props} />, initialState);
  });

  it("renders the ChangeLogFilters", () => {
    expect(screen.getByText("change_logs.filters.form")).toBeInTheDocument();
    expect(screen.getByText("change_logs.filters.field")).toBeInTheDocument();
  });
});
