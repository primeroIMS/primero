import { getColumns } from "./utils";

describe("configurations-list/utils.js", () => {
  it("should return default columns", () => {
    const i18n = { t: value => value };

    const expected = [
      { name: "name", label: "configurations.attributes.name" },
      { name: "version", label: "configurations.attributes.version" },
      { name: "description", label: "configurations.attributes.description" },
      { name: "created_on", label: "configurations.attributes.date_created" },
      { name: "applied_on", label: "configurations.attributes.last_applied_on" }
    ];

    const result = getColumns(i18n);

    expect(result).to.deep.equals(expected);
  });
});
