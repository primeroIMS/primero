import { fromJS } from "immutable";

import { setupHook } from "../../test-utils";

import { useApp } from "./use-app";
import useSystemStrings from "./use-system-strings";
import { PrimeroModuleRecord } from "./records";

jest.mock("./use-app");

describe("application/use-system-string.js", () => {
  const state = {
    user: {
      isAuthenticated: true,
      username: "primero",
      modules: ["primeromodule-cp"]
    },
    application: {
      modules: [
        PrimeroModuleRecord({
          unique_id: "primeromodule-cp",
          name: "CP",
          associated_record_types: ["case", "tracing_request", "incident"],
          field_labels: {
            name: {
              en: "Name (from CP module)"
            }
          }
        })
      ],
      fieldLabels: {
        name: {
          en: "Name (from SYS Settings)"
        },
        "dashboard.case_risk": {
          en: "Risk Level (from SYS Settings)"
        }
      }
    }
  };

  beforeEach(() => {
    useApp.mockReturnValue({
      fieldLabels: fromJS({
        name: {
          en: "Name (from SYS Settings)"
        },
        "dashboard.case_risk": {
          en: "Risk Level (from SYS Settings)"
        }
      })
    });
  });

  it("returns label from module", () => {
    const { act, result } = setupHook(() => useSystemStrings("listHeader"), state);

    act(() => {
      expect(result.current.label("name")).toEqual("Name (from CP module)");
    });
  });

  it("returns fallback label from system settings", () => {
    const { act, result } = setupHook(() => useSystemStrings("dashboard"), state);

    act(() => {
      expect(result.current.label("dashboard.case_risk")).toEqual("Risk Level (from SYS Settings)");
    });
  });

  it("returns fallback label from i18n", () => {
    const { act, result } = setupHook(() => useSystemStrings("listHeader"), state);

    act(() => {
      expect(result.current.label("record_owner")).toEqual("record_owner");
    });
  });

  it("does not return unpermitted label and fallback to i18n", () => {
    const { act, result } = setupHook(() => useSystemStrings("listHeader"), state);

    act(() => {
      expect(result.current.label("unpermitted_field")).toEqual("unpermitted_field");
    });
  });

  it("returns specified i18n fallback", () => {
    const { act, result } = setupHook(() => useSystemStrings("listHeader"), state);

    act(() => {
      expect(result.current.label("record_owner", "fields.record_owner")).toEqual("fields.record_owner");
      expect(result.current.label("social_worker", "fields.social_worker")).toEqual("fields.social_worker");
    });
  });

  describe("registry record keys", () => {
    const registryLabels = {
      "navigation.registry_records": { en: "CBCRCs" },
      "registry_records.label": { en: "CBCRCs" },
      "registry_records.register_new_registry_record": { en: "New CBCRC" },
      "registry_records.show_registry_record": { en: "CBCRC ID: %{short_id}" },
      "registry_records.selected_records": { en: "%{select_records} CBCRC(s) selected" },
      "registry_records.selected_all_records": { en: "Select all %{total_records} CBCRCs that match this query." },
      "forms.record_types.registry_details": { en: "CBCRC Details" }
    };
    const registryState = {
      ...state,
      application: {
        ...state.application,
        modules: [
          PrimeroModuleRecord({
            unique_id: "primeromodule-cp",
            name: "CP",
            associated_record_types: ["case", "incident", "registry_record"],
            field_labels: registryLabels
          })
        ]
      }
    };

    it.each([
      ["navigation", "navigation.registry_records", {}, "CBCRCs"],
      ["page", "registry_records.label", {}, "CBCRCs"],
      ["page", "registry_records.register_new_registry_record", {}, "New CBCRC"],
      ["page", "registry_records.show_registry_record", { short_id: "abc1234" }, "CBCRC ID: abc1234"],
      ["page", "registry_records.selected_records", { select_records: 2 }, "2 CBCRC(s) selected"],
      [
        "page",
        "registry_records.selected_all_records",
        { total_records: 5 },
        "Select all 5 CBCRCs that match this query."
      ],
      ["form", "forms.record_types.registry_details", {}, "CBCRC Details"]
    ])("returns the %s override for %s", (feature, key, options, expected) => {
      const { act, result } = setupHook(() => useSystemStrings(feature), registryState);

      act(() => {
        expect(result.current.label(key, undefined, options)).toEqual(expected);
      });
    });
  });

  describe("incident keys", () => {
    const incidentLabels = {
      "dashboard.dash_case_incident_overview": { en: "My Cases / Monitoring Reports" },
      "navigation.incidents": { en: "Monitoring Reports" },
      "incidents.label": { en: "Monitoring Reports" },
      "incidents.show_incident": { en: "Monitoring Report ID %{short_id}" },
      "forms.record_types.incident": { en: "Monitoring Report" },
      "actions.incident_from_case": { en: "Create Monitoring Report" },
      "incident.link_incident_to_case": { en: "Link Monitoring Report to Case" },
      "incidents.register_new_incident": { en: "New Monitoring Report" },
      "incidents.selected_records": { en: "%{select_records} monitoring report(s) selected" },
      "incidents.selected_all_records": { en: "Select all %{total_records} monitoring reports that match this query." },
      "incidents.selected_records_assign": { en: "%{select_records} monitoring report(s) selected." },
      "dashboard.with_incidents": { en: "With Monitoring Reports" },
      "dashboard.with_new_incidents": { en: "With New Monitoring Reports" },
      "dashboard.without_incidents": { en: "Without Monitoring Reports" },
      "actions.incident_details_from_case": { en: "Add Monitoring Report" },
      "incident.messages.creation_success": { en: "Monitoring Report record successfully created." },
      "incident.messages.update_success": { en: "Monitoring Report %{record_id} was successfully updated." },
      "incident.link_incident_to_case_success": { en: "Linked monitoring report(s) to case" },
      "incidents.disable_dialog_title": { en: "Disable Monitoring Report" },
      "incidents.disable_dialog": { en: "Clicking OK will change the status of this monitoring report to Disabled." },
      "incidents.disable_success": { en: "Successfully disabled monitoring report" },
      "incidents.enable_dialog_title": { en: "Enable Monitoring Report" },
      "incidents.enable_dialog": { en: "Clicking OK will change the status of this monitoring report to Enabled." },
      "incidents.enable_success": { en: "Successfully enabled monitoring reports." },
      "reassign.incident_from_case_warning": { en: "You cannot assign this Monitoring Report." },
      date_of_incident: { en: "Date of Monitoring Report" },
      "loc:incident_location": { en: "Monitoring Report Location" }
    };
    const incidentState = {
      ...state,
      application: {
        ...state.application,
        modules: [
          PrimeroModuleRecord({
            unique_id: "primeromodule-cp",
            name: "CP",
            associated_record_types: ["case", "incident"],
            field_labels: incidentLabels
          })
        ]
      }
    };

    it.each([
      ["dashboard", "dashboard.dash_case_incident_overview", {}, "My Cases / Monitoring Reports"],
      ["navigation", "navigation.incidents", {}, "Monitoring Reports"],
      ["form", "incidents.label", {}, "Monitoring Reports"],
      ["page", "incidents.show_incident", { short_id: "abc1234" }, "Monitoring Report ID abc1234"],
      ["page", "forms.record_types.incident", {}, "Monitoring Report"],
      ["actionButton", "forms.record_types.incident", {}, "Monitoring Report"],
      ["actionButton", "actions.incident_from_case", {}, "Create Monitoring Report"],
      ["actionButton", "incident.link_incident_to_case", {}, "Link Monitoring Report to Case"],
      ["page", "incidents.label", {}, "Monitoring Reports"],
      ["page", "incidents.register_new_incident", {}, "New Monitoring Report"],
      ["page", "incidents.selected_records", { select_records: 2 }, "2 monitoring report(s) selected"],
      [
        "page",
        "incidents.selected_all_records",
        { total_records: 5 },
        "Select all 5 monitoring reports that match this query."
      ],
      ["page", "incidents.selected_records_assign", { select_records: 2 }, "2 monitoring report(s) selected."],
      ["dashboard", "dashboard.with_incidents", {}, "With Monitoring Reports"],
      ["dashboard", "dashboard.with_new_incidents", {}, "With New Monitoring Reports"],
      ["dashboard", "dashboard.without_incidents", {}, "Without Monitoring Reports"],
      ["actionButton", "actions.incident_details_from_case", {}, "Add Monitoring Report"],
      ["page", "incident.messages.creation_success", {}, "Monitoring Report record successfully created."],
      [
        "page",
        "incident.messages.update_success",
        { record_id: "abc1234" },
        "Monitoring Report abc1234 was successfully updated."
      ],
      ["page", "incident.link_incident_to_case_success", {}, "Linked monitoring report(s) to case"],
      ["page", "incidents.disable_dialog_title", {}, "Disable Monitoring Report"],
      [
        "page",
        "incidents.disable_dialog",
        {},
        "Clicking OK will change the status of this monitoring report to Disabled."
      ],
      ["page", "incidents.disable_success", {}, "Successfully disabled monitoring report"],
      ["page", "incidents.enable_dialog_title", {}, "Enable Monitoring Report"],
      [
        "page",
        "incidents.enable_dialog",
        {},
        "Clicking OK will change the status of this monitoring report to Enabled."
      ],
      ["page", "incidents.enable_success", {}, "Successfully enabled monitoring reports."],
      ["page", "reassign.incident_from_case_warning", {}, "You cannot assign this Monitoring Report."],
      ["listHeader", "date_of_incident", {}, "Date of Monitoring Report"],
      ["filter", "loc:incident_location", {}, "Monitoring Report Location"]
    ])("returns the %s override for %s", (feature, key, options, expected) => {
      const { act, result } = setupHook(() => useSystemStrings(feature), incidentState);

      act(() => {
        expect(result.current.label(key, undefined, options)).toEqual(expected);
      });
    });
  });

  it("returns specified i18n fallback when unpermitted_field", () => {
    const { act, result } = setupHook(() => useSystemStrings("listHeader"), state);

    act(() => {
      expect(result.current.label("unpermitted_field", "fields.unpermitted_field")).toEqual("fields.unpermitted_field");
    });
  });
});
