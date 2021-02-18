import * as utils from "./utils";

describe("transitions/utils", () => {
  describe("fetchRecordCallback", () => {
    it("should return the correct object", () => {
      const expected = {
        action: "recordType1/RECORD",
        api: {
          path: "recordType1/10",
          db: {
            collection: "records",
            id: "10",
            recordType: "recordType1"
          },
          failureCallback: [
            {
              action: "recordType1/REDIRECT",
              redirect: "/cases",
              redirectWithIdFromResponse: false
            }
          ],
          successCallback: [
            {
              action: "recordType1/REDIRECT",
              redirect: "/cases",
              redirectWithIdFromResponse: true
            }
          ]
        }
      };

      expect(utils.fetchRecordCallback({ recordType: "recordType1", recordId: "10" })).to.deep.equal(expected);
    });
  });
});
