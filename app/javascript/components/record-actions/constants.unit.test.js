// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

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
      "RECORD_ACTION_ABILITIES",
      "MARK_FOR_OFFLINE_DIALOG",
      "FILTERS_TO_SKIP",
      "LINK_INCIDENT_TO_CASE_DIALOG"
    ].forEach(property => {
      expect(constants).toHaveProperty(property);
      delete constants[property];
    });

    expect(Object.keys(constants)).toHaveLength(0);
  });
  describe("when is RECORD_ACTION_ABILITIES", () => {
    it("should be an object", () => {
      expect(typeof recordConstants.RECORD_ACTION_ABILITIES).toEqual("object");
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
        "canTransfer",
        "canMarkForOffline",
        "canVerify",
        "canLinkIncidentToCase"
      ].forEach(property => {
        expect(recordActionAbilities).toHaveProperty(property);
        delete recordActionAbilities[property];
      });

      expect(Object.keys(recordActionAbilities)).toHaveLength(0);
    });
  });
});
