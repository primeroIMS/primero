import { fromJS } from "immutable";

import * as selectors from "./selectors";

const stateWithNoRecords = fromJS({
  records: {
    cases: {
      bulkTransitions: {
        loading: true,
        data: [],
        errors: []
      }
    }
  }
});
const stateWithRecords = fromJS({
  records: {
    cases: {
      bulkTransitions: {
        loading: true,
        data: [
          {
            notes: "",
            transitioned_by: "primero",
            remote: false,
            transitioned_to: "primero_cp",
            record_type: "case",
            record_access_denied: false,
            record_id: "c6f7f95a-3bc9-446d-9d2e-11b1726f38b1",
            created_at: "2020-05-26T00:46:24.355Z",
            consent_individual_transfer: false,
            record: {
              id: "c6f7f95a-3bc9-446d-9d2e-11b1726f38b1",
              owned_by: "primero_cp",
              owned_by_groups: [1],
              owned_by_full_name: "CP Worker",
              previously_owned_by: "primero_ftr_manager",
              associated_user_groups: ["usergroup-primero-cp"],
              reassigned_transferred_on: "2020-05-26T00:46:24.366Z",
              previously_owned_by_full_name: "FTR Manager"
            },
            status: "done",
            consent_overridden: false,
            type: "Assign",
            id: "68c34cd3-1ad2-48ce-a6ae-087d0a0a57fc"
          }
        ],
        errors: [
          {
            status: 500,
            resource: "/api/v2/cases/assigns",
            message: "StandardError"
          }
        ]
      }
    }
  }
});

describe("bulk-transitons - Selectors", () => {
  describe("getNumberErrorsBulkAssign", () => {
    it("should return the number of errors in the assign", () => {
      const expected = 1;
      const values = selectors.getNumberErrorsBulkAssign(
        stateWithRecords,
        "cases"
      );

      expect(values).to.deep.equal(expected);
    });

    it("should return zero when there are not errors in store", () => {
      const expected = 0;
      const values = selectors.getNumberErrorsBulkAssign(
        stateWithNoRecords,
        "cases"
      );

      expect(values).to.be.equal(expected);
    });
  });

  describe("getNumberBulkAssign", () => {
    it("should return number of records assigned", () => {
      const expected = 1;
      const values = selectors.getNumberBulkAssign(stateWithRecords, "cases");

      expect(values).to.deep.equal(expected);
    });

    it("should return zero when there are not records assigned in store", () => {
      const expected = 0;
      const values = selectors.getNumberBulkAssign(stateWithNoRecords, "cases");

      expect(values).to.be.equal(expected);
    });
  });
});
