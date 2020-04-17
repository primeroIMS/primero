import { columns } from "./utils";

describe("<LookupsList /> pages/admin/utils", () => {
  it("should return default columns", () => {
    const i18n = { t: value => value };

    const expected = [
      { label: "id", name: "id", options: { display: false } },
      { label: "lookup.name", name: "name", options: {} },
      { label: "lookup.values", name: "values", options: {} }
    ];

    const result = columns(i18n);

    expect(JSON.stringify(result)).to.be.deep.equals(JSON.stringify(expected));
  });
});
