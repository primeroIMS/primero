// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { CP_VIOLENCE_TYPE } from "../incidents-from-case/components/panel/constants";

import { FieldRecord } from "./records";
import { OPTION_TYPES } from "./constants";
import * as selectors from "./selectors";

describe("Forms - Selectors", () => {
  const lookup2 = { unique_id: "lookup-2", name: { en: "Lookup 2" } };
  const lookupViolenceType = {
    unique_id: "lookup-violence-type",
    name: { en: "Lookup Violence Type" },
    values: [{ id: "type1", display_text: { en: "Type 1" }, tags: ["low"] }]
  };
  const referToUsers = [
    {
      id: 1,
      user_name: "test_1"
    },
    {
      id: 2,
      user_name: "test_2"
    },
    {
      id: 3,
      user_name: "test_3"
    }
  ];

  const roles = [
    {
      id: 1,
      unique_id: "role-1",
      name: "Role 1",
      referral: true,
      form_section_unique_ids: ["test-1"],
      form_section_read_write: {
        basic_identity: "rw",
        notes: "r"
      }
    },
    {
      id: 2,
      unique_id: "role-2",
      name: "Role 2",
      referral: false,
      form_section_unique_ids: ["test-1", "test-2"]
    }
  ];

  const agencies = [
    { id: 1, unique_id: "agency-1", name: { en: "Agency 1" } },
    { id: 2, unique_id: "agency-2", name: { en: "Agency 2" } }
  ];

  const stateWithLookups = fromJS({
    records: {
      cases: {
        data: [
          {
            id: "0001-12151a",
            incident_details: [
              {
                unique_id: "0001-2151a",
                short_id: "2151a",
                incident_date: "2021-04-10",
                cp_incident_violence_type: "type1"
              }
            ]
          }
        ],
        selectedRecord: "0001-12151a"
      },
      transitions: {
        referral: {
          users: referToUsers
        }
      }
    },
    forms: {
      options: {
        lookups: [
          {
            unique_id: "lookup-1",
            name: { en: "Lookup 1" }
          },
          lookupViolenceType,
          lookup2
        ],
        locations: [
          { id: 1, code: "MC", admin_level: 0, name: { en: "MyCountry" }, disabled: false },
          { id: 2, code: "MCMP1", admin_level: 1, name: { en: "MyCountry:MyProvince1" }, disabled: false },
          { id: 3, code: "MCMP2", admin_level: 1, name: { en: "MyCountry:MyProvince2" }, disabled: false },
          {
            id: 4,
            code: "MCMP1MD1",
            admin_level: 2,
            name: { en: "MyCountry:MyProvince1:MyDistrict1" },
            disabled: false
          },
          {
            id: 5,
            code: "MCMP2MD2",
            admin_level: 2,
            name: { en: "MyCountry:MyProvince2:MyDistrict2" },
            disabled: false
          }
        ]
      },
      fields: [
        FieldRecord({
          name: CP_VIOLENCE_TYPE,
          option_strings_source: "lookup lookup-violence-type"
        })
      ]
    },
    application: {
      agencies,
      managedRoles: roles,
      roles,
      reportingLocationConfig: {
        field_key: "owned_by_location",
        admin_level: 2,
        admin_level_map: {
          1: ["province"],
          2: ["district"]
        },
        hierarchy_filter: [],
        label_keys: ["district"]
      }
    },
    user: {
      agencyId: 1,
      agencyUniqueId: "agency-1",
      permittedRoleUniqueIds: ["role-1"]
    }
  });

  describe("getOptions", () => {
    it("should return all lookup types including customs", () => {
      const options = selectors.getOptions(OPTION_TYPES.LOOKUPS)(stateWithLookups, { source: OPTION_TYPES.LOOKUPS });

      expect(options).toEqual([
        {
          id: "lookup lookup-1",
          display_text: "Lookup 1",
          values: []
        },
        {
          id: "lookup lookup-violence-type",
          display_text: "Lookup Violence Type",
          values: [{ id: "type1", display_text: "Type 1" }]
        },
        {
          id: "lookup lookup-2",
          display_text: "Lookup 2",
          values: []
        },
        {
          id: "Agency",
          display_text: "agency.label",
          translate: true
        },
        {
          display_text: "linkedincidents.label",
          id: "LinkedIncidents",
          translate: true
        },
        {
          id: "Location",
          display_text: "location.label",
          translate: true
        },
        {
          id: "User",
          display_text: "user.label",
          translate: true
        }
      ]);
    });

    describe("when optionStringsSource is REFER_TO_USERS", () => {
      describe("with record", () => {
        const currRecord = "test_2";

        const options = selectors.getOptions(OPTION_TYPES.REFER_TO_USERS)(stateWithLookups, {
          source: OPTION_TYPES.REFER_TO_USERS,
          currRecord
        });

        it("should return all users without the owned_by user that it's assigned to the record", () => {
          const expected = [
            {
              id: "test_1",
              display_text: "test_1"
            },
            {
              id: "test_3",
              display_text: "test_3"
            }
          ];

          expect(options).toEqual(expected);
        });
      });

      describe("without record", () => {
        const options = selectors.getOptions(OPTION_TYPES.REFER_TO_USERS)(stateWithLookups, {
          source: OPTION_TYPES.REFER_TO_USERS
        });

        it("should return all users without filter the owned_by user", () => {
          const expected = [
            {
              id: "test_1",
              display_text: "test_1"
            },
            {
              id: "test_2",
              display_text: "test_2"
            },
            {
              id: "test_3",
              display_text: "test_3"
            }
          ];

          expect(options).toEqual(expected);
        });
      });
    });

    describe("when optionStringsSource is USER_GROUP_PERMITTED", () => {
      const allUserGroups = [
        {
          id: 1,
          unique_id: "test-1",
          name: "Test 1",
          disabled: false
        },
        {
          id: 2,
          unique_id: "test-2",
          name: "Test 2",
          disabled: false
        },
        {
          id: 3,
          unique_id: "test-3",
          name: "Test 3",
          disabled: false
        }
      ];

      describe("when there are no application user groups", () => {
        it("returns the users groups of the user", () => {
          const state = fromJS({
            user: {
              roleGroupPermission: "all",
              userGroups: [
                {
                  id: 1,
                  unique_id: "test-1",
                  name: "Test 1",
                  disabled: false
                }
              ]
            }
          });

          expect(
            selectors.getOptions(OPTION_TYPES.USER_GROUP_PERMITTED)(state, {
              source: OPTION_TYPES.USER_GROUP_PERMITTED
            })
          ).toEqual([{ disabled: false, display_text: "Test 1", id: "test-1" }]);
        });
      });

      describe("when user group permission is ALL", () => {
        const state = fromJS({
          application: {
            userGroups: allUserGroups
          },
          user: {
            roleGroupPermission: "all"
          }
        });

        it("should return all user groups", () => {
          const expected = [
            {
              id: "test-1",
              display_text: "Test 1",
              disabled: false
            },
            {
              id: "test-2",
              display_text: "Test 2",
              disabled: false
            },
            {
              id: "test-3",
              display_text: "Test 3",
              disabled: false
            }
          ];

          expect(
            selectors.getOptions(OPTION_TYPES.USER_GROUP_PERMITTED)(state, {
              source: OPTION_TYPES.USER_GROUP_PERMITTED
            })
          ).toEqual(expected);
        });
      });

      describe("when user group permission is GROUP", () => {
        const state = fromJS({
          application: {
            userGroups: allUserGroups
          },
          user: {
            roleGroupPermission: "group",
            userGroupUniqueIds: ["test-1"]
          }
        });

        it("should return from application user groups only the ones that are assigned to the user", () => {
          const expected = [
            {
              id: "test-1",
              display_text: "Test 1",
              disabled: false
            },
            {
              id: "test-2",
              display_text: "Test 2",
              disabled: true
            },
            {
              id: "test-3",
              display_text: "Test 3",
              disabled: true
            }
          ];

          expect(
            selectors.getOptions(OPTION_TYPES.USER_GROUP_PERMITTED)(state, {
              source: OPTION_TYPES.USER_GROUP_PERMITTED
            })
          ).toEqual(expected);
        });

        describe("and managedReportScope is all", () => {
          const stateWithManagedReportScope = fromJS({
            application: {
              userGroups: allUserGroups
            },
            user: {
              managedReportScope: "all",
              roleGroupPermission: "group",
              userGroupUniqueIds: ["test-1"]
            }
          });

          it("should return from application user groups only the ones that are assigned to the user", () => {
            const expected = [
              {
                id: "test-1",
                display_text: "Test 1",
                disabled: false
              },
              {
                id: "test-2",
                display_text: "Test 2",
                disabled: true
              },
              {
                id: "test-3",
                display_text: "Test 3",
                disabled: true
              }
            ];

            expect(
              selectors.getOptions(OPTION_TYPES.USER_GROUP_PERMITTED)(stateWithManagedReportScope, {
                source: OPTION_TYPES.USER_GROUP_PERMITTED
              })
            ).toEqual(expected);
          });
        });
      });
    });

    describe("when optionStringsSource is INSIGHTS_USER_GROUP_PERMITTED", () => {
      const allUserGroups = [
        {
          id: 1,
          unique_id: "test-1",
          name: "Test 1",
          disabled: false
        },
        {
          id: 2,
          unique_id: "test-2",
          name: "Test 2",
          disabled: false
        },
        {
          id: 3,
          unique_id: "test-3",
          name: "Test 3",
          disabled: false
        }
      ];

      describe("when user group permission is ALL", () => {
        const state = fromJS({
          application: {
            userGroups: allUserGroups
          },
          user: {
            roleGroupPermission: "all"
          }
        });

        it("should return all user groups", () => {
          const expected = [
            {
              id: "test-1",
              display_text: "Test 1",
              disabled: false
            },
            {
              id: "test-2",
              display_text: "Test 2",
              disabled: false
            },
            {
              id: "test-3",
              display_text: "Test 3",
              disabled: false
            }
          ];

          expect(
            selectors.getOptions(OPTION_TYPES.INSIGHTS_USER_GROUP_PERMITTED)(state, {
              source: OPTION_TYPES.INSIGHTS_USER_GROUP_PERMITTED
            })
          ).toEqual(expected);
        });
      });

      describe("when user group permission is GROUP", () => {
        const state = fromJS({
          application: {
            userGroups: allUserGroups
          },
          user: {
            roleGroupPermission: "group",
            userGroupUniqueIds: ["test-1"]
          }
        });

        it("should return from application user groups only the ones that are assigned to the user", () => {
          const expected = [
            {
              id: "test-1",
              display_text: "Test 1",
              disabled: false
            },
            {
              id: "test-2",
              display_text: "Test 2",
              disabled: true
            },
            {
              id: "test-3",
              display_text: "Test 3",
              disabled: true
            }
          ];

          expect(
            selectors.getOptions(OPTION_TYPES.INSIGHTS_USER_GROUP_PERMITTED)(state, {
              source: OPTION_TYPES.INSIGHTS_USER_GROUP_PERMITTED
            })
          ).toEqual(expected);
        });

        describe("and managedReportScope is all", () => {
          const stateWithManagedReportScope = fromJS({
            application: {
              userGroups: allUserGroups
            },
            user: {
              managedReportScope: "all",
              roleGroupPermission: "group",
              userGroupUniqueIds: ["test-1"]
            }
          });

          it("should return from application user groups only the ones that are assigned to the user", () => {
            const expected = [
              {
                id: "test-1",
                display_text: "Test 1",
                disabled: false
              },
              {
                id: "test-2",
                display_text: "Test 2",
                disabled: true
              },
              {
                id: "test-3",
                display_text: "Test 3",
                disabled: true
              }
            ];

            expect(
              selectors.getOptions(OPTION_TYPES.USER_GROUP_PERMITTED)(stateWithManagedReportScope, {
                source: OPTION_TYPES.USER_GROUP_PERMITTED
              })
            ).toEqual(expected);
          });
        });
      });
    });
  });

  describe("when optionStringsSource is AGENCY_CURRENT_USER", () => {
    it("should disabled the agencies that are not permitted for the current user", () => {
      const options = selectors.getOptions(OPTION_TYPES.AGENCY_CURRENT_USER)(stateWithLookups, {
        source: OPTION_TYPES.AGENCY_CURRENT_USER,
        optionStringsSourceIdKey: "unique_id"
      });

      const expected = [
        { id: "agency-1", display_text: "Agency 1", unique_id: "agency-1", disabled: false },
        { id: "agency-2", display_text: "Agency 2", unique_id: "agency-2", disabled: true }
      ];

      expect(options).toEqual(expected);
    });
  });

  describe("when optionStringsSource is ROLE_PERMITTED", () => {
    it("should disabled the roles that are not permitted for the current user", () => {
      const options = selectors.getOptions(OPTION_TYPES.ROLE_PERMITTED)(stateWithLookups, {
        source: OPTION_TYPES.ROLE_PERMITTED
      });

      const expected = [
        { id: "role-1", display_text: "Role 1", disabled: false },
        { id: "role-2", display_text: "Role 2", disabled: true }
      ];

      expect(options).toEqual(expected);
    });
  });

  describe("when the optionStringsSource is MANAGED_ROLE_FORM_SECTIONS", () => {
    it("should return the managed form sections for the role uniqueID", () => {
      const options = selectors.getOptions(OPTION_TYPES.MANAGED_ROLE_FORM_SECTIONS)(stateWithLookups, {
        uniqueID: "role-1"
      });

      expect(options).toEqual(fromJS(["basic_identity", "notes"]));
    });
  });

  describe("when optionStringsSource is LINKED_INCIDENTS", () => {
    it("should return the incidents linked to the selected case", () => {
      const expected = [
        {
          disabled: false,
          display_text: "2021-04-10 - Type 1 - 2151a",
          id: "0001-2151a"
        }
      ];

      expect(
        selectors.getOptions(OPTION_TYPES.LINKED_INCIDENTS)(stateWithLookups, {
          source: OPTION_TYPES.LINKED_INCIDENTS,
          localizeDate: value => value
        })
      ).toEqual(expected);
    });
  });

  describe("when optionStringsSource is REPORTING_LOCATIONS", () => {
    it("should return the reporting location options", () => {
      const options = selectors.getOptions(OPTION_TYPES.REPORTING_LOCATIONS)([
        stateWithLookups,
        {
          source: OPTION_TYPES.REPORTING_LOCATIONS
        }
      ]);

      const expected = [
        { id: "MCMP1MD1", display_text: "MyDistrict1", admin_level: 2, disabled: false },
        { id: "MCMP2MD2", display_text: "MyDistrict2", admin_level: 2, disabled: false }
      ];

      expect(options).toEqual(expected);
    });
    it("should return reporting location options with full location name", () => {
      const options = selectors.getOptions(OPTION_TYPES.REPORTING_LOCATIONS)([
        stateWithLookups,
        {
          source: OPTION_TYPES.REPORTING_LOCATIONS,
          usePlacename: false
        }
      ]);

      const expected = [
        { id: "MCMP1MD1", display_text: "MyCountry:MyProvince1:MyDistrict1", admin_level: 2, disabled: false },
        { id: "MCMP2MD2", display_text: "MyCountry:MyProvince2:MyDistrict2", admin_level: 2, disabled: false }
      ];

      expect(options).toEqual(expected);
    });
  });

  describe("getFormGroupLookups", () => {
    const lookups = [
      {
        unique_id: "lookup-form-group-cp-case",
        name: { en: "Lookup 1" },
        values: []
      },
      {
        unique_id: "lookup-form-group-cp-incident",
        name: { en: "Lookup 2" },
        values: []
      },
      {
        unique_id: "lookup-form-group-gbv-incident",
        name: { en: "Lookup 3" },
        values: []
      }
    ];
    const stateWithLookupsFormGroup = fromJS({
      forms: {
        options: {
          lookups
        }
      }
    });

    it("should return formGroups lookups", () => {
      const source = "FormGroupLookup";
      const result = selectors.getOptions(source)(stateWithLookupsFormGroup, { source });

      expect(result).toEqual(lookups);
    });
  });

  describe("when the lookup has tags", () => {
    it("should return the lookup values with the tags", () => {
      const source = "lookup lookup-violence-type";
      const result = selectors.getOptions(source)(stateWithLookups, { source });

      expect(result).toEqual([{ id: "type1", display_text: "Type 1", disabled: false, tags: ["low"] }]);
    });
  });

  describe("when optionStringsSource is ROLE_REFERRAL_AUTHORIZATION", () => {
    const stateWithReferralAuthorizationRoles = fromJS({
      application: {
        referralAuthorizationRoles: { data: [{ id: 1, unique_id: "role-authorized-1", name: "Authorized Role 1" }] }
      }
    });

    it("returns the referralAuthorizationRoles", () => {
      const source = OPTION_TYPES.ROLE_REFERRAL_AUTHORIZATION;
      const result = selectors.getOptions(source)(stateWithReferralAuthorizationRoles, { source });

      expect(result).toEqual([{ id: "role-authorized-1", display_text: "Authorized Role 1" }]);
    });
  });
});
