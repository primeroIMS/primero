import { Map } from "immutable";

import { reducer } from "./reducer";
import { SET_LOCALE, SET_USER_LOCALE } from "./actions";

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

  describe("should handle SET_USER_LOCALE", () => {
    it("when user has locale defined", () => {
      const defaultState = Map({ locale: "en", dir: "ltr" });
      const expected = Map({ locale: "fr", dir: "ltr" });
      const action = {
        type: SET_USER_LOCALE,
        payload: { json: { data: { locale: "fr" } } }
      };
      const newState = reducer(defaultState, action);

      expect(newState).to.deep.equal(expected);
    });
    it("when user has not locale defined", () => {
      const defaultState = Map({ locale: "en", dir: "ltr" });
      const expected = Map({ locale: "en", dir: "ltr" });
      const action = {
        type: SET_USER_LOCALE,
        payload: {
          response: {},
          json: {
            data: {
              id: 12,
              user_name: "test"
            }
          }
        }
      };
      const newState = reducer(defaultState, action);

      expect(newState).to.deep.equal(expected);
    });
  });
});
