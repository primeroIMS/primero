// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { mountedComponent, screen } from "../../../../test-utils";
import { mapEntriesToRecord } from "../../../../libs";
import { FormSectionRecord } from "../../../record-form/records";
import { RECORD_TYPES } from "../../../../config/constants";
import { PrimeroModuleRecord } from "../../../application/records";
import { ACTIONS } from "../../../permissions";

import FormsList from "./component";

describe("<FormsList />", () => {
  const formSections = [
    {
      id: 1,
      unique_id: "form_section_1",
      parent_form: "case",
      module_ids: ["primeromodule-cp"],
      order: 1,
      form_group_id: "group_1",
      order_form_group: 2
    },
    {
      id: 2,
      unique_id: "form_section_2",
      parent_form: "case",
      module_ids: ["primeromodule-cp"],
      order: 2,
      form_group_id: "group_1",
      order_form_group: 2
    },
    {
      id: 5,
      unique_id: "form_section_5",
      parent_form: "case",
      module_ids: ["primeromodule-cp"],
      order: 1,
      form_group_id: "group_2",
      order_form_group: 1
    }
  ];

  const initialState = fromJS({
    application: {
      modules: [
        PrimeroModuleRecord({
          unique_id: "primeromodule-cp",
          name: "CP",
          associated_record_types: [RECORD_TYPES.cases, RECORD_TYPES.tracing_requests, RECORD_TYPES.incidents]
        })
      ]
    },
    records: {
      admin: {
        forms: {
          formSections: mapEntriesToRecord(formSections, FormSectionRecord, true)
        }
      }
    },
    forms: fromJS({
      options: {
        lookups: [
          {
            id: 51,
            unique_id: "lookup-form-group-cp-case",
            name: {
              en: "Form Groups - CP Case"
            },
            values: [
              {
                id: "group_1",
                disabled: false,
                display_text: {
                  en: "Group 1"
                }
              },
              {
                id: "group_2",
                disabled: false,
                display_text: {
                  en: "Group 2"
                }
              }
            ]
          }
        ]
      }
    }),
    user: {
      permissions: {
        metadata: [ACTIONS.MANAGE]
      }
    }
  });

  it("renders <PageHeading />", () => {
    mountedComponent(<FormsList />, initialState);
    expect(screen.getByText(/forms.label/i)).toBeInTheDocument();
  });

  it("renders <FormFilters />", () => {
    mountedComponent(<FormsList />, initialState);
    expect(screen.getByTestId("forms-list")).toBeInTheDocument();
  });

  it("renders form sections", () => {
    mountedComponent(<FormsList />, initialState);
    expect(screen.getAllByTestId("form-group")).toHaveLength(2);
  });

  describe("when there are no records", () => {
    const stateWithoutRecords = initialState.setIn(["records", "admin", "forms", "formSections"], fromJS([]));

    it("renders <FormFilters/>", () => {
      mountedComponent(<FormsList />, stateWithoutRecords);
      expect(screen.getByTestId("form-list")).toBeInTheDocument();
    });
    it("does not renders form sections", () => {
      mountedComponent(<FormsList />, stateWithoutRecords);
      expect(screen.queryAllByTestId("form-group")).toHaveLength(0);
    });
  });
});
