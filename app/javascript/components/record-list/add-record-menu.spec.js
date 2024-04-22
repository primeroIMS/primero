import { fromJS } from "immutable";

import { mountedComponent, screen, userEvent } from "../../test-utils";
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
    mountedComponent(<AddRecordMenu {...props} />, state);

    expect(screen.getAllByRole("button")).toHaveLength(1);
  });

  it("renders a single <Menu /> because user has access more than one module", () => {
    mountedComponent(
      <AddRecordMenu {...props} />,
      state.merge(fromJS({ user: { modules: ["primerotest-1", "primerotest-3"] } }))
    );

    expect(screen.getByTestId("menu")).toBeInTheDocument();
  });

  it("opens a <CreateRecordDialog /> if module allow_searchable_ids", async () => {
    const user = userEvent.setup();

    mountedComponent(
      <AddRecordMenu {...{ ...props }} />,
      state.merge(fromJS({ user: { modules: ["primerotest-3"] } }))
    );
    await user.click(screen.getByText(/buttons.new/));
    expect(screen.getAllByRole("presentation")).toHaveLength(1);
  });

  it("does not render <CreateRecordDialog /> if module does not allow_searchable_ids", () => {
    mountedComponent(<AddRecordMenu {...props} />, state.merge(fromJS({ user: { modules: ["primerotest-1"] } })));
    expect(screen.queryByTestId("CreateRecordDialog")).toBeNull();
  });

  it("does not render <CreateRecordDialog /> if recordType is not cases", () => {
    mountedComponent(
      <AddRecordMenu {...{ recordType: RECORD_PATH.tracing_requests }} />,
      state.merge(fromJS({ user: { modules: ["primerotest-1"] } }))
    );

    expect(screen.queryByTestId("CreateRecordDialog")).toBeNull();
  });
});
