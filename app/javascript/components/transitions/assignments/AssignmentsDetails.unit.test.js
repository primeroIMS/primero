import { setupMountedComponent } from "../../../test";
import DisplayData from "../../display-data";

import AssignmentsDetails from "./AssignmentsDetails";

describe("<AssignmentsDetails />", () => {
  let component;
  const props = {
    transition: {
      id: "4142488e-ccd9-4ac5-a3c1-c3c0fd063fc8",
      record_id: "6b0018e7-d421-4d6b-80bf-ca4cbf488907",
      record_type: "case",
      created_at: "2019-10-21T16:13:33.890Z",
      notes: "This is a note",
      status: "done",
      type: "Assign",
      consent_overridden: false,
      consent_individual_transfer: true,
      transitioned_by: "primero",
      transitioned_to: "primero_mgr_cp"
    },
    classes: {
      spaceGrid: "testStyle",
      transtionLabel: "testStyle",
      transtionValue: "testStyle"
    }
  };

  beforeEach(() => {
    ({ component } = setupMountedComponent(AssignmentsDetails, props));
  });

  it("renders 2 <DisplayData />", () => {
    expect(component.find(DisplayData)).to.have.length(2);
  });
});
