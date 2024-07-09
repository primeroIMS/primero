// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { mountedComponent, screen } from "../../../../../../../../test-utils";

import SelectionColumn from "./component";

describe("<SelectionColumn />", () => {
  const props = { addField: () => {}, removeField: () => {}, field: {} };
  const initialState = fromJS({});

  it("should render the SelectionColumn with an AddIcon when is not selected", () => {
    mountedComponent(<SelectionColumn {...props} selected={false} />, initialState);

    expect(screen.getByTestId("add-button")).toBeInTheDocument();
    expect(screen.queryByTestId("remove-button")).toBeNull();
  });

  it("should render the SelectionColumn with an RemoveIcon when is selected", () => {
    mountedComponent(<SelectionColumn {...props} selected />, initialState);

    expect(screen.getByTestId("remove-button")).toBeInTheDocument();
    expect(screen.queryByTestId("add-button")).toBeNull();
  });
});
