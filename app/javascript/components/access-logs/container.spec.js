// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { mountedComponent, screen } from "test-utils";
import { fromJS } from "immutable";

import { AccessLogsRecord } from "./records";
import AccessLogs from "./container";

describe("AccessLogs - Container", () => {
  const props = {
    handleToggleNav: () => {},
    mobileDisplay: false,
    recordID: "38c82975-99aa-4798-9c3d-dabea104d992",
    recordType: "cases",
    fetchable: true
  };
  const defaultState = fromJS({
    records: {
      accessLogs: {
        data: [
          AccessLogsRecord({
            record_id: "38c82975-99aa-4798-9c3d-dabea104d992",
            record_type: "cases",
            timestamp: "2020-08-11T10:27:33Z",
            user_name: "primero",
            full_name: "SuperUser",
            action: "update",
            role_name: "My Role"
          }),
          AccessLogsRecord({
            record_id: "38c82975-99aa-4798-9c3d-dabea104d992",
            record_type: "cases",
            timestamp: "2020-08-10T18:27:33Z",
            user_name: "primero",
            full_name: "SuperUser",
            action: "show",
            role_name: "My Role"
          })
        ]
      }
    }
  });

  beforeEach(() => {
    mountedComponent(<AccessLogs {...props} />, defaultState);
  });

  it("renders AccessLogs", () => {
    expect(screen.getAllByTestId("access-logs")).toHaveLength(1);
  });

  it("renders AccessLogs", () => {
    const element = screen.getByText("access_log.update");

    expect(element).toBeInTheDocument();
  });

  it("renders AccessLogItem", () => {
    expect(screen.getAllByTestId("timeline")).toHaveLength(2);
  });

  describe("when filters are selected", () => {
    it("renders only the selected field names", () => {
      const selectedForm = "access_log";

      mountedComponent(
        <AccessLogs {...props} />,
        defaultState.setIn(["ui", "formFilters", selectedForm], fromJS({ actions: ["show"] }))
      );
      expect(screen.getAllByTestId("timeline")).toHaveLength(4);
    });
  });
});
