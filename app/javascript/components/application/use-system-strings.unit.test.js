// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

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

  it("returns specified i18n fallback when unpermitted_field", () => {
    const { act, result } = setupHook(() => useSystemStrings("listHeader"), state);

    act(() => {
      expect(result.current.label("unpermitted_field", "fields.unpermitted_field")).toEqual("fields.unpermitted_field");
    });
  });
});
