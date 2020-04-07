import { fromJS } from "immutable";

import reducers from "./reducer";
import {
  TASKS_SUCCESS,
  TASKS_STARTED,
  TASKS_FINISHED,
  TASKS_FAILURE
} from "./actions";

describe("<TaskList /> - Reducer", () => {
  it("should handle tasks/TASKS_STARTED", () => {
    const expected = fromJS({ loading: true, errors: false });
    const defaultState = fromJS({});

    const action = {
      type: TASKS_STARTED,
      payload: true
    };

    const newState = reducers.tasks(defaultState, action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle tasks/TASKS_SUCCESS", () => {
    const expected = fromJS({
      data: [
        {
          overdue: false,
          priority: null,
          record_type: "case",
          record_id_display: "da3ec93",
          detail: "health_medical_service",
          due_date: "10-Feb-2020",
          type: "service",
          id: "f54f326e-70bb-46db-a333-90c6b4b21aeb",
          type_display: "Service - Health/Medical Service",
          upcoming_soon: true
        }
      ],
      metadata: {
        total: 1,
        per: 20,
        page: 1
      }
    });
    const defaultState = fromJS({});

    const action = {
      type: TASKS_SUCCESS,
      payload: {
        data: [
          {
            record_type: "case",
            id: "f54f326e-70bb-46db-a333-90c6b4b21aeb",
            record_id_display: "da3ec93",
            type: "service",
            detail: "health_medical_service",
            priority: null,
            due_date: "10-Feb-2020",
            type_display: "Service - Health/Medical Service",
            overdue: false,
            upcoming_soon: true
          }
        ],
        metadata: {
          total: 1,
          per: 20,
          page: 1
        }
      }
    };

    const newState = reducers.tasks(defaultState, action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle tasks/TASKS_FINISHED", () => {
    const expected = fromJS({ loading: false });
    const defaultState = fromJS({});

    const action = {
      type: TASKS_FINISHED,
      payload: false
    };

    const newState = reducers.tasks(defaultState, action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle tasks/TASKS_FAILURE", () => {
    const expected = fromJS({ errors: true });
    const defaultState = fromJS({});

    const action = {
      type: TASKS_FAILURE,
      payload: false
    };

    const newState = reducers.tasks(defaultState, action);

    expect(newState).to.deep.equal(expected);
  });
});
