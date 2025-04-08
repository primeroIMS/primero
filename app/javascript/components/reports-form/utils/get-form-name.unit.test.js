// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import getFormName from "./get-form-name";

describe("<ReportForm>/utils/getFormName()", () => {
  it("returns the form name if the selectedRecordType starts with the word reportable", () => {
    const expected = "services";

    expect(getFormName("reportable_service")).toEqual(expected);
  });

  it("returns empty string if the selectedRecordType does not starts with the word reportable", () => {
    expect(getFormName("test")).toHaveLength(0);
  });
});
