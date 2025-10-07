// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { getCodeOfConduct, getFetchErrorsCodeOfConduct, getLoadingCodeOfConduct } from "./selectors";

const codeOfConduct = fromJS({ id: 1, title: "Some Title", content: "Some Content" });

const fetchErrors = fromJS([{ status: 404, message: "Not Found" }]);

const stateWithHeaders = fromJS({ records: { codeOfConduct: { loading: true, data: codeOfConduct, fetchErrors } } });

describe("pages/admin/<CodeOfConduct />- Selectors", () => {
  describe("getCodeOfConduct", () => {
    it("should return the code of conduct", () => {
      const currentCodeOfConduct = getCodeOfConduct(stateWithHeaders);

      expect(currentCodeOfConduct).toEqual(codeOfConduct);
    });
  });

  describe("getLoadingCodeOfConduct", () => {
    it("should return loading", () => {
      const loading = getLoadingCodeOfConduct(stateWithHeaders);

      expect(loading).toBe(true);
    });
  });

  describe("getFetchErrorsCodeOfConduct", () => {
    it("should return the errors", () => {
      const currentFetchErrors = getFetchErrorsCodeOfConduct(stateWithHeaders);

      expect(currentFetchErrors).toEqual(fetchErrors);
    });
  });
});
