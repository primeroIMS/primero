import { fromJS } from "immutable";

import NAMESPACE from "../namespace";

import { selectListHeaders, getSendEmailsLoading, getSendEmailsErrors } from "./selectors";

const stateWithHeaders = fromJS({
  user: {
    listHeaders: {
      users: [{ id: 1 }, { id: 2 }]
    }
  }
});

const stateWithoutHeaders = fromJS({});

describe("<UsersList /> - Selectors", () => {
  describe("selectListHeaders", () => {
    it("should return list headers", () => {
      const expected = stateWithHeaders.getIn(["user", "listHeaders", NAMESPACE]);

      const headers = selectListHeaders(stateWithHeaders, NAMESPACE);

      expect(headers).toEqual(expected);
    });

    it("should return empty object when list headers empty", () => {
      const headers = selectListHeaders(stateWithoutHeaders, NAMESPACE);

      expect(headers).toEqual(fromJS([]));
    });
  });

  describe("getSendEmailsLoading", () => {
    it("should return the loading state", () => {
      const state = fromJS({ records: { users: { sendEmails: { loading: true } } } });

      expect(getSendEmailsLoading(state)).toBe(true);
    });

    it("should return false when state is empty", () => {
      expect(getSendEmailsLoading(fromJS({}))).toBe(false);
    });
  });

  describe("getSendEmailsErrors", () => {
    it("should return the errors state", () => {
      const state = fromJS({ records: { users: { sendEmails: { errors: true } } } });

      expect(getSendEmailsErrors(state)).toBe(true);
    });

    it("should return false when state is empty", () => {
      expect(getSendEmailsErrors(fromJS({}))).toBe(false);
    });
  });
});
