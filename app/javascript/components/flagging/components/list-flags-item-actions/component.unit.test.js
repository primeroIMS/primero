import { fromJS } from "immutable";
import { Divider } from "@material-ui/core";

import { setupMountedComponent } from "../../../../test";
import { FormAction } from "../../../form";
import ActionButton from "../../../action-button";

import ListFlagsItemActions from "./component";

describe("<ListFlagsItemActions />", () => {
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
    }
  };

  const initialState = fromJS({
    user: {
      username: "primero"
    }
  });

  beforeEach(() => {
    ({ component } = setupMountedComponent(ListFlagsItemActions, props, initialState));
  });

  it("should render the ListFlagsItem", () => {
    expect(component.find(ListFlagsItemActions)).to.have.lengthOf(1);
  });

  it("should render the Divider", () => {
    expect(component.find(Divider)).to.have.lengthOf(1);
  });

  it("renders FormAction", () => {
    expect(component.find(FormAction)).to.have.lengthOf(1);
  });

  it("should render the ActionButton", () => {
    expect(component.find(ActionButton)).to.have.lengthOf(1);
  });

  it("renders component with valid props", () => {
    const listFlagsItemProps = {
      ...component.find(ListFlagsItemActions).props()
    };

    ["flag"].forEach(property => {
      expect(listFlagsItemProps).to.have.property(property);
      delete listFlagsItemProps[property];
    });
    expect(listFlagsItemProps).to.be.empty;
  });
});
