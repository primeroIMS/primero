import { columns } from "./utils";

describe("<LookupsList /> pages/admin/utils", () => {
  it("should return default columns", () => {
    const i18n = { t: value => value };

    const expected = [
      { label: "id", name: "id", options: { display: false } },
      { label: "lookup.name", name: "name", options: {} },
      { label: "lookup.values", name: "values", options: { sort: false } }
    ];

    const result = columns(i18n);

    expect(JSON.stringify(result)).to.be.deep.equals(JSON.stringify(expected));
  });

  it("should return a customBodyRender", () => {
    const i18n = { t: value => value };
    const css = { lookupName: "", truncateValues: "" };
    const tableMeta = { rowIndex: 0 };

    const result = columns(i18n, css);

    expect(result[1].options.customBodyRender("test", tableMeta).type).to.be.equals("div");
    expect(result[2].options.customBodyRender("test", tableMeta).type).to.be.equals("div");
    expect(result[1].options.customBodyRender("test", tableMeta).props.children).to.be.equals("test");
  });
});
