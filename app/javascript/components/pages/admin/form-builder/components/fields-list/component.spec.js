// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { mountedFormComponent, screen } from "../../../../../../test-utils";

import FieldsList from "./component";

describe("<FieldsList />", () => {
  const state = fromJS({
    records: {
      admin: {
        forms: {
          selectedFields: [
            { name: "field_1", display_name: { en: "Field 1" }, editable: false },
            { name: "field_2", display_name: { en: "Field 2" }, editable: true }
          ]
        }
      }
    }
  });

  beforeEach(() => {
    mountedFormComponent(<FieldsList />, { props: { formContextFields: {} }, state });
  });

  it("should render the list items", () => {
    expect(screen.getByText("Field 1")).toBeInTheDocument();
    expect(screen.getByText("Field 2")).toBeInTheDocument();
  });
});
