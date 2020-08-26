import { getColumns } from "./utils";

describe("configurations-list/utils.js", () => {
  it("should return default columns", () => {
    const i18n = { t: value => value };

    const expected = [
      { name: "name", label: "configurations.columns.name" },
      { name: "version", label: "configurations.columns.version" },
      { name: "description", label: "configurations.columns.description" },
      { name: "date_created", label: "configurations.columns.date_created" },
      { name: "last_applied_on", label: "configurations.columns.last_applied_on" }
    ];

    const result = getColumns(i18n);

    expect(result).to.deep.equals(expected);
  });
});
