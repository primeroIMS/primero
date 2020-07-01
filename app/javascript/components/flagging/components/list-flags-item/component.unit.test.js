import { fromJS } from "immutable";
import { ListItem, ListItemText, Divider } from "@material-ui/core";
import FlagIcon from "@material-ui/icons/Flag";

import { setupMountedComponent } from "../../../../test";
import { UserArrowIcon } from "../../../../images/primero-icons";
import { FormAction } from "../../../form";
import ActionButton from "../../../action-button";

import ListFlagsItem from "./component";

describe("<ListFlagsItem />", () => {
  let component;

  const props = {
    flag: {
      id: 7,
      record_id: "d6a6dbb4-e5e9-4720-a661-e181a12fd3a0",
      record_type: "cases",
      date: "2019-08-01",
      message: "This is a flag 1",
      flagged_by: "primero",
      removed: false
    },
    handleDelete: () => {}
  };

  const initialState = fromJS({
    user: {
      username: "primero"
    }
  });

  beforeEach(() => {
    ({ component } = setupMountedComponent(ListFlagsItem, props, initialState));
  });

  it("should render the ListFlagsItem", () => {
    expect(component.find(ListFlagsItem)).to.have.lengthOf(1);
  });

  it("should render the ListItem", () => {
    expect(component.find(ListItem)).to.have.lengthOf(1);
  });

  it("should render the ListItemText", () => {
    expect(component.find(ListItemText)).to.have.lengthOf(1);
  });
  it("should render the FlagIcon", () => {
    expect(component.find(FlagIcon)).to.have.lengthOf(1);
  });

  it("should render the UserArrowIcon", () => {
    expect(component.find(UserArrowIcon)).to.have.lengthOf(1);
  });

  it("should render the Divider", () => {
    expect(component.find(Divider)).to.have.lengthOf(2);
  });

  it("should render the ActionButton", () => {
    expect(component.find(ActionButton)).to.have.lengthOf(1);
  });

  it("renders FormAction", () => {
    expect(component.find(FormAction)).to.have.lengthOf(1);
  });

  it("renders component with valid props", () => {
    const listFlagsItemProps = { ...component.find(ListFlagsItem).props() };

    ["flag", "handleDelete"].forEach(property => {
      expect(listFlagsItemProps).to.have.property(property);
      delete listFlagsItemProps[property];
    });
    expect(listFlagsItemProps).to.be.empty;
  });
});
