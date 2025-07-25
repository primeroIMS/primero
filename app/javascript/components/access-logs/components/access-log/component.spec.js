// Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

import { mountedComponent, screen } from "test-utils";

import { AccessLogsRecord } from "../../records";

import AccessLog from "./component";

describe("AccessLog - Component", () => {
  const props = {
    recordAccessLogs: [
      AccessLogsRecord({
        record_id: "38c82975-99aa-4798-9c3d-dabea104d992",
        record_type: "cases",
        timestamp: "2020-08-11T10:27:33Z",
        user_name: "primero",
        full_name: "SuperUser",
        action: "update",
        role_name: "My Role",
        id: 2
      }),
      AccessLogsRecord({
        record_id: "38c82975-99aa-4798-9c3d-dabea104d992",
        record_type: "cases",
        timestamp: "2020-08-10T18:27:33Z",
        user_name: "primero",
        full_name: "SuperUser",
        action: "show",
        role_name: "My Role",
        id: 1
      })
    ]
  };

  beforeEach(() => {
    mountedComponent(<AccessLog {...props} />);
  });
  it("renders AccessLog", () => {
    const element = screen.getByText("access_log.show");

    expect(element).toBeInTheDocument();
  });

  it("renders AccessLogItem", () => {
    expect(screen.getAllByTestId("timeline")).toHaveLength(2);
  });
});
