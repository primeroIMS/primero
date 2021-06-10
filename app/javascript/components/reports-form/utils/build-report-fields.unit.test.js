import { REPORT_FIELD_TYPES } from "../constants";

import buildReportFields from "./build-report-fields";

describe("<ReportForm>/utils/buildReportFields()", () => {
  it("returns the form name if the selectedRecordType starts with the word reportable", () => {
    const expected = [
      {
        name: "test",
        position: {
          type: REPORT_FIELD_TYPES.horizontal,
          order: 0
        }
      }
    ];

    expect(buildReportFields(["test"], REPORT_FIELD_TYPES.horizontal)).to.deep.equal(expected);
  });
});
