import { fromJS } from "immutable";

import { mountedComponent, screen, fireEvent } from "../../../test-utils";

import MarkForOffline from "./component";

describe("<MarkForOffline />", () => {
  const props = {
    close: () => {},
    open: true,
    currentPage: 0,
    selectedRecords: { 0: [0, 1] },
    clearSelectedRecords: () => {},
    recordType: "cases"
  };

  const initialState = fromJS({ records: { cases: { data: [{ id: "abc123" }, { id: "def456" }] } } });

  const markedIds = componentProps => {
    const { store } = mountedComponent(<MarkForOffline {...componentProps} />, initialState);

    fireEvent.click(screen.getByText("cases.ok"));

    return store.getActions().find(current => current.type === "cases/MARK_FOR_OFFLINE").api.params.id;
  };

  it("marks all the selected records for offline", () => {
    expect(markedIds(props)).toEqual(["abc123", "def456"]);
  });

  describe("when some selected records have a pending transition", () => {
    const pendingProps = { ...props, pendingTransitionIds: ["abc123"] };

    it("shows the pending transition message", () => {
      mountedComponent(<MarkForOffline {...pendingProps} />, initialState);

      expect(screen.getByText("case.messages.pending_transition_excluded")).toBeInTheDocument();
    });

    it("excludes the pending records", () => {
      expect(markedIds(pendingProps)).toEqual(["def456"]);
    });
  });

  describe("when all the selected records have a pending transition", () => {
    it("disables the confirm button", () => {
      mountedComponent(<MarkForOffline {...props} pendingTransitionIds={["abc123", "def456"]} />, initialState);

      expect(screen.getByText("cases.ok").closest("button")).toBeDisabled();
    });
  });
});
