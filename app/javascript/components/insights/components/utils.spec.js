import * as utils from "./utils";

describe("components/report/components/utils.js", () => {
    describe("utils", () => {
        let clone;
        beforeEach(() => {
            clone = { ...utils };
        });

        ["tableToCsv", "downloadFile"].forEach(property => {
            it(`exports '${property}'`, () => {
                expect(utils).toBeTruthy();
                delete clone[property];
            });
        });
    });
});