// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as records from "./records";

describe("<ExportList/> - pages/export-list/records", () => {
  const clone = { ...records };

  it("should have known exported properties", () => {
    ["ExportRecord"].forEach(property => {
      expect(clone).to.have.property(property);
      expect(clone[property]).to.be.a("function");
      delete clone[property];
    });
    expect(clone).to.be.empty;
  });
});
