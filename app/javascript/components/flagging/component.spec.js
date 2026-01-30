// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { mountedComponent, screen, userEvent, fireEvent } from "test-utils";
import { fromJS } from "immutable";

import { ACTIONS } from "../permissions";

import Flagging from "./component";
import { FLAG_DIALOG } from "./constants";
import { FlagRecord } from "./records";

describe("<FlagDialog /> - Component", () => {
  const props = {
    recordType: "cases",
    record: "0df32f52-4290-4ce1-b859-74ac14c081bf"
  };

  const defaultState = fromJS({
    ui: { dialogs: { dialog: FLAG_DIALOG, open: true } },
    records: {
      cases: {
        data: [
          {
            id: "0df32f52-4290-4ce1-b859-74ac14c081bf",
            age: 6,
            sex: "male",
            name: "Test case flag",
            owned_by: "primero",
            created_at: "2019-05-27T23:00:43.758Z",
            case_id_display: "040e0b7",
            registration_date: "2019-05-27"
          }
        ]
      },
      flags: {
        data: [
          FlagRecord({
            id: 1,
            record_id: "0df32f52-4290-4ce1-b859-74ac14c081bf",
            record_type: "cases",
            date: "2019-09-11",
            message: "test",
            flagged_by: "primero"
          })
        ]
      }
    }
  });

  it("renders Flagging form", () => {
    mountedComponent(<Flagging {...props} />, defaultState);

    expect(screen.getByText("buttons.flags")).toBeInTheDocument();
    expect(screen.getByText("flags.add_flag_tab")).toBeInTheDocument();
  });

  it("resets the form when switching tabs", async () => {
    mountedComponent(<Flagging {...props} />, defaultState);

    const user = userEvent.setup();

    await user.click(screen.getByText("flags.add_flag_tab"));

    const currentDate = screen.getAllByLabelText("flags.flag_date").at(1).value;

    await fireEvent.change(screen.getAllByRole("textbox").at(0), { target: { value: "Flag Reason" } });

    await fireEvent.change(screen.getAllByLabelText("flags.flag_date").at(1), { target: { value: "2021-02-10" } });

    await user.click(screen.getByText("buttons.save"));

    await user.click(screen.getByText("flags.add_flag_tab"));

    expect(screen.getAllByRole("textbox").at(0)).toHaveValue("");
    expect(screen.getAllByLabelText("flags.flag_date").at(1)).toHaveValue(currentDate);
  });

  it("renders FlagDialog", () => {
    mountedComponent(<Flagging {...props} />, defaultState);

    expect(screen.getByText("flags.title")).toBeInTheDocument();
  });

  it("does not render the UpdateFlagDialog if a user does not have permission", async () => {
    mountedComponent(<Flagging {...props} />, defaultState);

    const user = userEvent.setup();

    await user.click(screen.getByTestId("list-flags-item"));

    expect(screen.queryByText("flags.update_flag")).not.toBeInTheDocument();
  });

  it("renders the UpdateFlagDialog if a user has the FLAG_UPDATE permission", async () => {
    mountedComponent(
      <Flagging {...props} />,
      defaultState.setIn(["user", "permissions", "cases"], fromJS([ACTIONS.FLAG_UPDATE]))
    );

    const user = userEvent.setup();

    await user.click(screen.getByTestId("list-flags-item"));

    expect(screen.getByText("flags.update_flag")).toBeInTheDocument();
  });
});
