import * as indexValues from "./index";

describe("<RecordForm>/form/subforms/<SubformFields>/components- index", () => {
  const clone = { ...indexValues };

  it("should have known properties", () => {
    expect(typeof clone).toEqual("object");
    ["TracingRequestStatus", "ViolationItem"].forEach(property => {
      expect(clone).toHaveProperty(property);
      delete clone[property];
    });
    expect(Object.keys(clone)).toHaveLength(0);
  });
});
