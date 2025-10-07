// Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

import { mountedComponent, screen } from "test-utils";
import { fromJS } from "immutable";

import FormFilters from "./component";

describe("<FormFilters />", () => {
  const initialState = fromJS({});
  const props = {
    formMode: "show",
    primeroModule: "primeromodule-cp",
    recordId: "bc24180b-c19f-495c-ac96-fe1883e13aef",
    recordType: "case",
    selectedForm: "change_logs",
    showDrawer: true
  };

  beforeEach(() => {
    mountedComponent(<FormFilters {...props} />, initialState);
  });

  it("renders the FormFilters", () => {
    expect(screen.getByText("filters.apply_filters")).toBeInTheDocument();
    expect(screen.getByText("filters.clear_filters")).toBeInTheDocument();
  });
});
