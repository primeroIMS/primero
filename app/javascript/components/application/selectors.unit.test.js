import { fromJS } from "immutable";

import { RECORD_TYPES } from "../../config";
import { GROUP_PERMISSIONS, ACTIONS } from "../../libs/permissions";

import * as selectors from "./selectors";

const agencyWithLogo = {
  unique_id: "agency-unicef",
  name: "UNICEF",
  logo: {
    small: "/rails/active_storage/blobs/jeff.png"
  }
};

const agency1 = {
  unique_id: "agency-test-1",
  agency_code: "test1",
  disabled: false,
  services: ["service_test_1"]
};

const agency2 = {
  unique_id: "agency-test-2",
  agency_code: "test2",
  disabled: false,
  services: ["service_test_1", "service_test_2"]
};

const agency3 = {
  unique_id: "agency-test-3",
  agency_code: "test3",
  disabled: true,
  services: ["service_test_1"]
};

const stateWithNoRecords = fromJS({});
const stateWithRecords = fromJS({
  application: {
    userIdle: true,
    agencies: [agencyWithLogo, agency1, agency2, agency3],
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
    reportingLocationConfig: {
      label_key: "district",
      admin_level: 2,
      field_key: "owned_by_location"
    },
    permissions: fromJS({
      management: [GROUP_PERMISSIONS.SELF],
      resource_actions: { case: [ACTIONS.READ] }
    }),
    locales: ["en", "fr", "ar"],
    defaultLocale: "en",
    baseLanguage: "en",
    primeroVersion: "2.0.0.1"
  }
});

describe("Application - Selectors", () => {
  describe("selectAgencies", () => {
    it("should return records", () => {
      const expected = fromJS([agencyWithLogo, agency1, agency2, agency3]);

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
      const expected = fromJS([
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
      ]);

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
      const expected = fromJS(["en", "fr", "ar"]);

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

  describe("getReportingLocationConfig", () => {
    it("should return the reporting location config", () => {
      const selector = selectors.getReportingLocationConfig(stateWithRecords);
      const config = fromJS({
        label_key: "district",
        admin_level: 2,
        field_key: "owned_by_location"
      });

      expect(selector).to.deep.equal(config);
    });
  });

  describe("getSystemPermissions", () => {
    it("should return the system permissions", () => {
      const selector = selectors.getSystemPermissions(stateWithRecords);
      const permissions = fromJS({
        management: [GROUP_PERMISSIONS.SELF],
        resource_actions: { case: [ACTIONS.READ] }
      });

      expect(selector).to.deep.equal(permissions);
    });
  });

  describe("getResourceActions", () => {
    it("should return the resource actions", () => {
      const selector = selectors.getResourceActions(
        stateWithRecords,
        RECORD_TYPES.cases
      );

      expect(selector).to.deep.equal(fromJS([ACTIONS.READ]));
    });
  });

  describe("getEnabledAgencies", () => {
    it("should return the enabled agencies", () => {
      const expected = fromJS([agencyWithLogo, agency1, agency2]);
      const enabledAgencies = selectors.getEnabledAgencies(stateWithRecords);

      expect(enabledAgencies).to.deep.equal(expected);
    });

    it("should return enabled agencies with the selected service", () => {
      const expected = fromJS([agency2]);
      const agenciesWithService = selectors.getEnabledAgencies(
        stateWithRecords,
        "service_test_2"
      );

      expect(agenciesWithService).to.deep.equal(expected);
    });

    it("should return empty if there are no agencies with the selected service", () => {
      const agenciesWithService = selectors.getEnabledAgencies(
        stateWithRecords,
        "service_test_5"
      );

      expect(agenciesWithService).to.be.empty;
    });

    it("should return empty if there are no enabled agencies", () => {
      const enabledAgencies = selectors.getEnabledAgencies(stateWithNoRecords);

      expect(enabledAgencies).to.be.empty;
    });
  });
});
