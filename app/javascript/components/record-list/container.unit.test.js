import { expect } from "chai";
import React from "react";
import { Route } from "react-router-dom";
import { fromJS, OrderedMap } from "immutable";

import Filters from "../index-filters";
import IndexTable from "../index-table";
import { ACTIONS } from "../../libs/permissions";
import { setupMountedComponent } from "../../test";
import { FieldRecord, FormSectionRecord } from "../record-form/records";

import ViewModal from "./view-modal";
import RecordList from "./container";

describe("<RecordList />", () => {
  let component;

  beforeEach(() => {
    const initialState = fromJS({
      records: {
        FiltersTabs: {
          current: 0
        },
        cases: {
          data: [
            {
              id: "e15acbe5-9501-4615-9f43-cb6873997fc1",
              name: "Jose",
              record_state: true
            },
            {
              id: "7d55b677-c9c4-7c6c-7a41-bfa1c3f74d1c",
              name: "Carlos",
              record_state: true
            }
          ],
          metadata: { total: 2, per: 20, page: 1 },
          filters: {
            id_search: false,
            query: "",
            record_state: ["true"]
          }
        }
      },
      user: {
        modules: ["primeromodule-cp"],
        listHeaders: {
          cases: [{ id: "name", name: "Name", field_name: "name" }]
        },
        filters: {
          cases: [
            {
              name: "cases.filter_by.enabled_disabled",
              field_name: "record_state",
              option_strings_source: null,
              options: {
                en: [
                  { id: "true", display_name: "Enabled" },
                  { id: "false", display_name: "Disabled" }
                ]
              },
              type: "multi_toggle"
            }
          ]
        },
        permissions: {
          cases: [ACTIONS.MANAGE, ACTIONS.DISPLAY_VIEW_PAGE]
        }
      },
      forms: {
        formSections: OrderedMap({
          1: FormSectionRecord({
            id: 1,
            unique_id: "incident_details_subform_section",
            name: { en: "Nested Incident Details Subform" },
            visible: false,
            is_first_tab: false,
            order: 20,
            order_form_group: 110,
            parent_form: "case",
            editable: true,
            module_ids: [],
            form_group_id: "",
            form_group_name: { en: "Nested Incident Details Subform" },
            fields: [2],
            is_nested: true,
            subform_prevent_item_removal: false,
            collapsed_field_names: [
              "cp_incident_date",
              "cp_incident_violence_type"
            ]
          }),
          2: FormSectionRecord({
            id: 2,
            unique_id: "incident_details_container",
            name: { en: "Incident Details" },
            visible: true,
            is_first_tab: false,
            order: 0,
            order_form_group: 30,
            parent_form: "case",
            editable: true,
            module_ids: ["primeromodule-cp"],
            form_group_id: "identification_registration",
            form_group_name: { en: "Identification / Registration" },
            fields: [1],
            is_nested: false,
            subform_prevent_item_removal: false,
            collapsed_field_names: []
          })
        }),
        fields: OrderedMap({
          1: FieldRecord({
            name: "incident_details",
            type: "subform",
            editable: true,
            disabled: false,
            visible: true,
            subform_section_id: 1,
            help_text: { en: "" },
            display_name: { en: "" },
            multi_select: false,
            option_strings_source: null,
            option_strings_text: {},
            guiding_questions: "",
            required: false,
            date_validation: "default_date_validation",
            hide_on_view_page: false,
            date_include_time: false,
            selected_value: "",
            subform_sort_by: "summary_date",
            show_on_minify_form: false
          }),
          2: FieldRecord({
            name: "cp_incident_location_type_other",
            type: "text_field",
            editable: true,
            disabled: false,
            visfromJSble: true,
            subform_section_id: null,
            help_text: {},
            multi_select: false,
            option_strings_source: null,
            option_strings_text: {},
            guiding_questions: "",
            required: false,
            date_validation: "default_date_validation",
            hide_on_view_page: false,
            date_include_time: false,
            selected_value: "",
            subform_sort_by: "",
            show_on_minify_form: false
          })
        })
      },
      application: {
        online: true,
        modules: [
          {
            unique_id: "primeromodule-cp",
            name: "CP",
            associated_record_types: ["case"]
          }
        ]
      }
    });

    const routedComponent = initialProps => {
      return (
        <Route
          path="/:recordType(cases|incidents|tracing_requests)"
          component={props => <RecordList {...{ ...props, ...initialProps }} />}
        />
      );
    };

    ({ component } = setupMountedComponent(routedComponent, {}, initialState, [
      "/cases"
    ]));
  });

  it("renders record list table", () => {
    expect(component.find(IndexTable)).to.have.length(1);
  });

  it("renders record list table", () => {
    expect(component.find(ViewModal)).to.have.lengthOf(1);
  });

  it("renders filters", () => {
    expect(component.find(Filters)).to.have.lengthOf(1);
  });
});
