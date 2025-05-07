// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { mountedComponent, userEvent, screen } from "test-utils";

import { ACCEPTED, REJECTED } from "../../config";
import { ACTIONS } from "../permissions";
import { lookups } from "../../test-utils";

import ActivityLog from "./component";

describe("<ActivityLog", () => {
  const initialState = {
    records: {
      activity_logs: {
        data: [
          {
            type: "transfer",
            record_type: "Child",
            record_id: "0001",
            display_id: "01",
            record_access_denied: false,
            data: {
              status: { to: ACCEPTED },
              owned_by: { from: "user_a", to: "user_b" }
            }
          },
          {
            type: "transfer",
            record_type: "Child",
            record_id: "0002",
            display_id: "02",
            record_access_denied: true,
            data: {
              status: { to: REJECTED },
              owned_by: { from: "user_a", to: "user_b" }
            }
          }
        ],
        metadata: { total: 2 },
        loading: false,
        errors: false
      }
    },
    forms: {
      options: {
        lookups: lookups()
      }
    },
    user: {
      permissions: {
        activity_log: [ACTIONS.MANAGE]
      }
    }
  };

  beforeEach(() => {
    jest.spyOn(window.I18n, "t").mockReturnValue("of");
  });

  describe("when record access is not denied", () => {
    it("redirects to the clicked record", async () => {
      const user = userEvent.setup();
      const { history } = mountedComponent(<ActivityLog />, initialState);

      await user.click(screen.getAllByText("data")[0]);
      expect(history.location.pathname).toBe("/cases/0001");
    });
  });

  describe("when record access is denied", () => {
    it("does not redirect to the clicked record", async () => {
      const user = userEvent.setup();
      const { history } = mountedComponent(<ActivityLog />, initialState);

      await user.click(screen.getAllByText("data")[1]);
      expect(history.location.pathname).toBe("/");
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});
