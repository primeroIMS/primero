import { fromJS } from "immutable";

import { getCodeOfConduct, getLoadingCodeOfConduct } from "./selectors";

const codeOfConduct = fromJS({ id: 1, title: "Some Title", content: "Some Content" });

const stateWithHeaders = fromJS({ records: { codeOfConduct: { data: codeOfConduct }, loading: false } });

describe("pages/admin/<CodeOfConduct />- Selectors", () => {
  describe("getCodeOfConduct", () => {
    it("should return the code of conduct", () => {
      const currentCodeOfConduct = getCodeOfConduct(stateWithHeaders);

      expect(currentCodeOfConduct).to.deep.equal(codeOfConduct);
    });
  });

  describe("getLoadingCodeOfConduct", () => {
    it("should return loading", () => {
      const loading = getLoadingCodeOfConduct(stateWithHeaders);

      expect(loading).to.be.false;
    });
  });
});
