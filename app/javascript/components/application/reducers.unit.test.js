import { expect } from "chai";
import { Map, fromJS } from "immutable";

import { GROUP_PERMISSIONS, ACTIONS } from "../../libs/permissions";

import reducers from "./reducers";
import actions from "./actions";

describe("Application - Reducers", () => {
  const defaultState = Map({});

  it("should handle SET_USER_IDLE", () => {
    const expected = Map({ userIdle: true });

    const action = {
      type: actions.SET_USER_IDLE,
      payload: true
    };

    const newState = reducers.application(defaultState, action);

    expect(newState).to.deep.equal(expected);
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
          name: "GBV",
          associated_record_types: ["case", "incident"],
          options: {
            user_group_filter: true
          },
          workflows: {}
        }
      ],
      locales: ["en", "fr", "ar"],
      defaultLocale: "en",
      baseLanguage: "en",
      primeroVersion: "2.0.0.1",
      reportingLocationConfig: {
        label_key: "district",
        admin_level: 2,
        field_key: "owned_by_location"
      }
    });

    const action = {
      type: actions.FETCH_SYSTEM_SETTINGS_SUCCESS,
      payload: {
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
        default_locale: "en",
        base_language: "en",
        primero_version: "2.0.0.1",
        reporting_location_config: {
          label_key: "district",
          admin_level: 2,
          field_key: "owned_by_location"
        }
      }
    };

    const newState = reducers.application(defaultState, action);

    expect(newState.toJS()).to.eql(expected.toJS());
  });

  it("should handle NETWORK_STATUS", () => {
    const expected = Map({
      online: true
    });

    const action = {
      type: actions.NETWORK_STATUS,
      payload: true
    };

    const newState = reducers.application(defaultState, action);

    expect(newState).to.eql(expected);
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

    const newState = reducers.application(defaultState, action);

    expect(newState).to.deep.equal(expected);
  });
});
