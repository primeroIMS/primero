import { fromJS } from "immutable";
import { List } from "@material-ui/core";

import { setupMountedComponent } from "../../../../test";
import ListFlagsItem from "../list-flags-item";
import { FlagRecord } from "../../records";

import ListFlags from "./component";

describe("<ListFlags />", () => {
  let component;

  const props = {
    recordType: "cases",
    record: "230590"
  };

  const initialState = fromJS({
    records: {
      flags: {
        data: [
          FlagRecord({
            id: 7,
            record_id: "230590",
            record_type: "cases",
            date: "2019-08-01",
            message: "This is a flag 1",
            flagged_by: "primero",
            removed: false
          })
        ]
      }
    }
  });

  beforeEach(() => {
    ({ component } = setupMountedComponent(ListFlags, props, initialState));
  });

  it("should render the ListFlags", () => {
    expect(component.find(ListFlags)).to.have.lengthOf(1);
  });

  it("renders component with valid props", () => {
    const listFlagsProps = { ...component.find(ListFlags).props() };

    ["record", "recordType"].forEach(property => {
      expect(listFlagsProps).to.have.property(property);
      delete listFlagsProps[property];
    });
    expect(listFlagsProps).to.be.empty;
  });

  it("should render List", () => {
    expect(component.find(List)).to.have.lengthOf(1);
  });

  it("renders ListFlagsItem", () => {
    expect(component.find(ListFlagsItem)).to.have.lengthOf(1);
  });
});
