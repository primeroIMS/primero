import { fromJS } from "immutable";
import { mountedComponent, screen } from "test-utils";

import SendEmailDialog from "./component";

describe("<SendEmailDialog /> components/pages/admin/users-list/components", () => {
  const props = {
    filters: fromJS({ page: 1, per: 20 }),
    selectedRecords: { 0: [0, 1] },
    setSelectedRecords: () => {},
    recordType: "users"
  };

  const records = {
    users: {
      data: [
        {
          id: "1",
          user_name: "John"
        },
        {
          id: "2",
          user_name: "Charles"
        }
      ],
      metadata: { total: 2, per: 20, page: 1 }
    }
  };

  describe("when dialog is closed", () => {
    const initialState = fromJS({
      records,
      ui: {
        dialogs: {
          SendEmailDialog: {
            open: false
          }
        }
      }
    });

    beforeEach(() => {
      mountedComponent(<SendEmailDialog {...props} />, initialState);
    });

    it("does not render dialog when closed", () => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  describe("component rendering", () => {
    const initialState = fromJS({
      records,
      ui: {
        dialogs: {
          dialog: "SendEmailDialog",
          open: true
        }
      }
    });

    beforeEach(() => {
      mountedComponent(<SendEmailDialog {...props} />, initialState);
    });

    it("renders SendEmailDialog component without errors", () => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("renders the dialog title", () => {
      expect(screen.getAllByText("users.send_email_title")).toBeTruthy();
    });

    it("renders the selection indicator subheader", () => {
      expect(screen.getByText("users.send_email_selected")).toBeInTheDocument();
    });

    it("renders the subject and message fields", () => {
      expect(screen.getAllByText("users.send_email_subject_label").length).toBeGreaterThan(0);
      expect(screen.getAllByText("users.send_email_text_label").length).toBeGreaterThan(0);
    });

    it("renders the send button", () => {
      expect(screen.getByText("buttons.send")).toBeInTheDocument();
    });
  });
});
