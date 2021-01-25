import { NavLink } from "react-router-dom";

import { FieldRecord } from "../records";
import { setupMockFieldComponent } from "../../../test";
import { LINK_FIELD } from "../constants";

import LinkField from "./link-field";

describe("<Form /> - fields/<LinkField />", () => {
  it("renders the link", () => {
    const { component } = setupMockFieldComponent(LinkField, FieldRecord, { type: LINK_FIELD }, {});

    expect(component.find(NavLink)).to.have.lengthOf(1);
  });
});
