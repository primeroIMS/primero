import chai, { expect } from "chai";
import { Map } from "immutable";
import chaiImmutable from "chai-immutable";

import * as selectors from "./selectors";

chai.use(chaiImmutable);

const stateWithNoRecords = Map({});
const stateWithRecords = Map({
  application: {
    userIdle: true,
    agencies: [
      {
        unique_id: "agency-unicef",
        name: "UNICEF",
        logo: {
          small: "/rails/active_storage/blobs/jeff.png"
        }
      }
    ],
    modules: [
      {
        unique_id: "primeromodule-cp",
        name: "CP",
        associated_record_types: ["case", "tracing_request", "incident"],
        options: {
          allow_searchable_ids: true,
          use_workflow_case_plan: true,
          use_workflow_assessment: false,
          reporting_location_filter: true,
          use_workflow_service_implemented: true
        }
      },
      {
        unique_id: "primeromodule-gbv",
        name: "GBV",
        associated_record_types: ["case", "incident"],
        options: {
          user_group_filter: true
        }
      }
    ],
    locales: ["en", "fr", "ar"],
    defaultLocale: "en",
    baseLanguage: "en",
    primeroVersion: "2.0.0.1"
  }
});

describe("Application - Selectors", () => {
  describe("selectAgencies", () => {
    it("should return records", () => {
      const expected = [
        {
          unique_id: "agency-unicef",
          name: "UNICEF",
          logo: {
            small: "/rails/active_storage/blobs/jeff.png"
          }
        }
      ];

      const records = selectors.selectAgencies(stateWithRecords);

      expect(records).to.deep.equal(expected);
    });

    it("should return empty object when records empty", () => {
      const records = selectors.selectAgencies(stateWithNoRecords);

      expect(records).to.be.empty;
    });
  });

  describe("selectModules", () => {
    it("should return records", () => {
      const expected = [
        {
          unique_id: "primeromodule-cp",
          name: "CP",
          associated_record_types: ["case", "tracing_request", "incident"],
          options: {
            allow_searchable_ids: true,
            use_workflow_case_plan: true,
            use_workflow_assessment: false,
            reporting_location_filter: true,
            use_workflow_service_implemented: true
          }
        },
        {
          unique_id: "primeromodule-gbv",
          name: "GBV",
          associated_record_types: ["case", "incident"],
          options: {
            user_group_filter: true
          }
        }
      ];

      const records = selectors.selectModules(stateWithRecords);

      expect(records).to.deep.equal(expected);
    });

    it("should return empty object when records empty", () => {
      const records = selectors.selectModules(stateWithNoRecords);

      expect(records).to.be.empty;
    });
  });

  describe("selectLocales", () => {
    it("should return records", () => {
      const expected = ["en", "fr", "ar"];

      const records = selectors.selectLocales(stateWithRecords);

      expect(records).to.deep.equal(expected);
    });

    it("should return empty object when records empty", () => {
      const records = selectors.selectLocales(stateWithNoRecords);

      expect(records).to.be.empty;
    });
  });

  describe("selectUserIdle", () => {
    it("should return weither user is idle", () => {
      const selector = selectors.selectUserIdle(stateWithRecords);

      expect(selector).to.equal(true);
    });
  });
});
