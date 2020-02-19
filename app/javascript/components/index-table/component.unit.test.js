import { expect } from "chai";
import { fromJS, List } from "immutable";
import MUIDataTable from "mui-datatables";
import { CircularProgress } from "@material-ui/core";

import { LoadingIndicator } from "../loading-indicator";
import { setupMountedComponent, stub } from "../../test";
import { RECORD_PATH } from "../../config";
import { mapEntriesToRecord } from "../../libs";
import { FieldRecord } from "../record-form";

import IndexTable from "./component";

describe("<IndexTable />", () => {
  let component;
  const fields = {
    1: {
      name: "name_first",
      type: "text_field",
      editable: true,
      disabled: null,
      visible: true,
      display_name: {
        en: "First Name",
        fr: "",
        ar: "",
        "ar-LB": "",
        so: "",
        es: ""
      },
      subform_section_id: null,
      help_text: {},
      multi_select: null,
      option_strings_source: null,
      option_strings_text: null,
      guiding_questions: "",
      required: true,
      date_validation: "default_date_validation"
    }
  };
  const props = {
    onTableChange: stub(),
    recordType: RECORD_PATH.cases,
    defaultFilters: fromJS({}),
    bypassInitialFetch: true,
    columns: List([
      {
        label: "Name",
        name: "name",
        id: false,
        options: {}
      },
      {
        label: "Age",
        name: "age",
        id: false,
        options: {}
      },
      {
        label: "Sex",
        name: "sex",
        id: false,
        options: {}
      }
    ]),
    selectedRecords: [],
    setSelectedRecords: () => {}
  };

  const initialState = fromJS({
    records: {
      cases: {
        data: [
          {
            sex: "male",
            owned_by_agency_id: 1,
            record_in_scope: true,
            created_at: "2020-01-07T14:27:04.136Z",
            name: "G P",
            alert_count: 0,
            case_id_display: "96f613f",
            owned_by: "primero_cp",
            status: "open",
            registration_date: "2020-01-07",
            id: "d9df44fb-95d0-4407-91fd-ed18c19be1ad",
            flag_count: 0,
            short_id: "96f613f",
            age: 26,
            workflow: "new"
          }
        ],
        filters: {
          status: ["open"]
        },
        loading: false,
        errors: false,
        metadata: {
          total: 1,
          per: 20,
          page: 1
        }
      }
    },
    forms: {
      fields: mapEntriesToRecord(fields, FieldRecord)
    }
  });

  beforeEach(() => {
    ({ component } = setupMountedComponent(IndexTable, props, initialState));
  });

  it("should render LoadingIndicator", () => {
    expect(component.find(LoadingIndicator)).to.have.lengthOf(1);
  });

  it("should render MUIDataTable", () => {
    expect(component.find(MUIDataTable)).to.have.lengthOf(1);
  });

  it("should change sort order to descending if user clicks on a column", () => {
    props.onTableChange.returns({
      type: "test",
      payload: []
    });
    const nameColumnIndex = 3;
    const table = component.find(IndexTable);

    expect(table.find("tbody tr")).to.have.lengthOf(1);
    expect(
      table
        .find("div")
        .last()
        .text()
    ).to.be.empty;

    table
      .find("thead th span")
      .at(nameColumnIndex)
      .simulate("click");

    expect(
      table
        .find("div")
        .last()
        .text()
    ).to.be.be.equals("Table now sorted by name : descending");
  });

  describe("When data still loading", () => {
    let component;

    const initialState = fromJS({
      records: {
        cases: {
          data: [],
          filters: {
            status: ["open"]
          },
          loading: true,
          errors: false,
          metadata: {
            total: 1,
            per: 20,
            page: 1
          }
        }
      },
      forms: {
        fields: mapEntriesToRecord(fields, FieldRecord)
      }
    });

    before(() => {
      ({ component } = setupMountedComponent(IndexTable, props, initialState));
    });

    it("renders IndexTable component", () => {
      expect(component.find(IndexTable)).to.have.lengthOf(1);
    });
    it("renders CircularProgress", () => {
      expect(component.find(CircularProgress)).to.have.lengthOf(1);
    });
  });

});
