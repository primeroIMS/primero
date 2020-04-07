import { headersToColumns } from "./helper";

describe("headersToColumns", () => {
  it("should conver the headers to columns", () => {
    const i18n = { t: value => value };
    const expected = [
      {
        label: "Name",
        name: "name"
      },
      {
        label: "Description",
        name: "description"
      }
    ];
    const headers = [
      {
        name: "Name",
        field_name: "name"
      },
      {
        name: "Description",
        field_name: "description"
      }
    ];

    const result = headersToColumns(headers, i18n);

    expect(result).to.be.deep.equal(expected);
  });
});
