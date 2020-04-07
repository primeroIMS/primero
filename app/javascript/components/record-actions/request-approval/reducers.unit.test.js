import { fromJS } from "immutable";

import reducers from "./reducers";
import { APPROVE_RECORD_SUCCESS } from "./actions";

describe("<RequestApproval /> - Reducers", () => {
  const defaultState = fromJS({
    data: [
      {
        id: "10",
        sex: "male",
        owned_by_agency_id: 1,
        record_in_scope: true,
        created_at: "2020-01-22T19:49:46.582Z",
        name: "asdf fds",
        alert_count: 2,
        case_id_display: "f64d9c7",
        owned_by: "primero",
        status: "open",
        registration_date: "2020-01-22",
        flag_count: 0,
        short_id: "f64d9c7",
        age: 33,
        workflow: "new"
      }
    ]
  });

  it("should handle APPROVE_RECORD_SUCCESS", () => {
    const payload = {
      data: {
        record: {
          id: "10",
          approval_subforms: [
            {
              unique_id: "c3951814-d23c-49e2-a5f1-e28573f78a12",
              requested_by: "primero",
              approval_date: "2020-01-22",
              approval_status: "requested",
              approval_requested_for: "bia"
            }
          ]
        }
      }
    };
    const expected = fromJS({
      data: [
        {
          id: "10",
          sex: "male",
          owned_by_agency_id: 1,
          record_in_scope: true,
          created_at: "2020-01-22T19:49:46.582Z",
          name: "asdf fds",
          approval_subforms: [
            {
              unique_id: "c3951814-d23c-49e2-a5f1-e28573f78a12",
              requested_by: "primero",
              approval_date: "2020-01-22",
              approval_status: "requested",
              approval_requested_for: "bia"
            }
          ],
          alert_count: 2,
          case_id_display: "f64d9c7",
          owned_by: "primero",
          status: "open",
          registration_date: "2020-01-22",
          flag_count: 0,
          short_id: "f64d9c7",
          age: 33,
          workflow: "new"
        }
      ],
      errors: false
    });

    const action = {
      type: `cases/${APPROVE_RECORD_SUCCESS}`,
      payload
    };

    const newState = reducers("cases")(defaultState, action);

    expect(newState).to.deep.equal(expected);
  });
});
