// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.
import { fromJS } from "immutable";

import { RECORD_TYPES, INCIDENT_CASE_ID_DISPLAY_FIELD, INCIDENT_CASE_ID_FIELD } from "../../config";
import { setupHook } from "../../test-utils";

import useIncidentFromCase from "./use-incident-from-case";

describe("IncidentFromCase - useIncidentFromCase", () => {
  const record = fromJS({
    [INCIDENT_CASE_ID_DISPLAY_FIELD]: "6a7013f",
    [INCIDENT_CASE_ID_FIELD]: "d92f8cc0-5350-4396-b852-d83476a7013f"
  });

  describe("when recordType is incidents", () => {
    it("should return IncidentFromCase data", () => {
      const { result } = setupHook(() =>
        useIncidentFromCase({
          recordType: RECORD_TYPES.incidents,
          record
        })
      );

      expect(result.current.incidentFromCaseIdDisplay).toBe("6a7013f");
      expect(result.current.incidentFromCaseId).toBe("d92f8cc0-5350-4396-b852-d83476a7013f");
      expect(result.current.present).toBeTruthy();
    });
  });

  describe("should return IncidentFromCase data", () => {
    describe("when recordType is cases", () => {
      it("should return undefined data", () => {
        const { result } = setupHook(() =>
          useIncidentFromCase({
            recordType: RECORD_TYPES.cases,
            record
          })
        );

        expect(result.current.incidentFromCaseIdDisplay).toBeNull();
        expect(result.current.incidentFromCaseId).toBeNull();
        expect(result.current.present).toBeFalsy();
      });
    });
  });
});
