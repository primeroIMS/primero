// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { spy } from "../../../../test";
import { SERVICE_SECTION_FIELDS } from "../../../record-actions/transitions/components/referrals";

import clearServiceFieldValue from "./clear-service-field-value";

describe("clearServiceFieldValue", () => {
  it("should call setFieldValue when filters changed and user is not selected", () => {
    const setFieldValue = spy();
    const filterState = { filtersChanged: true, userIsSelected: false };
    const fieldName = SERVICE_SECTION_FIELDS.implementingAgency;

    setFieldValue.calledWith(fieldName, null, false);

    clearServiceFieldValue({
      filterState,
      fieldName,
      serviceField: fieldName,
      setFieldValue
    });
  });
});
