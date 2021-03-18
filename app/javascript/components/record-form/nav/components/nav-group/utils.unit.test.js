import * as utils from "./utils";

describe("<Nav>/components/<NavGroup> - Utils", () => {
  describe("getFormGroupName", () => {
    it("should return the correct FormGroupName", () => {
      const allFormGroupsLookups = [
        {
          id: "identification_registration",
          display_text: "Identification / Registration"
        },
        {
          id: "family_partner_details",
          display_text: "Family / Partner Details"
        },
        {
          id: "record_information",
          display_text: "Record Information"
        }
      ];

      expect(utils.getFormGroupName(allFormGroupsLookups, "identification_registration")).to.be.equal(
        "Identification / Registration"
      );
    });
  });
});
