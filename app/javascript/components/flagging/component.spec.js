// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { mountedComponent, screen } from "test-utils";
import { fromJS } from "immutable";

import Flagging from "./component";
import { FLAG_DIALOG } from "./constants";

describe("<FlagDialog /> - Component", () => {
  const props = {
    recordType: "cases",
    record: "0df32f52-4290-4ce1-b859-74ac14c081bf"
  };

  beforeEach(() => {
    mountedComponent(
      <Flagging {...props} />,
      fromJS({
        ui: { dialogs: { dialog: FLAG_DIALOG, open: true } },
        records: {
          cases: {
            data: {
              0: {
                id: "0df32f52-4290-4ce1-b859-74ac14c081bf",
                age: 6,
                sex: "male",
                name: "Test case flag",
                owned_by: "primero",
                created_at: "2019-05-27T23:00:43.758Z",
                case_id_display: "040e0b7",
                registration_date: "2019-05-27"
              }
            }
          },
          flags: {
            data: [
              {
                id: 1,
                record_id: "0df32f52-4290-4ce1-b859-74ac14c081bf",
                record_type: "cases",
                date: "2019-09-11",
                message: "test",
                flagged_by: "primero"
              }
            ]
          }
        }
      })
    );
  });

  it("renders Flagging form", () => {
    expect(screen.getByText("buttons.flags")).toBeInTheDocument();
    expect(screen.getByText("flags.add_flag_tab")).toBeInTheDocument();
    expect(document.querySelector("#FlagForm")).toBeInTheDocument();
  });

  it("renders FlagDialog", () => {
    expect(screen.getByText("flags.title")).toBeInTheDocument();
  });
});
