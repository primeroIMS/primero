import formatReport from "./format-report";

describe("<ReportForm>/utils/formatReport()", () => {
  const report = {
    name: "test",
    description: null,
    fields: [
      {
        name: "test_1",
        position: {
          type: "horizontal"
        }
      },
      {
        name: "test_2",
        position: {
          type: "vertical"
        }
      }
    ]
  };

  it("should return empty string for description if report doesn't have one", () => {
    expect(formatReport(report).description).to.be.empty;
  });

  it("should return aggregate_by key with an array of fields with 'horizontal' type ", () => {
    expect(formatReport(report).aggregate_by).to.deep.equal(["test_1"]);
  });

  it("should return disaggregate_by key with an array of fields with 'horizontal' type ", () => {
    expect(formatReport(report).disaggregate_by).to.deep.equal(["test_2"]);
  });

  context("when the fields have admin_level", () => {
    const reportWithAdminLevel = {
      name: "test",
      description: null,
      fields: [
        {
          admin_level: 1,
          name: "location",
          position: {
            type: "horizontal"
          }
        }
      ]
    };

    it("should return an array with a field containing the admin level as part of the string", () => {
      expect(formatReport(reportWithAdminLevel).aggregate_by).to.deep.equal(["location1"]);
    });
  });
});
