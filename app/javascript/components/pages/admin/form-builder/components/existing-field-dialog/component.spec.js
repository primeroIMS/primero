// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { mountedComponent, screen } from "../../../../../../test-utils";

import ExistingFieldDialog from "./component";

describe("<ExistingFieldDialog />", () => {
  const props = { parentForm: "parent", primeroModule: "module-1" };
  const initialState = fromJS({
    ui: { dialogs: { dialog: "ExistingFieldDialog", open: true } },
    records: {
      admin: {
        forms: {
          selectedFields: [
            {
              id: 1,
              name: "field_1",
              display_name: { en: "Field 1" }
            },
            {
              id: 2,
              name: "field_2",
              display_name: { en: "Field 2" }
            }
          ]
        }
      }
    }
  });

  it("should render the dialog", () => {
    mountedComponent(<ExistingFieldDialog {...props} />, initialState);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
