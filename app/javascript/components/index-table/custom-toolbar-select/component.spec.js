import { ButtonBase, Typography, TablePagination } from "@material-ui/core";
import { mountedComponent, screen } from "test-utils";
import { RECORD_PATH } from "../../../config";
import CustomToolbarSelect from "./component";

describe("<CustomToolbarSelect />", () => {
  const arrayIndex = [0, 1, 2, 3];
  const props = {
    displayData: arrayIndex,
    recordType: RECORD_PATH.cases,
    perPage: 2,
    selectedRecords: { 0: arrayIndex },
    selectedRows: { data: { length: 4 } },
    totalRecords: 7,
    page: 1,
    selectedFilters: {},
    fetchRecords: () => {}
  };

  beforeEach(() => {
    mountedComponent(<CustomToolbarSelect  {...props}/>);
  });

  it("renders Typography", () => {
    const label = screen.getByRole("heading", { level: 6 });

    expect(label).toBeInTheDocument();
    expect(label.textContent).toEqual("cases.selected_records");
  });

  it("renders TablePagination", () => {
    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  describe("when all records of the page are selected", () => {
    it("renders ButtonBase with a label to select all records", () => {
        const button = screen.getByRole("button", { name: "cases.selected_all_records" });
  
        expect(button).toBeInTheDocument();
        expect(button.textContent).toEqual("cases.selected_all_records");
    });
  });

  describe("when all records are selected", () => {
    const propsAllRecordsSelected = {
      ...props,
      selectedRecords: { 0: arrayIndex, 1: [0, 1, 2] }
    };

    beforeEach(() => {
    mountedComponent(<CustomToolbarSelect  {...propsAllRecordsSelected}/>);
    });

    it("renders ButtonBase with a label to clear selection", () => {
        const button = screen.getByRole("button", { name: "buttons.clear_selection" });
        expect(button).toBeInTheDocument();
        expect(button.textContent).toEqual("buttons.clear_selection");
    });
  });

  describe("when some records are selected", () => {
    const propRecordsSelected = {
      ...props,
      selectedRows: { data: { length: 3 } },
      selectedRecords: { 0: [0, 1, 2] }
    };

    beforeEach(() => {
      mountedComponent(<CustomToolbarSelect {...propRecordsSelected}/>);
    });

    it("should not renders ButtonBase for select_all or clear_selection", () => {
        const buttons = screen.getAllByRole("button");
        expect(buttons.length).toEqual(7);
    });
  });
});

