import * as index from "./index";

describe("<Nav>/components/<RecordInformation>- index", () => {
  const indexValues = { ...index };

  it("should have known properties", () => {
    expect(indexValues).to.be.an("object");
    ["default", "getRecordInformationForms", "getRecordInformationFormIds", "RECORD_INFORMATION_GROUP"].forEach(
      property => {
        expect(indexValues).to.have.property(property);
        delete indexValues[property];
      }
    );
    expect(indexValues).to.be.empty;
  });
});
