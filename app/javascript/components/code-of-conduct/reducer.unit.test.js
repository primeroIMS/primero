import { fromJS } from "immutable";

import reducer from "./reducer";
import actions from "./actions";

describe("components/connectivity/reducer.js", () => {
  const defaultState = fromJS({});

  it("should handle ACCEPT_CODE_OF_CONDUCT_STARTED", () => {
    const expected = fromJS({
      updatingCodeOfConduct: true
    });

    const action = {
      type: actions.ACCEPT_CODE_OF_CONDUCT_STARTED,
      payload: true
    };

    const newState = reducer(defaultState, action);

    expect(newState).to.eql(expected);
  });

  it("should handle ACCEPT_CODE_OF_CONDUCT_SUCCESS", () => {
    const expected = fromJS({
      updatingCodeOfConduct: false,
      codeOfConductId: 1
    });

    const action = {
      type: actions.ACCEPT_CODE_OF_CONDUCT_SUCCESS,
      payload: {
        data: {
          code_of_conduct_id: 1
        }
      }
    };

    const newState = reducer(defaultState, action);

    expect(newState).to.eql(expected);
  });
});
