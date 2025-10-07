// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import * as actionCreators from "./action-creators";
import actions from "./actions";

describe("<FormsList /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = { ...actionCreators };

    [
      "clearExportForms",
      "clearFormsReorder",
      "enableReorder",
      "fetchForms",
      "reorderFormGroups",
      "reorderFormSections",
      "reorderedForms",
      "saveFormsReorder",
      "exportForms"
    ].forEach(property => {
      expect(creators).toHaveProperty(property);
      delete creators[property];
    });

    expect(Object.keys(creators)).toHaveLength(0);
  });

  it("should check the 'enableReorder' action creator returns the correct object", () => {
    const expected = {
      type: actions.ENABLE_REORDER,
      payload: true
    };

    expect(actionCreators.enableReorder(true)).toEqual(expected);
  });

  it("should check the 'reorderFormGroups' action creator returns the correct object", () => {
    const formGroupId = "form_group_id_1";
    const order = 10;
    const filter = { recordType: "type-1", module_ids: ["module-1"] };
    const expected = {
      type: actions.REORDER_FORM_GROUPS,
      payload: { formGroupId, order, filter }
    };

    expect(actionCreators.reorderFormGroups(formGroupId, order, filter)).toEqual(expected);
  });

  it("should check the 'reorderFormSections' action creator returns the correct object", () => {
    const id = "form_1";
    const order = 0;
    const filter = { recordType: "type-1", module_ids: ["module-1"] };
    const expected = {
      type: actions.REORDER_FORM_SECTIONS,
      payload: { id, order, filter }
    };

    expect(actionCreators.reorderFormSections(id, order, filter)).toEqual(expected);
  });

  it("should check the 'reorderedForms' action creator returns the correct object", () => {
    const ids = [1, 2, 3, 4];
    const expected = {
      type: actions.SET_REORDERED_FORMS,
      payload: { ids }
    };

    expect(actionCreators.reorderedForms(ids)).toEqual(expected);
  });

  it("should check the 'saveFormsReorder' action creator returns the correct object", () => {
    const forms = fromJS([
      {
        id: 1,
        order_form_group: 10,
        order: 0
      },
      { id: 2, order_form_group: 20, order: 1 }
    ]);

    const expected = {
      type: actions.SAVE_FORMS_REORDER,
      api: [
        {
          path: "forms/1",
          method: "PATCH",
          body: {
            data: {
              order: 0,
              order_form_group: 10
            }
          }
        },
        {
          path: "forms/2",
          method: "PATCH",
          body: {
            data: {
              order: 1,
              order_form_group: 20
            }
          }
        }
      ],
      finishedCallback: {
        type: actions.ENABLE_REORDER,
        payload: false
      }
    };

    expect(actionCreators.saveFormsReorder(forms)).toEqual(expected);
  });

  it("should check the 'clearFormsReorder' action creator returns the correct object", () => {
    const expected = {
      type: actions.CLEAR_FORMS_REORDER
    };

    expect(actionCreators.clearFormsReorder()).toEqual(expected);
  });

  it("should check the 'exportForms' action creator returns the correct object", () => {
    const message = "Successfully exported";
    const params = {
      export_type: "xlsx",
      record_type: "case",
      module_id: "primeromodule-cp"
    };

    const expected = {
      api: {
        method: "GET",
        params: {
          export_type: "xlsx",
          module_id: "primeromodule-cp",
          record_type: "case"
        },
        path: "/forms/export",
        successCallback: [
          {
            action: "CLEAR_DIALOG"
          },
          {
            action: "notifications/ENQUEUE_SNACKBAR",
            payload: {
              message: "Successfully exported",
              options: {
                key: "successfully-exported",
                variant: "success"
              }
            },
            redirect: false,
            redirectWithIdFromResponse: false
          }
        ]
      },
      type: "admin/forms/EXPORT_FORMS"
    };

    expect(actionCreators.exportForms({ params, message })).toEqual(expected);
  });

  it("should check the 'clearExportForms' action creator returns the correct object", () => {
    const expected = {
      type: actions.CLEAR_EXPORT_FORMS
    };

    expect(actionCreators.clearExportForms()).toEqual(expected);
  });
});
