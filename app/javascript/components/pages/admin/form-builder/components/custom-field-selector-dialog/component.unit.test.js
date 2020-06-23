import { fromJS } from "immutable";
import {
  ListItemText,
  List,
  ListSubheader,
  ListItemSecondaryAction
} from "@material-ui/core";

import { setupMountedComponent } from "../../../../../../test";
import ActionDialog from "../../../../../action-dialog";
import {
  TEXT_FIELD,
  TEXT_AREA,
  TICK_FIELD,
  DATE_FIELD,
  SEPARATOR,
  NUMERIC_FIELD,
  RADIO_FIELD,
  SELECT_FIELD
} from "../../../../../form";

import CustomFieldSelectorDialog from "./component";
import { DATE_TIME_FIELD, MULTI_SELECT_FIELD } from "./constants";

describe("<CustomFieldSelectorDialog />", () => {
  let component;
  const initialState = fromJS({
    ui: { dialogs: { custom_field_selector_dialog: true } }
  });

  beforeEach(() => {
    ({ component } = setupMountedComponent(
      CustomFieldSelectorDialog,
      {},
      initialState
    ));
  });

  it("should render the CustomFieldSelectorDialog component", () => {
    expect(component.find(CustomFieldSelectorDialog)).to.have.lengthOf(1);
    expect(component.find(ActionDialog)).to.have.lengthOf(1);
  });

  it("should render list of fields types", () => {
    const fields = [
      "forms.type_label",
      `fields.${TEXT_FIELD}`,
      `fields.${TEXT_AREA}`,
      `fields.${TICK_FIELD}`,
      `fields.${SELECT_FIELD}`,
      `fields.${RADIO_FIELD}`,
      `fields.${MULTI_SELECT_FIELD}`,
      `fields.${NUMERIC_FIELD}`,
      `fields.${DATE_FIELD}`,
      `fields.${DATE_TIME_FIELD}`,
      `fields.${SEPARATOR}`
    ];

    expect(component.find(List)).to.have.lengthOf(1);
    expect(component.find(ListSubheader)).to.have.lengthOf(1);
    expect(component.find(ListSubheader).find(ListItemText).text()).to.equal(
      "forms.type_label"
    );
    expect(
      component.find(ListSubheader).find(ListItemSecondaryAction).text()
    ).to.equal("forms.select_label");
    expect(component.find(ListItemText)).to.have.lengthOf(11);
    expect(component.find(ListItemText).map(item => item.text())).to.deep.equal(
      fields
    );
  });
});
