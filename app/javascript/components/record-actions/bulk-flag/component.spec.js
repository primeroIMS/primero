import { fromJS } from "immutable";
import { mountedComponent, screen, userEvent } from "test-utils";

import BulkFlag from "./component";

describe("<BulkFlag />", () => {
  const props = {
    close: () => {},
    open: true,
    currentPage: 0,
    selectedRecords: { 0: [0, 1] },
    clearSelectedRecords: () => {},
    recordType: "cases"
  };

  const initialState = fromJS({
    records: {
      cases: {
        data: [{ id: "abc123" }, { id: "def456" }],
        metadata: { total: 10 }
      }
    }
  });

  describe("when rendering the dialog", () => {
    beforeEach(() => {
      mountedComponent(<BulkFlag {...props} />, initialState);
    });

    it("renders the dialog with the correct title", () => {
      expect(screen.getByText("flags.bulk_flag_title")).toBeInTheDocument();
    });

    it("renders the selected count subheader", () => {
      expect(screen.getByText(/flags.bulk_selected/)).toBeInTheDocument();
    });

    it("renders the Flag Reason field", () => {
      expect(screen.getAllByText("flags.flag_reason").length).toBeGreaterThan(0);
    });

    it("renders the Flag Date field", () => {
      expect(screen.getAllByText("flags.flag_date").length).toBeGreaterThan(0);
    });

    it("does not render the pending transition message", () => {
      expect(screen.queryByText("case.messages.pending_transition_excluded")).not.toBeInTheDocument();
    });
  });

  describe("when some selected records have a pending transition", () => {
    const pendingProps = { ...props, pendingTransitionIds: ["abc123"] };

    it("shows the pending transition message", () => {
      mountedComponent(<BulkFlag {...pendingProps} />, initialState);

      expect(screen.getByText("case.messages.pending_transition_excluded")).toBeInTheDocument();
    });

    it("excludes the pending records from the flagged ids", async () => {
      const user = userEvent.setup();
      const { store } = mountedComponent(<BulkFlag {...pendingProps} />, initialState);

      await user.type(screen.getByRole("textbox", { name: /flags.flag_reason/ }), "A reason");
      await user.click(screen.getByText("buttons.flag_records"));

      const action = store.getActions().find(current => current.type === "flags/BULK_FLAG");

      expect(action.api.body.data.filters).toEqual({ id: ["def456"] });
    });
  });

  describe("when all the selected records have a pending transition", () => {
    it("disables the confirm button", () => {
      mountedComponent(<BulkFlag {...props} pendingTransitionIds={["abc123", "def456"]} />, initialState);

      expect(screen.getByText("buttons.flag_records").closest("button")).toBeDisabled();
    });
  });
});
