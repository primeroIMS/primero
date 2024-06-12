// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fireEvent, mountedFormComponent, screen } from "../../../test-utils";

import Actions from "./actions";

describe("<IndexFilters />/<Actions />", () => {
  let props;
  let state;

  beforeEach(() => {
    props = {
      handleSave: jest.fn(),
      handleClear: jest.fn()
    };

    state = {
      application: { online: true }
    };

    mountedFormComponent(<Actions {...props} />, { state, includeFormProvider: true });
  });

  it("renders 3 action buttons", () => {
    expect(screen.getAllByRole("button")).toHaveLength(3);
  });

  it("triggers handleSave()", () => {
    fireEvent.click(screen.queryByText("filters.save_filters"));

    expect(props.handleSave).toHaveBeenCalledTimes(1);
  });

  it("triggers handleClear()", () => {
    fireEvent.click(screen.queryByText("filters.clear_filters"));

    expect(props.handleClear).toHaveBeenCalledTimes(1);
  });

  it("renders 'Apply' button", () => {
    expect(screen.queryByText("filters.apply_filters")).toBeInTheDocument();
  });

  describe("when handleSave is not part of the props", () => {
    const newProps = {
      handleClear: () => {}
    };

    it("should render all actions except save buttons", () => {
      mountedFormComponent(<Actions {...newProps} />, { state, includeFormProvider: true });
      expect(screen.queryAllByRole("button").at(3)).toBeInTheDocument();
      expect(screen.queryAllByRole("button").at(4)).toBeInTheDocument();
      expect(screen.queryAllByRole("button").at(5)).toBeUndefined();
    });
  });
});
