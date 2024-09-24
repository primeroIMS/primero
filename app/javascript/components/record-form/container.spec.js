// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS, Map, List, OrderedMap } from "immutable";

import { PrimeroModuleRecord } from "../application/records";
import { mountedComponent, screen } from "../../test-utils";
import { MANAGE } from "../permissions";
import { MODES } from "../../config";

import { FormSectionRecord, FieldRecord } from "./records";
import RecordForms from "./container";

describe("<RecordForms /> - Component", () => {
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

    it("should render RecordForm and not RecordOwner and Transitions", () => {
      mountedComponent(
        <RecordForms mode={MODES.show} />,
        initialState,
        {},
        ["/cases/2b8d6be1-1dc4-483a-8640-4cfe87c71610"],
        {},
        "/:recordType(cases|incidents|tracing_requests)/:id"
      );

      expect(screen.queryByTestId("record-owner-form")).toBeNull();
      expect(screen.queryByTestId("transitions")).toBeNull();
      expect(screen.getByTestId("record-form-title", { name: "Basic Identity" })).toBeInTheDocument();
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

    it("should render Approvals without ApprovalPanel", () => {
      mountedComponent(
        <RecordForms mode={MODES.show} />,
        initialState,
        {},
        ["/cases/2b8d6be1-1dc4-483a-8640-4cfe87c71610"],
        {},
        "/:recordType(cases|incidents|tracing_requests)/:id"
      );

      expect(screen.getByTestId("approvals")).toBeInTheDocument();
      expect(screen.queryByTestId("approval-panel")).toBeNull();
      expect(screen.queryByTestId("transitions")).toBeNull();
      expect(screen.getByText("forms.record_types.approvals")).toBeInTheDocument();
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

    it("should render Approvals with ApprovalPanel", () => {
      mountedComponent(
        <RecordForms mode={MODES.show} />,
        initialState,
        {},
        ["/cases/2b8d6be1-1dc4-483a-8640-4cfe87c71610"],
        {},
        "/:recordType(cases|incidents|tracing_requests)/:id"
      );

      expect(screen.getByTestId("approvals")).toBeInTheDocument();
      expect(screen.getByTestId("approval-panel")).toBeInTheDocument();
      expect(screen.queryByTestId("transitions")).toBeNull();
      expect(screen.getByText("forms.record_types.approvals")).toBeInTheDocument();
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

    it("should render IncidentFromCase with IncidentFromCasePanel", () => {
      mountedComponent(
        <RecordForms mode={MODES.show} />,
        initialState,
        {},
        ["/cases/2b8d6be1-1dc4-483a-8640-4cfe87c71610"],
        {},
        "/:recordType(cases|incidents|tracing_requests)/:id"
      );

      expect(screen.getByTestId("incident-from-case")).toBeInTheDocument();
      expect(screen.getByTestId("incident-panel")).toBeInTheDocument();
      expect(screen.queryByTestId("approvals")).toBeNull();
      expect(screen.queryByTestId("transitions")).toBeNull();
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

    it("should render Transitions", () => {
      mountedComponent(
        <RecordForms mode={MODES.show} />,
        initialState,
        {},
        ["/cases/2b8d6be1-1dc4-483a-8640-4cfe87c71610"],
        {},
        "/:recordType(cases|incidents|tracing_requests)/:id"
      );

      expect(screen.getByTestId("transitions")).toBeInTheDocument();
      expect(screen.getByTestId("record-form-title")).toHaveTextContent("transfer_assignment.title");
      expect(screen.queryByTestId("incident-panel")).toBeNull();
      expect(screen.queryByTestId("approvals")).toBeNull();
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

    it("should render Transitions component for REFERRAL", () => {
      mountedComponent(
        <RecordForms mode={MODES.show} />,
        initialState,
        {},
        ["/cases/2b8d6be1-1dc4-483a-8640-4cfe87c71610"],
        {},
        "/:recordType(cases|incidents|tracing_requests)/:id"
      );

      expect(screen.getByTestId("transitions")).toBeInTheDocument();
      expect(screen.getByTestId("record-form-title")).toHaveTextContent("forms.record_types.referrals");
      expect(screen.queryByTestId("incident-panel")).toBeNull();
      expect(screen.queryByTestId("approvals")).toBeNull();
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

    it("should render ChangeLog component", () => {
      mountedComponent(
        <RecordForms mode={MODES.show} />,
        initialState,
        {},
        ["/cases/2b8d6be1-1dc4-483a-8640-4cfe87c71610"],
        {},
        "/:recordType(cases|incidents|tracing_requests)/:id"
      );

      expect(screen.getByTestId("change-logs")).toBeInTheDocument();
      expect(screen.getByTestId("record-form-title")).toHaveTextContent("change_logs.label");
      expect(screen.queryByTestId("transitions")).toBeNull();
      expect(screen.queryByTestId("incident-panel")).toBeNull();
      expect(screen.queryByTestId("approvals")).toBeNull();
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

    it("should render Approvals without ApprovalPanel", () => {
      mountedComponent(
        <RecordForms mode={MODES.new} />,
        initialState,
        {},
        ["/cases/primeromodule-cp/new"],
        {},
        "/:recordType(cases|incidents|tracing_requests)/:module/new"
      );

      expect(screen.getByTestId("approvals")).toBeInTheDocument();
      expect(screen.queryByTestId("approval-panel")).toBeNull();
      expect(screen.queryByTestId("transitions")).toBeNull();
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

    it("should render CircularProgress", () => {
      mountedComponent(
        <RecordForms mode={MODES.show} />,
        initialState,
        {},
        ["/cases/2b8d6be1-1dc4-483a-8640-4cfe87c71610"],
        {},
        "/:recordType(cases|incidents|tracing_requests)/:id"
      );

      expect(screen.getByRole("progressbar")).toBeInTheDocument();
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

    it("should render just one RecordForm ", () => {
      mountedComponent(
        <RecordForms mode={MODES.show} />,
        initialState,
        {},
        ["/cases/2b8d6be1-1dc4-483a-8640-4cfe87c71610"],
        {},
        "/:recordType(cases|incidents|tracing_requests)/:id"
      );

      expect(screen.getAllByTestId("record-form-title")).toHaveLength(1);
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
      it("should render RecordOwner ", () => {
        mountedComponent(
          <RecordForms mode={MODES.show} />,
          initialState,
          {},
          ["/cases/2b8d6be1-1dc4-483a-8640-4cfe87c71610"],
          {},
          "/:recordType(cases|incidents|tracing_requests)/:id"
        );

        expect(screen.getByTestId("record-owner-form")).toBeInTheDocument();
        expect(screen.getByTestId("record-form-title")).toHaveTextContent("forms.record_types.record_information");
      });
    });

    describe("and has permission to manage cases", () => {
      it("should render RecordOwner ", () => {
        mountedComponent(
          <RecordForms mode={MODES.show} />,
          fromJS({
            ...initialState,
            user: {
              permissions: {
                cases: MANAGE
              },
              modules: ["primeromodule-cp"]
            }
          }),
          {},
          ["/cases/2b8d6be1-1dc4-483a-8640-4cfe87c71610"],
          {},
          "/:recordType(cases|incidents|tracing_requests)/:id"
        );

        expect(screen.getByTestId("record-owner-form")).toBeInTheDocument();
        expect(screen.getByTestId("record-form-title")).toHaveTextContent("forms.record_types.record_information");
      });
    });
  });
});
