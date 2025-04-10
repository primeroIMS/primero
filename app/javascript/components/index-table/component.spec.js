import { fromJS, List } from "immutable";
import { mountedComponent, userEvent, screen, cleanup } from "test-utils";

import { RECORD_PATH } from "../../config";
import { mapEntriesToRecord } from "../../libs";
import { FieldRecord } from "../record-form";

import IndexTable from "./component";
import CustomToolbarSelect from "./custom-toolbar-select";

describe("<IndexTable />", () => {
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
    },
    2: {
      name: "sex",
      type: "select_field",
      editable: true,
      disabled: null,
      visible: true,
      display_name: {
        en: "Sex"
      },
      option_strings_source: "lookup lookup-sex",
      option_strings_text: null,
      required: true,
      date_validation: "default_date_validation"
    }
  };
  const props = {
    title: "testTitle",
    onTableChange: jest.fn().mockReturnValue({
      type: "test",
      payload: []
    }),
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
    selectedRecords: {},
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
      fields: mapEntriesToRecord(fields, FieldRecord),
      options: {
        lookups: [
          {
            id: 1,
            unique_id: "lookup-location-type",
            values: [
              { id: "country", display_text: "Country" },
              { id: "region", display_text: "Region" }
            ]
          },
          {
            id: 2,
            unique_id: "lookup-sex",
            values: [
              { id: "male", display_text: { en: "Male" } },
              { id: "female", display_text: "Female" }
            ]
          }
        ]
      }
    }
  });

  beforeEach(() => {
    mountedComponent(<IndexTable {...props} />, { initialState });
  });

  it("should render MUIDataTable", () => {
    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  it("should render Caption", () => {
    const label = screen.getByRole("grid");

    expect(label).toHaveTextContent(props.title);
  });
  it("should have attribute aria-label", () => {
    const label = screen.getByRole("grid").getAttribute("aria-label");

    expect(label).toBe(props.title);
  });
  it("should change sort order to ascending if user clicks on a column", async () => {
    const user = userEvent.setup();
    const nameColumnHeader = screen.getAllByText("Name");

    expect(screen.getAllByRole("grid")).toHaveLength(1);
    expect(screen.queryByText("Table now sorted by name : ascending")).toBeNull();
    await user.click(nameColumnHeader)[0];
  });

  describe("When data still loading", () => {
    const loadingInitialState = fromJS({
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

    beforeEach(() => {
      cleanup();
      mountedComponent(<IndexTable {...props} />, loadingInitialState);
    });
    it("renders IndexTable component", () => {
      expect(screen.getAllByRole("table")).toHaveLength(1);
    });
    it("renders CircularProgress", () => {
      expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });
  });

  describe("when records are selected", () => {
    const propsRecordsSelected = {
      ...props,
      selectedRecords: { 0: [0] }
    };

    beforeEach(() => {
      mountedComponent(<CustomToolbarSelect {...propsRecordsSelected} />);
    });
    it("renders CustomToolbarSelect component", () => {
      expect(screen.getAllByRole("toolbar")).toHaveLength(1);
    });
  });

  describe("when no records are selected", () => {
    beforeEach(() => {
      const noRecordsSelectedProps = {
        ...props,
        showCustomToolbar: true
      };

      mountedComponent(<CustomToolbarSelect {...noRecordsSelectedProps} initialState={initialState} />);
    });
    it("should render CustomToolbarSelect called in CustomToolbar props", () => {
      expect(screen.getByRole("toolbar")).toBeInTheDocument();
    });
  });

  describe("when selectableRows options is none", () => {
    const nonSelectableRowsProps = {
      ...props,
      selectedRecords: { 0: [0] },
      options: {
        selectableRows: "none"
      }
    };

    beforeEach(() => {
      mountedComponent(<IndexTable {...nonSelectableRowsProps} />);
    });

    it("should not render any checkbox", () => {
      expect(screen.queryByRole("checkbox")).toBeTruthy();
    });
    it("should not render any checkbox", () => {
      const checkbox = screen.queryAllByRole("checkbox");

      expect(checkbox).toHaveLength(1);
    });
  });
});
