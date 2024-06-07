// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { mapEntriesToRecord } from "../../../../libs";
import { FormSectionRecord } from "../../../form/records";
import { RECORD_TYPES } from "../../../../config/constants";
import { ACTIONS } from "../../../permissions";
import { mountedComponent, screen, within } from "../../../../test-utils";

import FormsBuilder from "./component";

describe("<FormsBuilder />", () => {
  const formSections = [
    {
      id: 1,
      unique_id: "form_section_1",
      parent_form: "case",
      module_ids: fromJS(["primeromodule-cp"]),
      order: 1,
      form_group_id: "group_1",
      order_form_group: 2,
      fields: fromJS([])
    },
    {
      id: 2,
      unique_id: "form_section_2",
      parent_form: "case",
      module_ids: fromJS(["primeromodule-cp"]),
      order: 2,
      form_group_id: "group_1",
      order_form_group: 2,
      fields: fromJS([])
    },
    {
      id: 5,
      unique_id: "form_section_5",
      parent_form: "case",
      module_ids: fromJS(["primeromodule-cp"]),
      order: 1,
      form_group_id: "group_2",
      order_form_group: 1,
      fields: fromJS([])
    },
    {
      id: 6,
      unique_id: "form_section_6",
      parent_form: "case",
      module_ids: fromJS(["primeromodule-cp"]),
      order: 1,
      is_nested: true,
      form_group_id: "group_2",
      order_form_group: 1,
      fields: fromJS([])
    }
  ];

  const user = {
    permissions: {
      metadata: [ACTIONS.MANAGE]
    }
  };

  const initialState = fromJS({
    application: {
      modules: [
        {
          unique_id: "primeromodule-cp",
          name: "CP",
          associated_record_types: [RECORD_TYPES.cases, RECORD_TYPES.tracing_requests, RECORD_TYPES.incidents]
        }
      ]
    },
    records: {
      admin: {
        forms: {
          formSections: mapEntriesToRecord(formSections, FormSectionRecord, true),
          selectedForm: FormSectionRecord(formSections[0]),
          loading: false
        }
      }
    },
    user
  });

  describe("when is a new form", () => {
    beforeEach(() => {
      mountedComponent(<FormsBuilder mode="new" />, initialState);
    });

    it("renders a enabled Settings Tab ", () => {
      const tabs = within(screen.getByRole("tablist")).getAllByRole("tab");

      expect(tabs.at(0)).toBeEnabled();
      expect(tabs.at(1)).toBeDisabled();
      expect(tabs.at(2)).toBeDisabled();
    });
  });

  describe("when in edit mode", () => {
    beforeEach(() => {
      mountedComponent(<FormsBuilder mode="edit" />, initialState, {}, ["/admin/forms/1/edit"]);
    });

    // FIXME: Rendered component always showing loading progress even though loading is false
    it.skip("renders all tabs enabled ", () => {
      within(screen.getByRole("tablist"))
        .getAllByRole("tab")
        .map(element => expect(element).toBeEnabled());
    });
  });

  describe("when the form is a subform", () => {
    let storeInstance;

    beforeEach(() => {
      const { store } = mountedComponent(
        <FormsBuilder mode="new" />,
        fromJS({
          records: {
            admin: {
              forms: {
                formSections: mapEntriesToRecord(formSections, FormSectionRecord, true),
                selectedForm: FormSectionRecord(formSections[3])
              }
            }
          },
          user
        })
      );

      storeInstance = store;
    });

    it("redirects to forms list since subforms are edited through the field dialog", () => {
      const actions = storeInstance.getActions();

      expect(actions[4].payload.args).toStrictEqual(["/admin/forms"]);
      expect(actions[4].payload.method).toBe("push");
    });
  });
});
