import { fromJS } from "immutable";

import { OPTION_TYPES } from "./constants";
import * as selectors from "./selectors";

describe("Forms - Selectors", () => {
  const i18n = {
    t: value => value,
    locale: "en"
  };

  const lookup2 = { unique_id: "lookup-2", name: { en: "Lookup 2" } };
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

  const stateWithLookups = fromJS({
    records: {
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
          lookup2
        ]
      }
    },
    application: {
      managedRoles: [
        {
          id: 1,
          unique_id: "role-1",
          name: "Role 1",
          referral: true,
          form_section_unique_ids: ["test-1"]
        },
        {
          id: 2,
          unique_id: "role-2",
          name: "Role 2",
          referral: false,
          form_section_unique_ids: ["test-1", "test-2"]
        }
      ]
    }
  });

  describe("getOptions", () => {
    it("should return all lookup types including customs", () => {
      const options = selectors.getOptions(stateWithLookups, OPTION_TYPES.LOOKUPS, i18n);

      expect(options).to.deep.equal(
        fromJS([
          {
            id: "lookup lookup-1",
            display_text: "Lookup 1",
            values: []
          },
          {
            id: "lookup lookup-2",
            display_text: "Lookup 2",
            values: []
          },
          {
            id: "Agency",
            display_text: "agency.label",
          },
          {
            id: "Location",
            display_text: "location.label",
          },
          {
            id: "User",
            display_text: "user.label"
          }
        ])
      );
    });

    it("should return the options for optionStringsText", () => {
      const optionStringsText = [
        { id: "submitted", display_text: "Submitted" },
        { id: "pending", display_text: "Pending" },
        { id: "no", display_text: "No" }
      ];
      const expected = fromJS(optionStringsText);
      const result = selectors.getOptions(stateWithLookups, null, i18n, optionStringsText);

      expect(result).to.deep.equal(expected);
    });

    it("should return the options, even if we includes other keys that are not id or display_text", () => {
      const optionStringsText = [
        { id: "submitted", display_text: "Submitted", tooltip: "Submitted tooltip" },
        { id: "pending", display_text: "Pending", tooltip: "Pending tooltip" },
        { id: "no", display_text: "No", tooltip: "No tooltip" }
      ];
      const expected = fromJS(optionStringsText);
      const result = selectors.getOptions(stateWithLookups, null, i18n, optionStringsText);

      expect(result).to.deep.equal(expected);
    });

    describe("when optionStringsSource is REFER_TO_USERS", () => {
      describe("with record", () => {
        const currRecord = fromJS({
          owned_by: "test_2"
        });

        const options = selectors.getOptions(stateWithLookups, OPTION_TYPES.REFER_TO_USERS, i18n, [], false, {
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

          expect(options.toJS()).to.deep.equal(expected);
        });
      });

      describe("without record", () => {
        const options = selectors.getOptions(stateWithLookups, OPTION_TYPES.REFER_TO_USERS, i18n);

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

          expect(options.toJS()).to.deep.equal(expected);
        });
      });
    });
  });

  describe("getLookupByUniqueId", () => {
    it("should return the lookup by unique_id", () => {
      const lookup = selectors.getLookupByUniqueId(stateWithLookups, "lookup-2");

      expect(lookup).to.deep.equal(fromJS(lookup2));
    });
  });

  describe("getManagedRoleByUniqueId", () => {
    it("should return referral roles", () => {
      const expected = fromJS({
        id: 1,
        unique_id: "role-1",
        name: "Role 1",
        referral: true,
        form_section_unique_ids: ["test-1"]
      });

      expect(selectors.getManagedRoleByUniqueId(stateWithLookups, "role-1")).to.deep.equal(expected);
    });

    it("should return an empty object if we pass an invalid unique-id", () => {
      expect(selectors.getManagedRoleByUniqueId(stateWithLookups, "role-abc")).to.be.empty;
    });
  });

  describe("getFormGroupLookups", () => {
    const lookups = [
      {
        unique_id: "lookup-form-group-cp-case",
        name: { en: "Lookup 1" }
      },
      {
        unique_id: "lookup-form-group-cp-incident",
        name: { en: "Lookup 2" }
      },
      {
        unique_id: "lookup-form-group-gbv-incident",
        name: { en: "Lookup 3" }
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
      const result = selectors.getOptions(stateWithLookupsFormGroup, "FormGroupLookup", i18n);

      expect(result).to.deep.equal(fromJS(lookups));
    });
  });
});
