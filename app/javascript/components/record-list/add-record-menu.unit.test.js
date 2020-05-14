import { fromJS } from "immutable";
import { Menu, Button } from "@material-ui/core";

import { setupMountedComponent } from "../../test";
import { RECORD_PATH } from "../../config";
import { PrimeroModuleRecord } from "../application/records";

import AddRecordMenu from "./add-record-menu";

describe("<AddRecordMenu /> record-list/add-record-menu", () => {
  const props = {
    recordType: RECORD_PATH.cases
  };
  const state = fromJS({
    user: {
      modules: ["primerotest-1"]
    },
    application: {
      modules: [
        PrimeroModuleRecord({
          unique_id: "primerotest-1",
          name: "T1"
        }),
        PrimeroModuleRecord({
          unique_id: "primerotest-2",
          name: "T2"
        }),
        PrimeroModuleRecord({
          unique_id: "primerotest-3",
          name: "T3"
        })
      ]
    }
  });

  it("renders a single <Button /> because user only has access to a single module", () => {
    const { component } = setupMountedComponent(AddRecordMenu, props, state);

    expect(component.find(Button)).to.have.lengthOf(1);
  });

  it("renders a single <Menu /> because user has access more than one module", () => {
    const { component } = setupMountedComponent(AddRecordMenu, props, {
      ...state,
      user: { modules: ["primerotest-1", "primerotest-3"] }
    });

    expect(component.find(Menu)).to.have.lengthOf(1);
  });
});
