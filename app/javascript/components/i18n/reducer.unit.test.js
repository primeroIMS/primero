import { Map } from "immutable";

import { reducer } from "./reducer";
import { SET_LOCALE } from "./actions";

describe("I8n - Reducer", () => {
  it("should handle SET_LOCALE", () => {
    const defaultState = Map({ locale: null, dir: "ltr" });
    const expected = Map({ locale: "fr", dir: "ltr" });
    const action = {
      type: SET_LOCALE,
      payload: { locale: "fr", dir: "ltr" }
    };
    const newState = reducer(defaultState, action);

    expect(newState).to.deep.equal(expected);
  });
});
