import { Menu } from "@material-ui/core";

import { expect, setupMountedComponent } from "../../../../../test";

import SubformMenu from "./component";

describe("<SubformMenu />", () => {
  const props = {
    setReferral: referral => referral,
    values: [
      {
        service_type: "service_1",
        location: "location_1",
        transitioned_to: "user_1",
        service_record_id: "service_id_1",
        service_status_referred: false
      }
    ],
    index: 0
  };

  let component;

  beforeEach(() => {
    ({ component } = setupMountedComponent(SubformMenu, props, {}));
  });

  it("renders the subform menu", () => {
    expect(component.find(Menu)).lengthOf(1);
  });
});
