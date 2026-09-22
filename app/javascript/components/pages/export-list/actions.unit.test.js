import actions from "./actions";

describe("<ExportList /> - pages/export-list/actions", () => {
  it("should have known actions", () => {
    const clone = { ...actions };

    [
      "FETCH_EXPORTS",
      "FETCH_EXPORTS_STARTED",
      "FETCH_EXPORTS_SUCCESS",
      "FETCH_EXPORTS_FINISHED",
      "FETCH_EXPORTS_FAILURE",
      "DELETE_EXPORT",
      "DELETE_EXPORT_STARTED",
      "DELETE_EXPORT_SUCCESS",
      "DELETE_EXPORT_FINISHED",
      "DELETE_EXPORT_FAILURE"
    ].forEach(property => {
      expect(clone).toHaveProperty(property);
      delete clone[property];
    });

    expect(Object.keys(clone)).toHaveLength(0);
  });
});
