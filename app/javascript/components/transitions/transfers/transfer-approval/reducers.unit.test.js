import { fromJS } from "immutable";

import reducers from "./reducers";
import actions from "./actions";

describe("<TransferApproval /> - Reducers", () => {
  const defaultState = fromJS({
    cases: {
      data: [
        {
          record_state: true,
          assigned_user_names: ["primero_cp"],
          sex: "male",
          transfer_status: "in_progress",
          owned_by_agency_id: 1,
          notes_section: [],
          date_of_birth: "1981-02-04",
          record_in_scope: true,
          case_id: "5f0c7bd6-7d84-4367-91f1-d29ad7b970f8",
          created_at: "2020-02-04T20:22:40.716Z",
          name_last: "asfd",
          name: "asdf asfd",
          alert_count: 0,
          previously_owned_by: "primero",
          case_id_display: "7b970f8",
          created_by: "primero",
          module_id: "primeromodule-cp",
          owned_by: "primero",
          reopened_logs: [],
          status: "open",
          registration_date: "2020-02-04",
          complete: true,
          type: "cases",
          id: "2fe3312b-8de2-4bd0-ab39-cdfc020f86b3",
          flag_count: 0,
          name_first: "asdf",
          short_id: "7b970f8",
          age: 39,
          workflow: "new"
        }
      ],
      errors: false
    },
    transitions: {
      data: [
        {
          id: "be62e823-4d9d-402e-aace-8e4865a4882e",
          record_id: "2fe3312b-8de2-4bd0-ab39-cdfc020f86b3",
          record_type: "case",
          created_at: "2020-02-04T20:24:49.464Z",
          notes: "",
          rejected_reason: "",
          status: "in_progress",
          type: "Transfer",
          consent_overridden: true,
          consent_individual_transfer: true,
          transitioned_by: "primero",
          transitioned_to: "primero_cp",
          service: null
        }
      ]
    }
  });

  it("should handle APPROVE_TRANSFER_SUCCESS", () => {
    const payload = {
      data: {
        status: "accepted",
        record_id: "2fe3312b-8de2-4bd0-ab39-cdfc020f86b3",
        record_type: "case",
        transitioned_to: "primero_cp",
        id: "be62e823-4d9d-402e-aace-8e4865a4882e",
        transitioned_by: "primero",
        consent_overridden: true,
        type: "Transfer",
        notes: "",
        remote: false,
        consent_individual_transfer: true,
        created_at: "2020-02-04T20:24:49.464Z",
        record_access_denied: false,
        record: {
          id: "2fe3312b-8de2-4bd0-ab39-cdfc020f86b3",
          transfer_status: "accepted",
          owned_by: "primero_cp",
          owned_by_groups: [1],
          owned_by_full_name: "CP Worker",
          assigned_user_names: [],
          previously_owned_by: "primero_cp",
          associated_user_groups: ["usergroup-primero-cp"],
          previously_owned_by_full_name: "CP Worker",
          previously_owned_by_agency: 1
        }
      }
    };

    const expected = fromJS({
      cases: {
        data: [
          {
            owned_by_groups: [1],
            record_state: true,
            assigned_user_names: [],
            sex: "male",
            transfer_status: "accepted",
            owned_by_agency_id: 1,
            notes_section: [],
            previously_owned_by_full_name: "CP Worker",
            date_of_birth: "1981-02-04",
            record_in_scope: true,
            case_id: "5f0c7bd6-7d84-4367-91f1-d29ad7b970f8",
            created_at: "2020-02-04T20:22:40.716Z",
            name_last: "asfd",
            name: "asdf asfd",
            alert_count: 0,
            previously_owned_by: "primero_cp",
            case_id_display: "7b970f8",
            owned_by_full_name: "CP Worker",
            created_by: "primero",
            module_id: "primeromodule-cp",
            associated_user_groups: ["usergroup-primero-cp"],
            owned_by: "primero_cp",
            reopened_logs: [],
            status: "open",
            registration_date: "2020-02-04",
            previously_owned_by_agency: 1,
            complete: true,
            type: "cases",
            id: "2fe3312b-8de2-4bd0-ab39-cdfc020f86b3",
            flag_count: 0,
            name_first: "asdf",
            short_id: "7b970f8",
            age: 39,
            workflow: "new"
          }
        ],
        errors: false
      },
      transitions: {
        data: [
          {
            id: "be62e823-4d9d-402e-aace-8e4865a4882e",
            record_id: "2fe3312b-8de2-4bd0-ab39-cdfc020f86b3",
            record_type: "case",
            created_at: "2020-02-04T20:24:49.464Z",
            notes: "",
            record_access_denied: false,
            rejected_reason: "",
            remote: false,
            status: "accepted",
            type: "Transfer",
            consent_overridden: true,
            consent_individual_transfer: true,
            transitioned_by: "primero",
            transitioned_to: "primero_cp",
            service: null
          }
        ]
      }
    });

    const action = {
      type: actions.APPROVE_TRANSFER_SUCCESS,
      payload
    };

    const newState = reducers(defaultState, action);

    expect(newState.toJS()).to.deep.equal(expected.toJS());
  });
});
