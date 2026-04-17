import * as constants from "./constants";

describe("report/components/constants", () => {
  describe("constants", () => {
    let clone;

    beforeAll(() => {
      clone = { ...constants };
    });

    afterAll(() => {
      expect(Object.keys(clone)).toHaveLength(0);
    });

    ["DEFAULT_FILE_NAME", "NAME", "NAMESPACE"].forEach(property => {
      it(`exports '${property}'`, () => {
        expect(constants).toHaveProperty(property);
        delete clone[property];
      });
    });
  });
});
