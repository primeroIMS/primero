import * as recordConstants from "./constants";

describe("<RecordActions /> - Constants", () => {
  it("should have known constant", () => {
    const constants = { ...recordConstants };

    [
      "APPROVAL_DIALOG",
      "APPROVAL_TYPE",
      "ASSIGN_DIALOG",
      "EXPORT_DIALOG",
      "ENABLED_FOR_ONE",
      "ENABLED_FOR_ONE_MANY",
      "ENABLED_FOR_ONE_MANY_ALL",
      "INCIDENT_DIALOG",
      "REFER_DIALOG",
      "REQUEST_APPROVAL_DIALOG",
      "REQUEST_TYPE",
      "SERVICE_DIALOG",
      "TRANSFER_DIALOG",
      "ID_SEARCH",
      "NOTES_DIALOG",
      "ENABLE_DISABLE_DIALOG",
      "OPEN_CLOSE_DIALOG",
      "ONE",
      "MANY",
      "ALL",
      "RECORD_ACTION_ABILITIES"
    ].forEach(property => {
      expect(constants).to.have.property(property);
      delete constants[property];
    });

    expect(constants).to.be.empty;
  });
  context("when is RECORD_ACTION_ABILITIES", () => {
    it("should be an object", () => {
      expect(recordConstants.RECORD_ACTION_ABILITIES).to.be.an("object");
    });
    it("should have the properties", () => {
      const recordActionAbilities = { ...recordConstants.RECORD_ACTION_ABILITIES };

      [
        "canAddIncident",
        "canAddNotes",
        "canAddService",
        "canApprove",
        "canApproveActionPlan",
        "canApproveBia",
        "canApproveCasePlan",
        "canApproveClosure",
        "canApproveGbvClosure",
        "canAssign",
        "canCreateIncident",
        "canClose",
        "canEnable",
        "canOnlyExportPdf",
        "canRefer",
        "canReopen",
        "canRequest",
        "canRequestActionPlan",
        "canRequestBia",
        "canRequestCasePlan",
        "canRequestClosure",
        "canRequestGbvClosure",
        "canShowExports",
        "canTransfer"
      ].forEach(property => {
        expect(recordActionAbilities).to.have.property(property);
        delete recordActionAbilities[property];
      });

      expect(recordActionAbilities).to.be.empty;
    });
  });
});
