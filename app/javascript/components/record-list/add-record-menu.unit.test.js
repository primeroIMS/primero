import { fromJS } from "immutable";
import { Menu, Button } from "@material-ui/core";

import { setupMountedComponent } from "../../test";
import { RECORD_PATH } from "../../config";
import { PrimeroModuleRecord } from "../application/records";

import AddRecordMenu from "./add-record-menu";
import CreateRecordDialog from "./create-record-dialog";

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
          name: "T1",
          options: {
            search_and_create_workflow: false,
            data_protection_case_create_field_names: []
          }
        }),
        PrimeroModuleRecord({
          unique_id: "primerotest-2",
          name: "T2"
        }),
        PrimeroModuleRecord({
          unique_id: "primerotest-3",
          name: "T3",
          options: { allow_searchable_ids: true }
        })
      ]
    }
  });

  it("renders a single <Button /> because user only has access to a single module", () => {
    const { component } = setupMountedComponent(AddRecordMenu, props, state);

    expect(component.find(Button)).to.have.lengthOf(1);
  });

  it("renders a single <Menu /> because user has access more than one module", () => {
    const { component } = setupMountedComponent(
      AddRecordMenu,
      props,
      state.merge(fromJS({ user: { modules: ["primerotest-1", "primerotest-3"] } }))
    );

    expect(component.find(Menu)).to.have.lengthOf(1);
  });

  it("opens a <CreateRecordDialog /> if module allow_searchable_ids", () => {
    const { component } = setupMountedComponent(
      AddRecordMenu,
      props,
      state.merge(fromJS({ user: { modules: ["primerotest-3"] } }))
    );

    component.find(Button).simulate("click");
    const createRecordDialog = component.find(CreateRecordDialog);

    expect(createRecordDialog).to.have.lengthOf(1);
    expect(createRecordDialog.props().open).to.be.true;
  });

  it("does not render <CreateRecordDialog /> if module does not allow_searchable_ids", () => {
    const { component } = setupMountedComponent(
      AddRecordMenu,
      props,
      state.merge(fromJS({ user: { modules: ["primerotest-1"] } }))
    );

    component.find(Button).first().simulate("click");

    expect(component.find(CreateRecordDialog)).to.have.lengthOf(0);
  });

  it("does not render <CreateRecordDialog /> if recordType is not cases", () => {
    const { component } = setupMountedComponent(
      AddRecordMenu,
      { recordType: RECORD_PATH.tracing_requests },
      state.merge(fromJS({ user: { modules: ["primerotest-1"] } }))
    );

    component.find(Button).first().simulate("click");

    expect(component.find(CreateRecordDialog)).to.have.lengthOf(0);
  });
});
