import { fromJS } from "immutable";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";

import { TEXT_FIELD, DATE_FIELD } from "../../../../../../form";
import { setupMountedComponent } from "../../../../../../../test";

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
    const { component } = setupMountedComponent(FieldRow, props, fromJS([]));

    expect(component.find(CheckIcon)).to.have.lengthOf(1);
    expect(component.find(ClearIcon)).to.have.lengthOf(0);
  });

  it("should render the not clear icon if the field does not match and is not text field", () => {
    const dateValue = "2020-01-01";
    const props = {
      field: { name: "field_1", type: DATE_FIELD, display_name: { en: "Value 1" } },
      traceValue: dateValue,
      caseValue: dateValue,
      match: "mismatch"
    };
    const { component } = setupMountedComponent(FieldRow, props, fromJS([]));

    expect(component.find(CheckIcon)).to.have.lengthOf(0);
    expect(component.find(ClearIcon)).to.have.lengthOf(1);
  });

  it("should not render the icons if the field is a text field", () => {
    const dateValue = "2020-01-01";
    const props = {
      field: { name: "field_1", type: TEXT_FIELD, display_name: { en: "Value 1" } },
      traceValue: dateValue,
      caseValue: dateValue,
      match: "match"
    };
    const { component } = setupMountedComponent(FieldRow, props, fromJS([]));

    expect(component.find(CheckIcon)).to.have.lengthOf(0);
    expect(component.find(ClearIcon)).to.have.lengthOf(0);
  });
});
