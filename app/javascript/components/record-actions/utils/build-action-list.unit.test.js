// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.
import { RECORD_PATH } from "../../../config";

import buildActionList from "./build-action-list";

describe("record-actions/utils/build-action-list", () => {
  const i18n = {
    t: t => t
  };

  const requestsApproval = [
    {
      name: "SER",
      condition: true,
      recordType: "all",
      value: "assessment"
    },
    {
      name: "Case Plan",
      condition: true,
      recordType: "all",
      value: "case_plan"
    }
  ];

  const approvals = [
    {
      name: "SER",
      condition: false,
      recordType: "all",
      value: "assessment"
    },
    {
      name: "Case Plan",
      condition: false,
      recordType: "all",
      value: "case_plan"
    }
  ];

  it("should be a function", () => {
    expect(buildActionList).toBeInstanceOf(Function);
  });

  it("should return the actionlist", () => {
    const params = {
      approvals,
      canAddIncident: true,
      hasIncidentSubform: true,
      canAddNotes: true,
      canAddService: true,
      hasServiceSubform: true,
      canApprove: false,
      canAssign: true,
      canCreateIncident: false,
      canEnable: false,
      canOnlyExportPdf: true,
      canOpenOrClose: false,
      canRefer: false,
      canRequest: true,
      canShowExports: true,
      canTransfer: false,
      dispatch: () => {},
      enableState: "enable",
      handleDialogClick: () => {},
      i18n,
      isIdSearch: false,
      isShow: true,
      openState: "reopen",
      recordType: "cases",
      requestsApproval,
      showListAction: true
    };

    const response = buildActionList(params);

    expect(Object.keys(response).length).toBe(2);
    expect(response.actions.length).toBe(4);
    expect(Object.keys(response.dialogs)).toEqual([
      "referral",
      "assign",
      "transfer",
      "openClose",
      "enableDisable",
      "incidentDialog",
      "serviceDialog",
      "notes",
      "requestApproval",
      "approve",
      "export",
      "markForOffline",
      "linkIncidentToCase"
    ]);
  });

  describe("when is assign for Incident", () => {
    it("should return the actionlist", () => {
      const params = {
        recordType: RECORD_PATH.incidents,
        i18n,
        requestsApproval,
        approvals,
        enableState: "enable",
        canAddIncident: false,
        canAddNotes: false,
        canAddService: false,
        canApprove: false,
        canAssign: true,
        canCreateIncident: false,
        canEnable: false,
        canOnlyExportPdf: false,
        canOpenOrClose: false,
        canRefer: false,
        canRequest: false,
        canShowExports: true,
        canTransfer: false,
        canMarkForOffline: false
      };

      const response = buildActionList(params);

      expect(response.actions.map(action => action.name)).toEqual([
        "buttons.reassign forms.record_types.incident",
        "actions.enable",
        "incidents.export",
        "incident.link_incident_to_case"
      ]);
    });
  });
});
