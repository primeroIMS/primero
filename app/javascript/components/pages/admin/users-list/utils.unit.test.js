// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { FILTER_TYPES } from "../../../index-filters";

import { DISABLED, AGENCY, USER_GROUP, ACTION_IDS } from "./constants";
import * as helper from "./utils";

describe("<AuditLogs /> - Helpers", () => {
  describe("with exposed properties", () => {
    it("should have known methods", () => {
      const clone = { ...helper };

      ["agencyBodyRender", "buildObjectWithIds", "buildUsersQuery", "getFilters", "buildActionList"].forEach(
        property => {
          expect(clone).toHaveProperty(property);
          expect(clone[property]).toBeInstanceOf(Function);
          delete clone[property];
        }
      );
      expect(Object.keys(clone)).toHaveLength(0);
    });
  });

  describe("buildUsersQuery", () => {
    it("should convert the data to filter users", () => {
      const data = {
        agency: { id: 1, display_name: "agency_test" }
      };

      const expected = {
        agency: 1
      };

      const converted = helper.buildUsersQuery(data);

      expect(converted).toEqual(expected);
    });
  });

  describe("getFilters", () => {
    it("should return the correct object to build users filters", () => {
      const i18n = { t: value => value, locale: "en" };
      const options = fromJS([{ id: 1, name: { en: "Agency 1" } }]);

      const expected = [
        {
          name: "cases.filter_by.enabled_disabled",
          field_name: DISABLED,
          type: FILTER_TYPES.MULTI_TOGGLE,
          option_strings_source: null,
          options: {
            [i18n.locale]: [
              { id: "false", display_name: i18n.t("disabled.status.enabled") },
              { id: "true", display_name: i18n.t("disabled.status.disabled") }
            ]
          }
        },
        {
          name: "cases.filter_by.agency",
          field_name: AGENCY,
          options: [
            {
              id: 1,
              display_name: "Agency 1"
            }
          ],
          type: FILTER_TYPES.MULTI_SELECT,
          multiple: false,
          permitted_filter: false
        },
        {
          field_name: USER_GROUP,
          multiple: false,
          name: "cases.filter_by.user_group",
          options: [],
          type: FILTER_TYPES.MULTI_SELECT
        },
        {
          field_name: "last_date",
          name: "cases.filter_by.by_date",
          options: {
            en: [
              {
                display_name: "users.filters.date_last_login",
                id: "last_access"
              },
              {
                display_name: "users.filters.date_last_case_view",
                id: "last_case_viewed"
              },
              {
                display_name: "users.filters.date_last_case_updated",
                id: "last_case_updated"
              }
            ]
          },
          type: "dates"
        }
      ];

      const filterPermission = {
        agency: false
      };

      expect(helper.getFilters(i18n, options, null, filterPermission)).toEqual(expected);
    });
  });

  describe("buildActionList", () => {
    it("should return action list when canDisableMultiple is true", () => {
      const i18n = { t: value => value };
      const handleDialogClick = jest.fn();
      const canDisableMultiple = true;
      const expected = [
        {
          id: ACTION_IDS.disable,
          name: "actions.disable",
          disableOffline: true,
          condition: true,
          action: expect.any(Function)
        }
      ];

      const result = helper.buildActionList({ i18n, handleDialogClick, canDisableMultiple });

      expect(result).toEqual(expected);
    });

    it("should return empty array when canDisableMultiple is false", () => {
      const i18n = { t: value => value };
      const handleDialogClick = jest.fn();
      const canDisableMultiple = false;

      const result = helper.buildActionList({ i18n, handleDialogClick, canDisableMultiple });

      expect(result).toEqual([]);
    });

    it("should call handleDialogClick when action is executed", () => {
      const i18n = { t: value => value };
      const handleDialogClick = jest.fn();
      const canDisableMultiple = true;

      const result = helper.buildActionList({ i18n, handleDialogClick, canDisableMultiple });

      result[0].action();

      expect(handleDialogClick).toHaveBeenCalledWith("DisableDialog", "disable");
    });
  });
});
