/* eslint-disable prefer-destructuring */

import React from "react";
import { Route } from "react-router-dom";
import { fromJS, Map, List, OrderedMap } from "immutable";
import { CircularProgress } from "@material-ui/core";

import { setupMountedComponent } from "../../test";
import { PageContainer } from "../page";
import LoadingIndicator from "../loading-indicator";
import RecordOwner from "../record-owner";
import { PrimeroModuleRecord } from "../application/records";
import Transitions from "../transitions";
import { MODES } from "../../config";
import Approvals from "../approvals";
import ApprovalPanel from "../approvals/components/panel";

import Nav from "./nav";
import { RecordForm, RecordFormToolbar } from "./form";
import RecordForms from "./container";
import { FormSectionRecord, FieldRecord } from "./records";

describe("<RecordForms /> - Component", () => {
  let component;
  const formSections = OrderedMap({
    1: FormSectionRecord({
      id: 1,
      form_group_id: "identification_registration",
      form_group_name: {
        en: "Identification / Registration",
        fr: "",
        ar: ""
      },
      order_form_group: 30,
      name: {
        en: "Basic Identity",
        fr: "",
        ar: ""
      },
      order: 10,
      unique_id: "basic_identity",
      is_first_tab: true,
      visible: true,
      is_nested: false,
      module_ids: ["primeromodule-cp"],
      parent_form: "case",
      fields: [1]
    })
  });

  const fields = OrderedMap({
    1: FieldRecord({
      id: 1,
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
    })
  });

  const application = fromJS({
    modules: [
      PrimeroModuleRecord({
        unique_id: "primeromodule-cp",
        workflows: {
          case: {
            en: [
              {
                id: "new",
                display_text: "New"
              },
              {
                id: "closed",
                display_text: "Closed"
              }
            ]
          }
        }
      })
    ]
  });

  const record = {
    age: 26,
    sex: "male",
    name: "Example Record",
    owned_by: "primero",
    created_at: "2019-08-06T20:21:19.864Z",
    case_id_display: "2063a4b",
    registration_date: "2019-08-06",
    module_id: "primeromodule-cp",
    short_id: "96f613f",
    id: "a9e1a7a2-1920-4b41-80d1-df45c26db4ab"
  };

  const rootInitialState = fromJS({
    records: Map({
      cases: Map({
        data: List([Map(record)]),
        metadata: Map({ per: 20, page: 1, total: 1 }),
        filters: Map({ status: "open" })
      })
    }),
    forms: Map({
      selectedForm: "record_owner",
      selectedRecord: record,
      formSections,
      fields,
      loading: false,
      errors: false
    }),
    user: fromJS({
      modules: ["primeromodule-cp"]
    }),
    application
  });

  before(() => {
    const routedComponent = initialProps => {
      return (
        <Route
          path="/:recordType(cases|incidents|tracing_requests)/:id"
          component={props => (
            <RecordForms {...{ ...props, ...initialProps }} />
          )}
        />
      );
    };

    ({ component } = setupMountedComponent(
      routedComponent,
      {
        mode: "show"
      },
      rootInitialState,
      ["/cases/2b8d6be1-1dc4-483a-8640-4cfe87c71610"]
    ));
  });

  it("renders the PageContainer", done => {
    expect(component.find(PageContainer)).to.have.length(1);
    done();
  });

  it("renders the LoadingIndicator", () => {
    expect(component.find(LoadingIndicator)).to.have.length(1);
  });

  it("renders the RecordFormToolbar", () => {
    expect(component.find(RecordFormToolbar)).to.have.length(1);
  });

  it("renders the Nav", () => {
    expect(component.find(Nav)).to.have.length(1);
  });

  it("renders the RecordOwner", () => {
    expect(component.find(RecordOwner)).to.have.length(1);
  });

  describe("when basic_identity is the selectedForm ", () => {
    const initialState = fromJS({
      records: Map({
        cases: Map({
          data: List([Map(record)]),
          metadata: Map({ per: 20, page: 1, total: 1 }),
          filters: Map({ status: "open" })
        })
      }),
      forms: Map({
        selectedForm: "basic_identity",
        selectedRecord: record,
        formSections,
        fields,
        loading: false,
        errors: false
      }),
      user: fromJS({
        modules: ["primeromodule-cp"]
      }),
      application
    });

    beforeEach(() => {
      const routedComponent = initialProps => {
        return (
          <Route
            path="/:recordType(cases|incidents|tracing_requests)/:id"
            component={props => (
              <RecordForms {...{ ...props, ...initialProps }} />
            )}
          />
        );
      };

      ({ component } = setupMountedComponent(
        routedComponent,
        {
          mode: "show"
        },
        initialState,
        ["/cases/2b8d6be1-1dc4-483a-8640-4cfe87c71610"]
      ));
    });

    it("should render RecordForm and not RecordOwner and Transitions", () => {
      expect(component.find(RecordOwner)).to.have.lengthOf(0);
      expect(component.find(Transitions)).to.have.lengthOf(0);
      expect(component.find(RecordForm)).to.have.lengthOf(1);
    });
  });

  describe("when approvals is the selectedForm but the record doesn't have approvals data", () => {
    const initialState = fromJS({
      records: Map({
        cases: Map({
          data: List([Map(record)]),
          metadata: Map({ per: 20, page: 1, total: 1 }),
          filters: Map({ status: "open" })
        })
      }),
      forms: Map({
        selectedForm: "approvals",
        selectedRecord: record,
        formSections,
        fields,
        loading: false,
        errors: false
      }),
      user: fromJS({
        modules: ["primeromodule-cp"]
      }),
      application
    });

    beforeEach(() => {
      const routedComponent = initialProps => {
        return (
          <Route
            path="/:recordType(cases|incidents|tracing_requests)/:id"
            component={props => (
              <RecordForms {...{ ...props, ...initialProps }} />
            )}
          />
        );
      };

      ({ component } = setupMountedComponent(
        routedComponent,
        {
          mode: MODES.show
        },
        initialState,
        ["/cases/2b8d6be1-1dc4-483a-8640-4cfe87c71610"]
      ));
    });

    it("should render Approvals without ApprovalPanel", () => {
      expect(component.find(Approvals)).to.have.lengthOf(1);
      expect(component.find(ApprovalPanel)).to.have.lengthOf(0);
      expect(component.find(Transitions)).to.have.lengthOf(0);
      expect(component.find(RecordForm)).to.have.lengthOf(0);
    });
  });

  describe("when approvals is the selectedForm and the record has approvals data", () => {
    const recordWithApproval = fromJS({
      ...record,
      approval_subforms: [
        {
          unique_id: "ff308075-9816-43c1-9d33-7cf0ef229e4e",
          requested_by: "primero",
          approval_date: "2020-02-06",
          approval_status: "requested",
          approval_requested_for: "case_plan"
        }
      ]
    });

    const initialState = fromJS({
      records: Map({
        cases: Map({
          data: List([Map(recordWithApproval)]),
          metadata: Map({ per: 20, page: 1, total: 1 }),
          filters: Map({ status: "open" })
        })
      }),
      forms: fromJS({
        selectedForm: "approvals",
        selectedRecord: "a9e1a7a2-1920-4b41-80d1-df45c26db4ab",
        formSections,
        fields,
        loading: false,
        errors: false
      }),
      user: fromJS({
        modules: ["primeromodule-cp"]
      }),
      application
    });

    beforeEach(() => {
      const routedComponent = initialProps => {
        return (
          <Route
            path="/:recordType(cases|incidents|tracing_requests)/:id"
            component={props => (
              <RecordForms {...{ ...props, ...initialProps }} />
            )}
          />
        );
      };

      ({ component } = setupMountedComponent(
        routedComponent,
        {
          mode: MODES.show
        },
        initialState,
        ["/cases/a9e1a7a2-1920-4b41-80d1-df45c26db4ab"]
      ));
    });

    it("should render Approvals with ApprovalPanel", () => {
      expect(component.find(Approvals)).to.have.lengthOf(1);
      expect(component.find(ApprovalPanel)).to.have.lengthOf(1);
      expect(component.find(Transitions)).to.have.lengthOf(0);
      expect(component.find(RecordForm)).to.have.lengthOf(0);
    });
  });

  describe("when record is new", () => {
    const initialState = fromJS({
      records: {
        cases: Map({
          data: List([Map(record)]),
          metadata: Map({ per: 20, page: 1, total: 1 }),
          filters: Map({ status: "open" })
        })
      },
      forms: {
        selectedForm: "approvals",
        selectedRecord: null,
        formSections,
        fields,
        loading: false,
        errors: false
      },
      user: fromJS({
        modules: ["primeromodule-cp"]
      }),
      application
    });

    beforeEach(() => {
      const routedComponent = initialProps => {
        return (
          <Route
            path="/:recordType(cases|incidents|tracing_requests)/:module/new"
            component={props => (
              <RecordForms {...{ ...props, ...initialProps }} />
            )}
          />
        );
      };

      ({ component } = setupMountedComponent(
        routedComponent,
        {
          mode: MODES.new
        },
        initialState,
        ["/cases/primeromodule-cp/new"]
      ));
    });

    it("should render Approvals without ApprovalPanel", () => {
      expect(component.find(Approvals)).to.have.lengthOf(1);
      expect(component.find(ApprovalPanel)).to.have.lengthOf(0);
      expect(component.find(Transitions)).to.have.lengthOf(0);
      expect(component.find(RecordForm)).to.have.lengthOf(0);
    });
  });

  describe("when forms are loading", () => {
    const initialState = fromJS({
      records: Map({
        cases: Map({
          data: List([Map(record)]),
          metadata: Map({ per: 20, page: 1, total: 1 }),
          filters: Map({ status: "open" }),
          loading: true
        })
      }),
      forms: Map({
        selectedForm: "basic_identity",
        selectedRecord: null,
        formSections: OrderedMap({}),
        fields,
        loading: true,
        errors: false
      }),
      user: fromJS({
        modules: ["primeromodule-cp"]
      }),
      application
    });

    beforeEach(() => {
      const routedComponent = initialProps => {
        return (
          <Route
            path="/:recordType(cases|incidents|tracing_requests)/:id"
            component={props => (
              <RecordForms {...{ ...props, ...initialProps }} />
            )}
          />
        );
      };

      ({ component } = setupMountedComponent(
        routedComponent,
        {
          mode: "show"
        },
        initialState,
        ["/cases/2b8d6be1-1dc4-483a-8640-4cfe87c71610"]
      ));
    });

    it("should render CircularProgress", () => {
      expect(component.find(RecordForms)).to.have.lengthOf(1);
      expect(component.find(CircularProgress)).to.have.lengthOf(1);
    });
  });
});
