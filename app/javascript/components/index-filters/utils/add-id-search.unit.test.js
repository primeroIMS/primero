import addIdSearch from "./add-id-search";

describe("<IndexFilters>/utils - addIdSearch", () => {
  it("adds id_search: true when a query is searched with the default (ID) search type", () => {
    expect(addIdSearch({ query: "abc123" })).toEqual({ query: "abc123", id_search: true });
  });

  it("does not add id_search when there is no query", () => {
    expect(addIdSearch({ status: ["open"] })).toEqual({ status: ["open"] });
  });

  it("does not add id_search for a phonetic (Name) search", () => {
    expect(addIdSearch({ query: "jane doe", phonetic: true })).toEqual({ query: "jane doe", phonetic: true });
    expect(addIdSearch({ query: "jane doe", phonetic: "true" })).toEqual({ query: "jane doe", phonetic: "true" });
  });

  it("does not add id_search for a phone number search", () => {
    expect(addIdSearch({ query: "555-1234", phone_number: true })).toEqual({ query: "555-1234", phone_number: true });
  });
});
