// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.
import { fromJS } from "immutable";
import { mountedComponent, screen } from "test-utils";

import DisableDialog from "./component";

describe("<DisableDialog /> components/pages/admin/users-list/components", () => {
  const props = {
    filters: fromJS({ page: 1, per: 20 }),
    selectedRecords: { 0: [0, 1] },
    setSelectedRecords: () => {},
    recordType: "users"
  };

  describe("when dialog is closed", () => {
    const initialState = fromJS({
      records: {
        users: {
          data: [
            {
              id: "1",
              user_name: "Jose"
            },
            {
              id: "2",
              user_name: "Carlos"
            }
          ],
          metadata: { total: 2, per: 20, page: 1 }
        }
      },
      ui: {
        dialogs: {
          DisableDialog: {
            open: false
          }
        }
      }
    });

    beforeEach(() => {
      mountedComponent(<DisableDialog {...props} />, initialState);
    });

    it("does not render dialog when closed", () => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  describe("component rendering", () => {
    const initialState = fromJS({
      records: {
        users: {
          data: [
            {
              id: "1",
              user_name: "john"
            },
            {
              id: "2",
              user_name: "joe"
            }
          ],
          metadata: { total: 2, per: 20, page: 1 }
        }
      },
      ui: {
        dialogs: {
          dialog: "DisableDialog",
          open: true
        }
      }
    });

    beforeEach(() => {
      mountedComponent(<DisableDialog {...props} />, initialState);
    });

    it("renders DisableDialog component without errors", () => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("renders with correct props", () => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("renders selection indicator when dialog is closed", () => {
      expect(screen.getByTestId("selection-indicator")).toBeInTheDocument();
    });

    it("renders action text when dialog is closed", () => {
      expect(screen.getByTestId("action-text")).toBeInTheDocument();
    });
  });
});
