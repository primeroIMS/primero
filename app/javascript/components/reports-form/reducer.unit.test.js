import { fromJS } from "immutable";

import actions from "./actions";
import reducers from "./reducer";

describe("<ReportForm /> - reducers", () => {
  it("should handle CLEAR_SELECTED_REPORT", () => {
    const state = fromJS({ selectedReport: { id: 1 } });
    const expected = fromJS({
      selectedReport: {},
      errors: false
    });
    const action = {
      type: actions.CLEAR_SELECTED_REPORT
    };
    const newState = reducers(state, action);

    expect(newState).to.deep.equal(expected);
  });
});
