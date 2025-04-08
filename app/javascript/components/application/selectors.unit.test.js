// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { RECORD_TYPES, MODULES } from "../../config";
import { GROUP_PERMISSIONS, ACTIONS } from "../permissions";
import { FieldRecord } from "../form";

import { PrimeroModuleRecord } from "./records";
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
  terms_of_use_enabled: true,
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
  terms_of_use_enabled: true,
  services: ["service_test_1"]
};

const userGroups = [
  { id: 1, unique_id: "user-group-1" },
  { id: 2, unique_id: "user-group-2" }
];

const roles = [
  { id: 1, unique_id: "role-1", name: "Role 1" },
  { id: 2, unique_id: "role-2", name: "Role 2" }
];

const stateWithNoRecords = fromJS({});
const stateWithRecords = fromJS({
  application: {
    primero: {
      sandbox_ui: true,
      config_ui: "full",
      agenciesLogoPdf: [agencyWithLogo, agency1],
      agencies_logo_options: [agencyWithLogo, agency1],
      locales: ["en", "fr", "ar"]
    },
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
      field_key: "owned_by_location",
      admin_level: 2,
      admin_level_map: { 1: ["province"], 2: ["district"] },
      label_keys: ["district"]
    },
    permissions: fromJS({
      management: [GROUP_PERMISSIONS.SELF],
      resource_actions: { case: [ACTIONS.READ] }
    }),
    defaultLocale: "en",
    baseLanguage: "en",
    primeroVersion: "2.0.0.1",
    approvalsLabels: {
      closure: {
        en: "Closure",
        fr: "",
        ar: "Closure-AR"
      },
      case_plan: {
        en: "Case Plan",
        fr: "",
        ar: "Case Plan-AR"
      },
      assessment: {
        en: "Assessment",
        fr: "",
        ar: "Assessment-AR"
      },
      action_plan: {
        en: "Action Plan",
        fr: "",
        ar: "Action Plan-AR"
      },
      gbv_closure: {
        en: "GBV Closure",
        fr: "",
        ar: "GBV Closure-AR"
      }
    },
    userGroups,
    roles,
    disabledApplication: true,
    systemOptions: {
      maximum_users: 50,
      maximum_users_warning: 45,
      maximum_attachments_per_record: 55
    }
  }
});

describe("Application - Selectors", () => {
  describe("selectAgencies", () => {
    it("should return records", () => {
      const expected = fromJS([agencyWithLogo, agency1, agency2, agency3]);

      const records = selectors.selectAgencies(stateWithRecords);

      expect(records).toEqual(expected);
    });

    it("should return empty object when records empty", () => {
      const records = selectors.selectAgencies(stateWithNoRecords);

      expect(records.size).toBe(0);
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

      expect(records).toEqual(expected);
    });

    it("should return empty object when records empty", () => {
      const records = selectors.selectModules(stateWithNoRecords);

      expect(records.size).toBe(0);
    });
  });

  describe("selectLocales", () => {
    it("should return records", () => {
      const expected = fromJS(["en", "fr", "ar"]);

      const records = selectors.selectLocales(stateWithRecords);

      expect(records.equals(expected)).toBe(true);
    });

    it("should return empty object when records empty", () => {
      const records = selectors.selectLocales(stateWithNoRecords);

      expect(records.size).toBe(0);
    });
  });

  describe("selectUserIdle", () => {
    it("should return weither user is idle", () => {
      const selector = selectors.selectUserIdle(stateWithRecords);

      expect(selector).toBe(true);
    });
  });

  describe("getReportingLocationConfig", () => {
    it("should return the reporting location config", () => {
      const selector = selectors.getReportingLocationConfig(stateWithRecords);
      const config = fromJS({
        admin_level: 2,
        field_key: "owned_by_location",
        admin_level_map: { 1: ["province"], 2: ["district"] },
        label_keys: ["district"]
      });

      expect(selector).toEqual(config);
    });
  });

  describe("getSystemPermissions", () => {
    it("should return the system permissions", () => {
      const selector = selectors.getSystemPermissions(stateWithRecords);
      const permissions = fromJS({
        management: [GROUP_PERMISSIONS.SELF],
        resource_actions: { case: [ACTIONS.READ] }
      });

      expect(selector).toEqual(permissions);
    });
  });

  describe("getResourceActions", () => {
    it("should return the resource actions", () => {
      const selector = selectors.getResourceActions(stateWithRecords, RECORD_TYPES.cases);

      expect(selector).toEqual(fromJS([ACTIONS.READ]));
    });
  });

  describe("getAgenciesWithService", () => {
    it("should return agencies with the selected service", () => {
      const expected = fromJS([agency2]);
      const agenciesWithService = selectors.getAgenciesWithService(stateWithRecords, "service_test_2");

      expect(agenciesWithService).toEqual(expected);
    });

    it("should return empty if there are no agencies with the selected service", () => {
      const agenciesWithService = selectors.getAgenciesWithService(stateWithRecords, "service_test_5");

      expect(agenciesWithService.size).toBe(0);
    });

    it("should return empty if there are no agencies", () => {
      const agencies = selectors.getAgenciesWithService(stateWithNoRecords);

      expect(agencies.size).toBe(0);
    });
  });

  describe("getEnabledAgencies", () => {
    it("should return the enabled agencies", () => {
      const expected = fromJS([agencyWithLogo, agency1, agency2]);
      const enabledAgencies = selectors.getEnabledAgencies(stateWithRecords);

      expect(enabledAgencies).toEqual(expected);
    });

    it("should return enabled agencies with the selected service", () => {
      const expected = fromJS([agency2]);
      const agenciesWithService = selectors.getEnabledAgencies(stateWithRecords, "service_test_2");

      expect(agenciesWithService).toEqual(expected);
    });

    it("should return empty if there are no agencies with the selected service", () => {
      const agenciesWithService = selectors.getEnabledAgencies(stateWithRecords, "service_test_5");

      expect(agenciesWithService.size).toBe(0);
    });

    it("should return empty if there are no enabled agencies", () => {
      const enabledAgencies = selectors.getEnabledAgencies(stateWithNoRecords);

      expect(enabledAgencies.size).toBe(0);
    });
  });

  describe("getApprovalsLabels", () => {
    it("should return the approvalsLabels", () => {
      const expectedApprovalsLabels = fromJS({
        default: {
          closure: "Closure",
          case_plan: "Case Plan",
          assessment: "Assessment",
          action_plan: "Action Plan",
          gbv_closure: "GBV Closure"
        }
      });
      const approvalsLabels = selectors.getApprovalsLabels(stateWithRecords, "en");

      expect(approvalsLabels).toEqual(expectedApprovalsLabels);
    });
  });

  describe("getUserGroups", () => {
    it("should return user groups", () => {
      expect(selectors.getUserGroups(stateWithRecords)).toEqual(fromJS(userGroups));
    });
  });

  describe("getRoles", () => {
    it("should return roles", () => {
      expect(selectors.getRoles(stateWithRecords)).toEqual(fromJS(roles));
    });
  });

  describe("getRoleName", () => {
    it("should return the role name", () => {
      expect(selectors.getRoleName(stateWithRecords, "role-2")).toEqual("Role 2");
    });
  });

  describe("getDisabledApplication", () => {
    it("should return boolean value that identifies if the application is disabled or not", () => {
      expect(selectors.getDisabledApplication(stateWithRecords)).toBe(true);
    });
  });

  describe("getDemo", () => {
    it("should return the role name", () => {
      expect(selectors.getDemo(stateWithRecords)).toBe(true);
    });
  });

  describe("getAdminLevel", () => {
    it("should return the admin_level", () => {
      const selector = selectors.getAdminLevel(stateWithRecords);

      expect(selector).toBe(2);
    });
  });

  describe("getAgencyLogosPdf", () => {
    it("should return agency if fromApplication is true", () => {
      const selector = selectors.getAgencyLogosPdf(stateWithRecords, true);

      expect(selector.size).toBe(2);
    });

    it("should return agency if fromApplication is false", () => {
      const selector = selectors.getAgencyLogosPdf(stateWithRecords, false);

      expect(selector.size).toBe(2);
    });
  });

  describe("getConfigUI", () => {
    it("should return config_ui", () => {
      const result = selectors.getConfigUI(stateWithRecords);

      expect(result).toBe("full");
    });

    it("should return empty string if there is not any config_ui", () => {
      const result = selectors.getConfigUI(stateWithNoRecords);

      expect(Object.keys(result)).toHaveLength(0);
    });
  });

  describe("getLimitedConfigUI", () => {
    it("should return true if config_ui is limited", () => {
      const result = selectors.getLimitedConfigUI(fromJS({ application: { primero: { config_ui: "limited" } } }));

      expect(result).toBe(true);
    });

    it("should return false if config_ui is not limited", () => {
      const result = selectors.getLimitedConfigUI(stateWithRecords);

      expect(result).toBe(false);
    });
  });

  describe("getIsEnabledWebhookSyncFor", () => {
    it("should return true if record and module have webhook sync enabled", () => {
      const result = selectors.getIsEnabledWebhookSyncFor(
        fromJS({
          application: {
            modules: [
              {
                unique_id: MODULES.CP,
                options: {
                  use_webhook_sync_for: [RECORD_TYPES.cases]
                }
              }
            ]
          }
        }),
        MODULES.CP,
        RECORD_TYPES.cases
      );

      expect(result).toBe(true);
    });

    it("should return false iif record and module don't have enabled webhook sync", () => {
      const result = selectors.getLimitedConfigUI(stateWithRecords, MODULES.CP, RECORD_TYPES.cases);

      expect(result).toBe(false);
    });
  });

  describe("getAgencyTermsOfUse", () => {
    it("should return only agencies with terms_of_use_enabled", () => {
      const result = selectors.getAgencyTermsOfUse(
        fromJS({
          application: {
            agencies: [agencyWithLogo, agency1, agency2, agency3]
          }
        })
      );
      const expected = fromJS([agency1, agency3]);

      expect(result).toEqual(expected);
    });
  });
  describe("getLocationsAvailable", () => {
    it("should return true if exist locations loaded", () => {
      const result = selectors.getLocationsAvailable(
        fromJS({
          forms: {
            options: {
              locations: [
                {
                  id: 1,
                  code: "XX",
                  type: "country",
                  admin_level: 0,
                  name: {
                    en: "Country 1"
                  }
                }
              ]
            }
          }
        })
      );

      expect(result).toBe(true);
    });
    it("should return false if exist locations loaded", () => {
      const result = selectors.getLocationsAvailable(
        fromJS({
          forms: {
            options: {
              locations: []
            }
          }
        })
      );

      expect(result).toBe(false);
    });
  });

  describe("getWorkflowLabels", () => {
    it("should return an empty array if there is no data", () => {
      const result = selectors.getWorkflowLabels(fromJS({}), "module-1");

      expect(result).toEqual([]);
    });

    it("returns the workflow labels", () => {
      const workflowOptions = [
        { id: "new", display_text: { en: "New" } },
        { id: "reopened", display_text: { en: "Reopened" } }
      ];

      const result = selectors.getWorkflowLabels(
        fromJS({
          application: {
            modules: [
              PrimeroModuleRecord({
                unique_id: "module-1",
                workflows: { case: workflowOptions }
              })
            ]
          },
          user: { modules: ["module-1"] }
        }),
        "module-1",
        "case"
      );

      expect(result).toEqual(workflowOptions);
    });
  });

  describe("hasAgencyLogos", () => {
    it("returns false if there are no logos", () => {
      const result = selectors.hasAgencyLogos(
        fromJS({
          application: {
            primero: {
              agencies: []
            }
          },
          user: { modules: ["module-1"] }
        })
      );

      expect(result).toBe(false);
    });

    it("returns true if there are logos", () => {
      const result = selectors.hasAgencyLogos(
        fromJS({
          application: {
            primero: {
              agencies: [{ unique_id: "agency_1", name: "Agency 1" }]
            }
          }
        })
      );

      expect(result).toBe(true);
    });
  });

  describe("getPrimaryAgeRange", () => {
    it("returns the primaryAgeRange", () => {
      const result = selectors.getPrimaryAgeRange(fromJS({ application: { primaryAgeRange: "unhcr" } }));

      expect(result).toBe("unhcr");
    });
  });

  describe("getPrimaryAgeRanges", () => {
    it("returns the primaryAgeRanges", () => {
      const ageRange = fromJS(["0..4", "5..11", "12..17", "18..999"]);
      const result = selectors.getPrimaryAgeRanges(
        fromJS({
          application: {
            primaryAgeRange: "unhcr",
            ageRanges: {
              unhcr: ageRange,
              primero: []
            }
          }
        })
      );

      expect(result).toEqual(ageRange);
    });
  });

  describe("getMaximumUsers", () => {
    it("should return maximum users", () => {
      const result = selectors.getMaximumUsers(stateWithRecords);

      expect(result).toBe(50);
    });

    it("should return empty string if there is not any config_ui", () => {
      const result = selectors.getMaximumUsers(stateWithNoRecords);

      expect(result).toBeUndefined();
    });
  });

  describe("getMaximumUsersWarning", () => {
    it("should return maximum users warning", () => {
      const result = selectors.getMaximumUsersWarning(stateWithRecords);

      expect(result).toBe(45);
    });

    it("should return empty string if there is not any config_ui", () => {
      const result = selectors.getMaximumUsersWarning(stateWithNoRecords);

      expect(result).toBeUndefined();
    });
  });

  describe("getReferralAuthorizationRoles", () => {
    it("returns the referralAuthorizationRoles", () => {
      const referralAuthorizationRoles = fromJS([{ id: 1, unique_id: "role-authorized-1" }]);
      const result = selectors.getReferralAuthorizationRoles(
        fromJS({ application: { referralAuthorizationRoles: { data: referralAuthorizationRoles } } })
      );

      expect(result).toEqual(referralAuthorizationRoles);
    });
  });

  describe("getReferralAuthorizationRolesLoading", () => {
    it("returns the loading state for ReferralAuthorizationRoles", () => {
      const result = selectors.getReferralAuthorizationRolesLoading(
        fromJS({ application: { referralAuthorizationRoles: { loading: true } } })
      );

      expect(result).toBe(true);
    });
  });

  describe("getMaximumAttachmentsPerRecord", () => {
    it("should return maximum users warning", () => {
      const result = selectors.getMaximumAttachmentsPerRecord(stateWithRecords);

      expect(result).toBe(55);
    });
  });

  describe("getListHeaders", () => {
    const agencies = fromJS([
      { name: "Name", field_name: "agency.name", id_search: false },
      {
        name: "Description",
        field_name: "agency.description",
        id_search: false
      }
    ]);
    const field = FieldRecord({
      display_name: "Test Field 1",
      name: "test_field_1",
      type: "text_field"
    });

    const metadata = fromJS({
      total: 24,
      per: 20,
      page: 1
    });

    it("should return list of headers allowed to the user", () => {
      const expected = agencies;
      const values = selectors.getListHeaders(
        fromJS({
          user: {
            listHeaders: {
              agencies
            }
          },
          forms: {
            fields: field
          },
          records: {
            cases: {
              metadata,
              filters: { disabled: ["true"] }
            }
          }
        }),
        "agencies"
      );

      expect(values).toEqual(agencies);
    });

    it("should return false when there are not users in store", () => {
      const values = selectors.getListHeaders(fromJS({}));

      expect(values.size).toBe(0);
    });
  });
});
