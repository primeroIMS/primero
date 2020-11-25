import * as utils from "./utils";

describe("subform-header-lookup/utils.js", () => {
  describe("with exposed properties", () => {
    it("should have known methods", () => {
      const clone = { ...utils };

      ["getMultiSelectValues"].forEach(property => {
        expect(clone).to.have.property(property);
        expect(clone[property]).to.be.a("function");
        delete clone[property];
      });
      expect(clone).to.be.empty;
    });
  });

  describe("getMultiSelectValues", () => {
    const values = ["test_1", "test_2"];

    it("returns correct display_text when source contains a locale", () => {
      const source = [
        {
          id: "test_1",
          display_text: {
            en: "Test 1"
          }
        },
        {
          id: "test_2",
          display_text: {
            en: "Test 2"
          }
        },
        {
          id: "test_3",
          display_text: {
            en: "Test 2"
          }
        }
      ];

      expect(utils.getMultiSelectValues(values, source, "en")).to.be.equals("Test 1, Test 2");
    });

    it("returns correct display_text when source does not contains a locale", () => {
      const source = [
        {
          id: "test_1",
          display_text: "Test 1"
        },
        {
          id: "test_2",
          display_text: "Test 2"
        },
        {
          id: "test_3",
          display_text: "Test 2"
        }
      ];

      expect(utils.getMultiSelectValues(values, source)).to.be.equals("Test 1, Test 2");
    });
  });
});
