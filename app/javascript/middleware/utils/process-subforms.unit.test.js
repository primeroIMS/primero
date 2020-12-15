import { stub } from "../../test";
import { METHODS } from "../../config";
import { ENQUEUE_SNACKBAR, generate } from "../../components/notifier";
import { SUBFORM_SECTION } from "../../components/form";

import processSubforms from "./process-subforms";

describe("middleware/utils/process-subforms.js", () => {
  beforeEach(() => {
    stub(generate, "messageKey").returns(4);
  });

  afterEach(() => {
    generate.messageKey?.restore();
  });

  const callback = {
    type: "SAVE_PARENT",
    api: {
      path: "/test",
      method: METHODS.PATCH,
      body: {
        data: {
          fields: [
            {
              name: "good_subform_test_1",
              visible: true,
              order: 0,
              type: SUBFORM_SECTION,
              subform_section_unique_id: "good_subform_test_1"
            },
            {
              name: "good_subform_test_2",
              visible: true,
              order: 1,
              type: SUBFORM_SECTION,
              subform_section_unique_id: "good_subform_test_2"
            }
          ]
        }
      },
      successCallback: {
        action: ENQUEUE_SNACKBAR,
        payload: {
          message: "Succesfully updated",
          options: {
            variant: "success",
            key: generate.messageKey()
          }
        }
      }
    }
  };

  describe("when responses are ok", () => {
    const responses = [
      {
        status: "fulfilled",
        value: {
          ok: true,
          path: "/api/v2/forms",
          status: 200,
          json: {
            data: {
              id: 1,
              type: SUBFORM_SECTION,
              unique_id: "good_subform_test_1"
            }
          }
        }
      },
      {
        status: "fulfilled",
        value: {
          ok: true,
          path: "/api/v2/forms",
          status: 200,
          json: {
            data: {
              id: 2,
              type: SUBFORM_SECTION,
              unique_id: "good_subform_test_2"
            }
          }
        }
      }
    ];

    it("should return successCallback of parentForm, with subformFields linked to the created subforms", () => {
      const expectedFields = [
        {
          name: "good_subform_test_1",
          visible: true,
          order: 0,
          type: SUBFORM_SECTION,
          subform_section_id: 1,
          subform_section_unique_id: "good_subform_test_1"
        },
        {
          name: "good_subform_test_2",
          visible: true,
          order: 1,
          type: SUBFORM_SECTION,
          subform_section_id: 2,
          subform_section_unique_id: "good_subform_test_2"
        }
      ];
      const parentFormCallback = processSubforms(callback, responses);

      expect(parentFormCallback.api.body.data.fields).to.deep.equals(expectedFields);
    });
  });

  describe("when responses has errors", () => {
    const failResponses = [
      {
        status: "fulfilled",
        value: {
          ok: false,
          path: "/api/v2/forms",
          status: 422,
          json: {
            errors: {
              detail: "unique_id",
              message: ["errors.models.form_section.unique_id"],
              resource: "/api/v2/forms",
              status: 422,
              value: "good_subform_test_1"
            }
          }
        }
      },
      {
        status: "fulfilled",
        value: {
          ok: true,
          path: "/api/v2/forms",
          status: 200,
          json: {
            data: {
              id: 2,
              type: SUBFORM_SECTION,
              subform_section_id: 2,
              unique_id: "good_subform_test_2"
            }
          }
        }
      }
    ];

    it("should return successCallback of parentForm, extracting subformFields with errors", () => {
      const expectedFields = [
        {
          type: SUBFORM_SECTION,
          subform_section_id: 2,
          name: "good_subform_test_2",
          visible: true,
          order: 1,
          subform_section_unique_id: "good_subform_test_2"
        }
      ];
      const parentFormCallback = processSubforms(callback, failResponses);

      expect(parentFormCallback.api.body.data.fields).to.deep.equals(expectedFields);
    });
  });
});
