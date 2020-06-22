import { ButtonBase, Typography, TablePagination } from "@material-ui/core";

import { setupMountedComponent } from "../../../test";
import { RECORD_PATH } from "../../../config";

import CustomToolbarSelect from "./component";

describe("<CustomToolbarSelect />", () => {
  let component;

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
    ({ component } = setupMountedComponent(CustomToolbarSelect, props));
  });

  it("renders Typography", () => {
    const label = component.find(Typography).find("h6");

    expect(label).to.have.lengthOf(1);
    expect(label.text()).to.eql("cases.selected_records");
  });

  it("renders TablePagination", () => {
    expect(component.find(TablePagination)).to.have.lengthOf(1);
  });

  describe("when all records of the page are selected", () => {
    it("renders ButtonBase with a label to select all records", () => {
      const button = component.find(ButtonBase).first();

      expect(button).to.have.lengthOf(1);
      expect(button.text()).to.eql("cases.selected_all_records");
    });
  });

  describe("when all records are selected", () => {
    const propsAllRecordsSelected = {
      ...props,
      selectedRecords: { 0: arrayIndex, 1: [0, 1, 2] }
    };

    beforeEach(() => {
      ({ component } = setupMountedComponent(
        CustomToolbarSelect,
        propsAllRecordsSelected
      ));
    });

    it("renders ButtonBase with a label to clear selection", () => {
      const button = component.find(ButtonBase).first();

      expect(button).to.have.lengthOf(1);
      expect(button.text()).to.eql("buttons.clear_selection");
    });
  });

  describe("when some records are selected", () => {
    const propRecordsSelected = {
      ...props,
      selectedRows: { data: { length: 3 } },
      selectedRecords: { 0: [0, 1, 2] }
    };

    beforeEach(() => {
      ({ component } = setupMountedComponent(
        CustomToolbarSelect,
        propRecordsSelected
      ));
    });

    it("should not renders ButtonBase for select_all or clear_selection", () => {
      const buttons = component.find(ButtonBase);

      expect(buttons.at(0).props().title).to.equal("Previous page");
      expect(buttons.at(1).props().title).to.equal("Next page");
      expect(buttons).to.have.lengthOf(2);
    });
  });
});
