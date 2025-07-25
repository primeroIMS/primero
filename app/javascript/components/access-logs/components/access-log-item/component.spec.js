import { mountedComponent, screen } from "test-utils";

import { AccessLogsRecord } from "../../records";

import AccessLogItem from ".";

describe("AccessLogItems - Component", () => {
  const props = {
    item: AccessLogsRecord({
      id: 83534,
      timestamp: "2025-07-24T23:18:31.415Z",
      full_name: "CP Manager",
      user_name: "primero_mgr_cp",
      action: "show",
      role_name: "CP Manager",
      record_type: "cases",
      record_id: "854d2e0d-36e0-495e-8bee-3eda121e3738"
    })
  };

  beforeEach(() => {
    mountedComponent(<AccessLogItem {...props} />);
  });
  it("renders AccessLogItem", () => {
    const element = screen.getByText("CP Manager (primero_mgr_cp), CP Manager");

    expect(element).toBeInTheDocument();
  });
});
