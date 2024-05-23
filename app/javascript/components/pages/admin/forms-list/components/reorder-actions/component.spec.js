// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { mountedComponent, screen } from "../../../../../../test-utils";

import ReorderActions from "./component";

describe("<FormsList />/components/<ReorderActions />", () => {

  const initialState = fromJS({
    records: {
      admin: {
        forms: {
          reorderedForms: {
            loading: false,
            errors: [],
            pending: []
          }
        }
      }
    }
  });

  it("renders <Dialog/>", () => {
    mountedComponent(<ReorderActions {...{
      handleCancel: () => { },
      handleSuccess: () => { },
      open: true
    }} />, initialState)
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it("renders the dialog buttons", () => {
    mountedComponent(<ReorderActions {...{
      handleCancel: () => { },
      handleSuccess: () => { },
      open: true
    }} />, initialState)
    expect(screen.getAllByRole('button')).toHaveLength(2);
  });
});
