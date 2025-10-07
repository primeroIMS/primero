// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { Map, fromJS } from "immutable";

import { GROUP_PERMISSIONS, ACTIONS } from "../permissions";

import reducer from "./reducer";
import actions from "./actions";

describe("Application - Reducers", () => {
  const defaultState = Map({});
  const codesOfConduct = {
    id: 1,
    title: "First code of conduct",
    content: "Lorem ipsum",
    created_on: "2021-03-18T14:27:59.097Z",
    created_by: "test-user"
  };

  const systemOptions = {
    show_alerts: true,
    code_of_conduct_enabled: true,
    due_date_from_appointment_date: true
  };

  it("should handle SET_USER_IDLE", () => {
    const expected = Map({ userIdle: true });

    const action = {
      type: actions.SET_USER_IDLE,
      payload: true
    };

    const newState = reducer.application(defaultState, action);

    expect(newState).toEqual(expected);
  });

  it("should handle FETCH_SYSTEM_SETTINGS_SUCCESS", () => {
    const expected = Map({
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
          creation_field_map: [],
          field_labels: {},
          age_ranges: null,
          approvals_labels: null,
          primary_age_range: null,
          field_map: [],
          list_filters: [],
          list_headers: [],
          name: "CP",
          associated_record_types: ["case", "tracing_request", "incident"],
          options: {
            allow_searchable_ids: true,
            use_workflow_case_plan: true,
            use_workflow_assessment: false,
            reporting_location_filter: true,
            use_workflow_service_implemented: true
          },
          workflows: {}
        },
        {
          unique_id: "primeromodule-gbv",
          creation_field_map: [],
          field_labels: {},
          age_ranges: null,
          approvals_labels: null,
          primary_age_range: null,
          field_map: [],
          list_filters: [],
          list_headers: [],
          name: "GBV",
          associated_record_types: ["case", "incident"],
          options: {
            user_group_filter: true
          },
          workflows: {}
        }
      ],
      defaultLocale: "en",
      auditLog: undefined,
      baseLanguage: "en",
      primeroVersion: "2.0.0.1",
      reportingLocationConfig: {
        admin_level: 2,
        field_key: "owned_by_location",
        admin_level_map: { 1: ["province"], 2: ["district"] },
        label_keys: ["district"]
      },
      fieldLabels: {},
      incidentReportingLocationConfig: {
        admin_level: 2,
        field_key: "owned_by_location",
        admin_level_map: { 1: ["province"], 2: ["district"] },
        label_keys: ["district"]
      },
      primaryAgeRange: "primero",
      exactSearchFields: { cases: ["long_id", "short_id", "case_id"] },
      phoneticSearchFields: { cases: ["name", "name_other"] },
      ageRanges: {
        primero: ["0..5", "6..11", "12..17", "18..999"]
      },
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
      codesOfConduct,
      systemOptions,
      exportRequirePassword: true
    });

    const action = {
      type: actions.FETCH_SYSTEM_SETTINGS_SUCCESS,
      payload: {
        data: {
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
              creation_field_map: [],
              field_map: [],
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
              approvals_labels: null,
              primary_age_range: null,
              name: "GBV",
              creation_field_map: [],
              field_map: [],
              associated_record_types: ["case", "incident"],
              options: {
                user_group_filter: true
              }
            }
          ],
          default_locale: "en",
          base_language: "en",
          code_of_conduct: codesOfConduct,
          primero_version: "2.0.0.1",
          reporting_location_config: {
            admin_level: 2,
            field_key: "owned_by_location",
            admin_level_map: { 1: ["province"], 2: ["district"] },
            label_keys: ["district"]
          },
          incident_reporting_location_config: {
            admin_level: 2,
            field_key: "owned_by_location",
            admin_level_map: { 1: ["province"], 2: ["district"] },
            label_keys: ["district"]
          },
          primary_age_range: "primero",
          age_ranges: {
            primero: ["0..5", "6..11", "12..17", "18..999"]
          },
          exact_search_fields: { cases: ["long_id", "short_id", "case_id"] },
          phonetic_search_fields: { cases: ["name", "name_other"] },
          export_require_password: true,
          approvals_labels: {
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
          system_options: systemOptions
        }
      }
    };

    const newState = reducer.application(defaultState, action);

    expect(newState.toJS()).toEqual(expected.toJS());
  });

  it("should handle FETCH_SYSTEM_PERMISSIONS_SUCCESS", () => {
    const expected = fromJS({
      permissions: {
        management: [GROUP_PERMISSIONS.SELF],
        resource_actions: { case: [ACTIONS.READ] }
      }
    });

    const action = {
      type: actions.FETCH_SYSTEM_PERMISSIONS_SUCCESS,
      payload: {
        data: {
          management: [GROUP_PERMISSIONS.SELF],
          resource_actions: { case: [ACTIONS.READ] }
        }
      }
    };

    const newState = reducer.application(defaultState, action);

    expect(newState).toEqual(expected);
  });

  it("should handle FETCH_USER_GROUPS_FAILURE", () => {
    const expected = Map({ errors: true });

    const action = {
      type: actions.FETCH_USER_GROUPS_FAILURE,
      payload: true
    };

    const newState = reducer.application(defaultState, action);

    expect(newState).toEqual(expected);
  });

  it("should handle FETCH_USER_GROUPS_FINISHED", () => {
    const expected = Map({ loading: false });

    const action = {
      type: actions.FETCH_USER_GROUPS_FINISHED,
      payload: false
    };

    const newState = reducer.application(defaultState, action);

    expect(newState).toEqual(expected);
  });

  it("should handle FETCH_USER_GROUPS_STARTED", () => {
    const expected = Map({
      loading: true,
      errors: false
    });

    const action = {
      type: actions.FETCH_USER_GROUPS_STARTED,
      payload: true
    };

    const newState = reducer.application(defaultState, action);

    expect(newState).toEqual(expected);
  });

  it("should handle FETCH_USER_GROUPS_SUCCESS", () => {
    const userGroups = [
      { id: 1, unique_id: "user-group-1" },
      { id: 2, unique_id: "user-group-2" }
    ];
    const expected = fromJS({
      userGroups
    });

    const action = {
      type: actions.FETCH_USER_GROUPS_SUCCESS,
      payload: { data: userGroups }
    };

    const newState = reducer.application(defaultState, action);

    expect(newState).toEqual(expected);
  });

  it("should handle FETCH_ROLES_FAILURE", () => {
    const expected = Map({ errors: true });

    const action = {
      type: actions.FETCH_ROLES_FAILURE,
      payload: true
    };

    const newState = reducer.application(defaultState, action);

    expect(newState).toEqual(expected);
  });

  it("should handle FETCH_ROLES_FINISHED", () => {
    const expected = Map({ loading: false });

    const action = {
      type: actions.FETCH_ROLES_FINISHED,
      payload: false
    };

    const newState = reducer.application(defaultState, action);

    expect(newState).toEqual(expected);
  });

  it("should handle FETCH_ROLES_SUCCESS", () => {
    const roles = [
      { id: 1, unique_id: "role-1" },
      { id: 2, unique_id: "role-2" }
    ];
    const expected = fromJS({
      roles
    });

    const action = {
      type: actions.FETCH_ROLES_SUCCESS,
      payload: { data: roles }
    };

    const newState = reducer.application(defaultState, action);

    expect(newState).toEqual(expected);
  });

  it("should handle FETCH_ROLES_STARTED", () => {
    const expected = Map({
      loading: true,
      errors: false
    });

    const action = {
      type: actions.FETCH_ROLES_STARTED,
      payload: true
    };

    const newState = reducer.application(defaultState, action);

    expect(newState).toEqual(expected);
  });

  it("should handle DISABLE_NAVIGATION", () => {
    const expected = Map({
      disabledApplication: true
    });

    const action = {
      type: actions.DISABLE_NAVIGATION,
      payload: true
    };

    const newState = reducer.application(defaultState, action);

    expect(newState).toEqual(expected);
  });

  it("should handle FETCH_SANDBOX_UI_SUCCESS", () => {
    const expected = fromJS({
      primero: {
        sandbox_ui: true
      }
    });

    const action = {
      type: actions.FETCH_SANDBOX_UI_SUCCESS,
      payload: {
        data: {
          sandbox_ui: true
        }
      }
    };

    const newState = reducer.application(defaultState, action);

    expect(newState).toEqual(expected);
  });

  it("should handle FETCH_REFERRAL_AUTHORIZATION_ROLES_STARTED", () => {
    const expected = fromJS({
      referralAuthorizationRoles: {
        loading: true,
        errors: false
      }
    });

    const action = {
      type: actions.FETCH_REFERRAL_AUTHORIZATION_ROLES_STARTED
    };

    const newState = reducer.application(defaultState, action);

    expect(newState).toEqual(expected);
  });

  it("should handle FETCH_REFERRAL_AUTHORIZATION_ROLES_SUCCESS", () => {
    const expected = fromJS({
      referralAuthorizationRoles: {
        data: [{ id: 1, unique_id: "role-authorized-1" }]
      }
    });

    const action = {
      type: actions.FETCH_REFERRAL_AUTHORIZATION_ROLES_SUCCESS,
      payload: {
        data: [{ id: 1, unique_id: "role-authorized-1" }]
      }
    };

    const newState = reducer.application(defaultState, action);

    expect(newState).toEqual(expected);
  });

  it("should handle FETCH_REFERRAL_AUTHORIZATION_ROLES_FINISHED", () => {
    const expected = fromJS({ referralAuthorizationRoles: { loading: false } });

    const action = {
      type: actions.FETCH_REFERRAL_AUTHORIZATION_ROLES_FINISHED
    };

    const newState = reducer.application(defaultState, action);

    expect(newState).toEqual(expected);
  });

  it("should handle FETCH_REFERRAL_AUTHORIZATION_ROLES_FAILURE", () => {
    const expected = fromJS({ referralAuthorizationRoles: { errors: true } });

    const action = {
      type: actions.FETCH_REFERRAL_AUTHORIZATION_ROLES_FAILURE
    };

    const newState = reducer.application(defaultState, action);

    expect(newState).toEqual(expected);
  });
});
