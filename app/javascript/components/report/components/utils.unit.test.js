// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as utils from "./utils";

describe("components/report/components/utils.js", () => {
  describe("utils", () => {
    let clone;

    beforeAll(() => {
      clone = { ...utils };
    });

    afterAll(() => {
      expect(Object.keys(clone)).toHaveLength(0);
    });

    ["escapeCsvText", "downloadFile", "tableToCsv"].forEach(property => {
      it(`exports '${property}'`, () => {
        expect(utils).toHaveProperty(property);
        delete clone[property];
      });
    });
  });

  describe("tableToCsv", () => {
    describe("when is a merged table", () => {
      const globalDocument = global.document;

      beforeEach(() => {
        global.document = {};
        global.document.querySelectorAll = parentSelector => {
          if (parentSelector === "tr td") {
            return [{ colSpan: 2 }];
          }

          return [
            {
              querySelectorAll: selector => {
                if (selector === "th") {
                  return [
                    { colSpan: 3, innerText: "Header 1" },
                    { colSpan: 1, innerText: "Total" }
                  ];
                }

                return [];
              }
            },
            {
              querySelectorAll: selector => {
                if (selector === "th") {
                  return [
                    { colSpan: 1, innerText: "Column 1" },
                    { colSpan: 1, innerText: "Column 2" },
                    { colSpan: 1, innerText: "Column Total" },
                    { colSpan: 1, innerText: "" }
                  ];
                }

                return [];
              }
            },
            {
              querySelectorAll: selector => {
                if (selector === "tr td") {
                  return [
                    { colSpan: 3, innerText: "Group 1" },
                    { colSpan: 1, innerText: "8" }
                  ];
                }

                return [];
              }
            },
            {
              querySelectorAll: selector => {
                if (selector === "tr td") {
                  return [
                    { colSpan: 1, innerText: "Value 1" },
                    { colSpan: 1, innerText: "1" },
                    { colSpan: 1, innerText: "1" },
                    { colSpan: 1, innerText: "1" }
                  ];
                }

                return [];
              }
            },
            {
              querySelectorAll: selector => {
                if (selector === "tr td") {
                  return [
                    { colSpan: 3, innerText: "Group 2" },
                    { colSpan: 1, innerText: "8" }
                  ];
                }

                return [];
              }
            },
            {
              querySelectorAll: selector => {
                if (selector === "tr td") {
                  return [
                    { colSpan: 1, innerText: "Value 2" },
                    { colSpan: 1, innerText: "2" },
                    { colSpan: 1, innerText: "2" },
                    { colSpan: 1, innerText: "2" }
                  ];
                }

                return [];
              }
            }
          ];
        };
      });

      it("creates a csv for merged columns and rows", () => {
        const expected = [
          ',"Header 1","Header 1","Header 1","Total"',
          ',"Column 1","Column 2","Column Total",""',
          '"Group 1",,,,"8"',
          '"Group 1","Value 1","1","1","1"',
          '"Group 2",,,,"8"',
          '"Group 2","Value 2","2","2","2"'
        ];

        expect(utils.tableToCsv().split("\n")).toEqual(expected);
      });

      afterEach(() => {
        global.document = globalDocument;
      });
    });
  });

  describe("escapeCsvText", () => {
    it("returns a escaped text for csv", () => {
      expect(utils.escapeCsvText('"GBV" Survivor')).toBe('"""GBV"" Survivor"');
      expect(utils.escapeCsvText("Survivor, Proctected and Released")).toBe('"Survivor, Proctected and Released"');
    });
  });
});
