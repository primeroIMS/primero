/* eslint-disable prefer-destructuring */

import { Route } from "react-router-dom";
import { fromJS, Map, List, OrderedMap } from "immutable";
import { CircularProgress } from "@material-ui/core";

import { setupMountedComponent } from "../../test";
import PageContainer from "../page";
import LoadingIndicator from "../loading-indicator";
import RecordOwner from "../record-owner";
import { PrimeroModuleRecord } from "../application/records";
import Transitions from "../transitions";
import { MODES } from "../../config";
import Approvals from "../approvals";
import ApprovalPanel from "../approvals/components/panel";
import IncidentFromCase from "../incidents-from-case";
import IncidentFromCasePanel from "../incidents-from-case/components/panel";
import ChangeLogs from "../change-logs";
import { MANAGE } from "../../libs/permissions";

import Nav from "./nav";
import { RecordForm, RecordFormToolbar } from "./form";
import RecordFormTitle from "./form/record-form-title";
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
    }),
    2: FieldRecord({
      name: "gbv_sexual_violence_type",
      type: "select_field",
      option_strings_source: "lookup lookup-cp-sexual-violence-type",
      display_name: { en: "First Name" }
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
    id: "2b8d6be1-1dc4-483a-8640-4cfe87c71610"
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
      errors: false,
      forms: {
        options: {
          lookups: [
            {
              id: 2,
              unique_id: "lookup-cp-violence-type",
              name: {
                en: "CP Sexual Violence Type"
              },
              values: [
                { id: "cp_test1", display_text: { en: "CP Test1" } },
                { id: "cp_test2", display_text: { en: "CP Test2" } }
              ]
            }
          ]
        }
      }
    }),
    user: fromJS({
      permittedForms: { basic_identity: "rw" },
      modules: ["primeromodule-cp"]
    }),
    application
  });

  before(() => {
    const routedComponent = initialProps => {
      return (
        <Route
          path="/:recordType(cases|incidents|tracing_requests)/:id"
          component={props => <RecordForms {...{ ...props, ...initialProps }} />}
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

  it("renders the PageContainer", () => {
    expect(component.find(PageContainer)).to.have.length(1);
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
        modules: ["primeromodule-cp"],
        permittedForms: { basic_identity: "rw" }
      }),
      application
    });

    beforeEach(() => {
      const routedComponent = initialProps => {
        return (
          <Route
            path="/:recordType(cases|incidents|tracing_requests)/:id"
            component={props => <RecordForms {...{ ...props, ...initialProps }} />}
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
        modules: ["primeromodule-cp"],
        permittedForms: { basic_identity: "rw" }
      }),
      application
    });

    beforeEach(() => {
      const routedComponent = initialProps => {
        return (
          <Route
            path="/:recordType(cases|incidents|tracing_requests)/:id"
            component={props => <RecordForms {...{ ...props, ...initialProps }} />}
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
      expect(component.find(RecordForm).find(Approvals)).to.have.lengthOf(1);
      expect(component.find(ApprovalPanel)).to.have.lengthOf(0);
      expect(component.find(Transitions)).to.have.lengthOf(0);
      expect(component.find(RecordForm).find(Approvals).find(RecordFormTitle).text()).to.be.equal(
        "forms.record_types.approvals"
      );
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
        selectedRecord: "2b8d6be1-1dc4-483a-8640-4cfe87c71610",
        formSections,
        fields,
        loading: false,
        errors: false
      }),
      user: fromJS({
        modules: ["primeromodule-cp"],
        permittedForms: { basic_identity: "rw" }
      }),
      application
    });

    beforeEach(() => {
      const routedComponent = initialProps => {
        return (
          <Route
            path="/:recordType(cases|incidents|tracing_requests)/:id"
            component={props => <RecordForms {...{ ...props, ...initialProps }} />}
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

    it("should render Approvals with ApprovalPanel", () => {
      const componentRecordForm = component.find(RecordForm);

      expect(componentRecordForm.find(Approvals)).to.have.lengthOf(1);
      expect(componentRecordForm.find(ApprovalPanel)).to.have.lengthOf(1);
      expect(componentRecordForm.find(Transitions)).to.be.empty;
      expect(componentRecordForm.find(Approvals).find(RecordFormTitle).text()).to.be.equal(
        "forms.record_types.approvals"
      );
    });
  });

  describe("when incident_from_case is the selectedForm", () => {
    const recordWithIncidentDetails = {
      ...record,
      incident_details: [
        {
          created_by: "primero_gbv",
          module_id: "primeromodule-gbv",
          incident_date: "2020-09-16",
          owned_by: "primero_gbv",
          date_of_first_report: "2020-10-04",
          gbv_sexual_violence_type: "test1",
          unique_id: "e25c5cb1-1257-472e-b2ec-05f568a3b51e"
        }
      ]
    };

    const initialState = fromJS({
      records: {
        cases: {
          data: [recordWithIncidentDetails],
          metadata: { per: 20, page: 1, total: 1 },
          filters: { status: "open" }
        }
      },
      forms: {
        selectedForm: "incident_from_case",
        selectedRecord: "2b8d6be1-1dc4-483a-8640-4cfe87c71610",
        formSections,
        fields,
        loading: false,
        errors: false
      },
      user: {
        modules: ["primeromodule-cp"],
        permittedForms: { basic_identity: "rw" }
      },
      application
    });

    beforeEach(() => {
      const routedComponent = initialProps => {
        return (
          <Route
            path="/:recordType(cases|incidents|tracing_requests)/:id"
            component={props => <RecordForms {...{ ...props, ...initialProps }} />}
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

    it("should render IncidentFromCase with IncidentFromCasePanel", () => {
      const componentRecordForm = component.find(RecordForm);

      expect(componentRecordForm).to.have.lengthOf(1);
      expect(componentRecordForm.find(IncidentFromCase)).to.have.lengthOf(1);
      expect(componentRecordForm.find(IncidentFromCasePanel)).to.have.lengthOf(1);
      expect(componentRecordForm.find(Transitions)).to.be.empty;
      expect(componentRecordForm.find(Approvals)).to.be.empty;
    });
  });

  describe("when transfers_assignments is the selectedForm", () => {
    const initialState = fromJS({
      records: {
        cases: {
          data: [record],
          metadata: { per: 20, page: 1, total: 1 },
          filters: { status: "open" }
        },
        transitions: {
          data: [
            {
              id: "3dbe3c63-7c6d-44ad-8eb9-fa8de534440f",
              record_id: "543cff05-4ba1-46a1-b636-a4b2644305bf",
              record_type: "case",
              created_at: "2020-10-22T18:44:09.112Z",
              notes: "",
              rejected_reason: "",
              status: "in_progress",
              type: "Transfer",
              consent_overridden: true,
              consent_individual_transfer: false,
              transitioned_by: "primero",
              transitioned_to_remote: null,
              transitioned_to: "primero_cp",
              service: null,
              remote: false
            }
          ]
        }
      },
      forms: {
        selectedForm: "transfers_assignments",
        selectedRecord: "2b8d6be1-1dc4-483a-8640-4cfe87c71610",
        formSections,
        fields,
        loading: false,
        errors: false
      },
      user: {
        modules: ["primeromodule-cp"],
        permittedForms: { basic_identity: "rw" }
      },
      application
    });

    beforeEach(() => {
      const routedComponent = initialProps => {
        return (
          <Route
            path="/:recordType(cases|incidents|tracing_requests)/:id"
            component={props => <RecordForms {...{ ...props, ...initialProps }} />}
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

    it("should render Transitions", () => {
      const componentRecordForm = component.find(RecordForm);

      expect(componentRecordForm).to.have.lengthOf(1);
      expect(componentRecordForm.find(Transitions)).to.have.lengthOf(1);
      expect(componentRecordForm.find(Transitions).find(RecordFormTitle).text()).to.equal("transfer_assignment.title");
      expect(componentRecordForm.find(IncidentFromCasePanel)).to.be.empty;
      expect(componentRecordForm.find(Approvals)).to.be.empty;
    });
  });

  describe("when referral is the selectedForm", () => {
    const initialState = fromJS({
      records: {
        cases: {
          data: [record],
          metadata: { per: 20, page: 1, total: 1 },
          filters: { status: "open" }
        },
        transitions: {
          data: [
            {
              id: "a4266cf4-b2f5-4cad-9a18-3802f66698ac",
              record_id: "543cff05-4ba1-46a1-b636-a4b2644305bf",
              record_type: "case",
              created_at: "2020-10-15T16:03:23.143Z",
              notes: "",
              rejected_reason: "",
              status: "in_progress",
              type: "Referral",
              consent_overridden: true,
              consent_individual_transfer: false,
              transitioned_by: "primero",
              transitioned_to_remote: null,
              transitioned_to: "primero_cp",
              service: "safehouse_service",
              remote: false
            }
          ]
        }
      },
      forms: {
        selectedForm: "referral",
        selectedRecord: "2b8d6be1-1dc4-483a-8640-4cfe87c71610",
        formSections,
        fields,
        loading: false,
        errors: false
      },
      user: {
        modules: ["primeromodule-cp"],
        permittedForms: { basic_identity: "rw" }
      },
      application
    });

    beforeEach(() => {
      const routedComponent = initialProps => {
        return (
          <Route
            path="/:recordType(cases|incidents|tracing_requests)/:id"
            component={props => <RecordForms {...{ ...props, ...initialProps }} />}
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

    it("should render Transitions component for REFERRAL", () => {
      const componentRecordForm = component.find(RecordForm);

      expect(componentRecordForm).to.have.lengthOf(1);
      expect(componentRecordForm.find(Transitions)).to.have.lengthOf(1);
      expect(componentRecordForm.find(Transitions).find(RecordFormTitle).text()).to.equal(
        "forms.record_types.referrals"
      );
      expect(componentRecordForm.find(IncidentFromCasePanel)).to.be.empty;
      expect(componentRecordForm.find(Approvals)).to.be.empty;
    });
  });

  describe("when change_log is the selectedForm", () => {
    const initialState = fromJS({
      records: {
        cases: {
          data: [record],
          metadata: { per: 20, page: 1, total: 1 },
          filters: { status: "open" }
        },
        changeLogs: {
          data: [
            {
              record_id: "2b8d6be1-1dc4-483a-8640-4cfe87c71610",
              record_type: "cases",
              datetime: "2020-12-07T20:28:11Z",
              user_name: "primero",
              action: "update",
              record_changes: [
                {
                  family_details_section: {
                    to: [
                      {
                        relation: "mother",
                        unique_id: "57d99a69-acbc-4b7e-850b-9e873181a778",
                        relation_name: "AaAa",
                        relation_is_alive: "alive"
                      },
                      {
                        relation: "father",
                        unique_id: "c29598ad-b920-4166-bb99-fe7a2443601b",
                        relation_name: "bbb",
                        relation_is_alive: "alive"
                      }
                    ],
                    from: [
                      {
                        relation: "mother",
                        unique_id: "57d99a69-acbc-4b7e-850b-9e873181a778",
                        relation_name: "AaAA",
                        relation_is_alive: "alive"
                      }
                    ]
                  }
                }
              ]
            },
            {
              record_id: "2b8d6be1-1dc4-483a-8640-4cfe87c71610",
              record_type: "cases",
              datetime: "2020-12-04T14:32:03Z",
              user_name: "primero",
              action: "create",
              record_changes: []
            }
          ]
        }
      },
      forms: {
        selectedForm: "change_logs",
        selectedRecord: "2b8d6be1-1dc4-483a-8640-4cfe87c71610",
        formSections,
        fields,
        loading: false,
        errors: false
      },
      user: {
        modules: ["primeromodule-cp"],
        permittedForms: { basic_identity: "rw" },
        permissions: {
          cases: ["manage"]
        }
      },
      application
    });

    beforeEach(() => {
      const routedComponent = initialProps => {
        return (
          <Route
            path="/:recordType(cases|incidents|tracing_requests)/:id"
            component={props => <RecordForms {...{ ...props, ...initialProps }} />}
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

    it("should render ChangeLog component", () => {
      const componentRecordForm = component.find(RecordForm);

      expect(componentRecordForm).to.have.lengthOf(1);
      expect(componentRecordForm.find(ChangeLogs)).to.have.lengthOf(1);
      expect(componentRecordForm.find(ChangeLogs).find(RecordFormTitle).text()).to.equal("change_logs.label");
      expect(componentRecordForm.find(Transitions)).to.be.empty;
      expect(componentRecordForm.find(IncidentFromCasePanel)).to.be.empty;
      expect(componentRecordForm.find(Approvals)).to.be.empty;
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
        modules: ["primeromodule-cp"],
        permittedForms: { basic_identity: "rw" }
      }),
      application
    });

    beforeEach(() => {
      const routedComponent = initialProps => {
        return (
          <Route
            path="/:recordType(cases|incidents|tracing_requests)/:module/new"
            component={props => <RecordForms {...{ ...props, ...initialProps }} />}
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
      const componentRecordForm = component.find(RecordForm);

      expect(componentRecordForm).to.have.lengthOf(1);
      expect(componentRecordForm.find(Approvals)).to.have.lengthOf(1);
      expect(componentRecordForm.find(ApprovalPanel)).to.be.empty;
      expect(componentRecordForm.find(Transitions)).to.be.empty;
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
            component={props => <RecordForms {...{ ...props, ...initialProps }} />}
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

  describe("when the user only has permitted one form", () => {
    const formSectionsOnePermitted = OrderedMap({
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
      }),
      2: FormSectionRecord({
        id: 2,
        form_group_id: "client_feedback",
        form_group_name: {
          en: "client_feedback",
          fr: "",
          ar: ""
        },
        order_form_group: 40,
        name: {
          en: "Client feedback",
          fr: "",
          ar: ""
        },
        order: 20,
        unique_id: "client_feedback",
        is_first_tab: true,
        visible: true,
        is_nested: false,
        module_ids: ["primeromodule-cp"],
        parent_form: "case",
        fields: [1]
      })
    });
    const initialState = fromJS({
      records: Map({
        cases: Map({
          data: List([Map(record)]),
          metadata: Map({ per: 20, page: 1, total: 1 }),
          filters: Map({ status: "open" })
        })
      }),
      forms: Map({
        selectedForm: "client_feedback",
        selectedRecord: record,
        formSections: formSectionsOnePermitted,
        fields,
        loading: false,
        errors: false
      }),
      user: fromJS({
        permittedForms: { client_feedback: "r" },
        modules: ["primeromodule-cp"]
      }),
      application
    });

    beforeEach(() => {
      const routedComponent = initialProps => {
        return (
          <Route
            path="/:recordType(cases|incidents|tracing_requests)/:id"
            component={props => <RecordForms {...{ ...props, ...initialProps }} />}
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

    it("should render just one RecordForm ", () => {
      expect(component.find(RecordForm)).to.have.lengthOf(1);
    });
  });

  describe("when the user doesn't have any permitted form but has permission to see cases", () => {
    const allFormSections = OrderedMap({
      1: FormSectionRecord({
        id: 1,
        form_group_id: "identification_registration",
        form_group_name: {
          en: "Identification / Registration"
        },
        order_form_group: 30,
        name: {
          en: "Basic Identity"
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
    const initialState = {
      records: {
        cases: {
          data: [record],
          metadata: { per: 20, page: 1, total: 1 },
          filters: { status: "open" }
        }
      },
      forms: {
        selectedForm: "record_owner",
        formSections: allFormSections
      },
      user: {
        permissions: {
          cases: ["read"]
        },
        permittedForms: {},
        modules: ["primeromodule-cp"]
      },
      application
    };

    describe("and has permission to see cases", () => {
      beforeEach(() => {
        const routedComponent = initialProps => {
          return (
            <Route
              path="/:recordType(cases|incidents|tracing_requests)/:id"
              component={props => <RecordForms {...{ ...props, ...initialProps }} />}
            />
          );
        };

        ({ component } = setupMountedComponent(
          routedComponent,
          {
            mode: "show"
          },
          fromJS(initialState),
          ["/cases/2b8d6be1-1dc4-483a-8640-4cfe87c71610"]
        ));
      });

      it("should render RecordOwner ", () => {
        const componentRecordForm = component.find(RecordForm);

        expect(componentRecordForm.find(RecordOwner)).to.have.lengthOf(1);
        expect(componentRecordForm.find(RecordOwner).find(RecordFormTitle).text()).to.equal(
          "forms.record_types.record_information"
        );
      });
    });

    describe("and has permission to manage cases", () => {
      beforeEach(() => {
        const routedComponent = initialProps => {
          return (
            <Route
              path="/:recordType(cases|incidents|tracing_requests)/:id"
              component={props => <RecordForms {...{ ...props, ...initialProps }} />}
            />
          );
        };

        ({ component } = setupMountedComponent(
          routedComponent,
          {
            mode: "show"
          },
          fromJS({
            ...initialState,
            user: {
              permissions: {
                cases: MANAGE
              },
              permittedForms: {},
              modules: ["primeromodule-cp"]
            }
          }),
          ["/cases/2b8d6be1-1dc4-483a-8640-4cfe87c71610"]
        ));
      });

      it("should render RecordOwner ", () => {
        const componentRecordForm = component.find(RecordForm);

        expect(componentRecordForm.find(RecordOwner)).to.have.lengthOf(1);
        expect(componentRecordForm.find(RecordOwner).find(RecordFormTitle).text()).to.equal(
          "forms.record_types.record_information"
        );
      });
    });
  });
});
