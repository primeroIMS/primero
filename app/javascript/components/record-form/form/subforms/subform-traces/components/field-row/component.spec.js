import { fromJS } from "immutable";

import { TEXT_FIELD, DATE_FIELD } from "../../../../../../form";
import { mountedComponent, screen } from "../../../../../../../test-utils";

import FieldRow from "./component";

describe("<RecordForm>/form/subforms/<SubformTraces>/components/<FieldRow>", () => {
  it("should render the check icon if the field match and is not text field", () => {
    const dateValue = "2020-01-01";
    const props = {
      field: { name: "field_1", type: DATE_FIELD, display_name: { en: "Value 1" } },
      traceValue: dateValue,
      caseValue: dateValue,
      match: "match"
    };

    mountedComponent(<FieldRow {...props} />, fromJS([]));
    expect(screen.getByTestId("check-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("clear-icon")).toBeNull();
  });

  it("should render the not clear icon if the field does not match and is not text field", () => {
    const dateValue = "2020-01-01";
    const props = {
      field: { name: "field_1", type: DATE_FIELD, display_name: { en: "Value 1" } },
      traceValue: dateValue,
      caseValue: dateValue,
      match: "mismatch"
    };

    mountedComponent(<FieldRow {...props} />, fromJS([]));
    expect(screen.getByTestId("clear-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("check-icon")).toBeNull();
  });

  it("should not render the icons if the field is a text field", () => {
    const dateValue = "2020-01-01";
    const props = {
      field: { name: "field_1", type: TEXT_FIELD, display_name: { en: "Value 1" } },
      traceValue: dateValue,
      caseValue: dateValue,
      match: "match"
    };

    mountedComponent(<FieldRow {...props} />, fromJS([]));

    expect(screen.queryByTestId("check-icon")).toBeNull();
    expect(screen.queryByTestId("clear-icon")).toBeNull();
  });
});
