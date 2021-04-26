import buildActionList from "./build-action-list";

describe("record-actions/utils/build-action-list", () => {
  it("should be a function", () => {
    expect(buildActionList).to.be.an("function");
  });

  it("should return the actionlist", () => {
    const params = {
      approvals: [
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
      ],
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
      i18n: {
        t: t => t
      },
      isIdSearch: false,
      isShow: true,
      openState: "reopen",
      recordType: "cases",
      requestsApproval: [
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
      ],
      showListAction: true
    };

    const response = buildActionList(params);

    expect(Object.keys(response).length).to.be.equal(2);
    expect(response.actions.length).to.be.equal(4);
    expect(Object.keys(response.dialogs)).to.deep.equal([
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
      "export"
    ]);
  });
});
