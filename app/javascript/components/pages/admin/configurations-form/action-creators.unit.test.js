// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { RECORD_PATH, METHODS, SAVE_METHODS, ROUTES } from "../../../../config";
import { ENQUEUE_SNACKBAR, generate, SNACKBAR_VARIANTS } from "../../../notifier";

import * as actionsCreators from "./action-creators";
import actions from "./actions";

describe("configurations-form/action-creators.js", () => {
  describe("exported action-creators", () => {
    let clone;

    beforeAll(() => {
      clone = { ...actionsCreators };
    });

    afterAll(() => {
      expect(Object.keys(clone)).toHaveLength(0);
    });

    [
      "appliedConfigMessage",
      "applyConfiguration",
      "applyingConfigMessage",
      "checkConfiguration",
      "clearSelectedConfiguration",
      "deleteConfiguration",
      "fetchConfiguration",
      "saveConfiguration",
      "sentToProduction"
    ].forEach(actionCreator => {
      it(`exports '${actionCreator}'`, () => {
        expect(clone).toHaveProperty(actionCreator);
        delete clone[actionCreator];
      });
    });
  });

  describe("exported objects by action-creators", () => {
    it("should check that 'applyConfiguration' action creator returns the correct object", () => {
      const args = { id: 1, message: "Test success message" };
      const expected = {
        type: actions.APPLY_CONFIGURATION,
        api: {
          path: `${RECORD_PATH.configurations}/${args.id}`,
          method: METHODS.PATCH,
          body: {
            data: {
              apply_now: true
            }
          },
          configurationCallback: {
            type: actions.CHECK_CONFIGURATION,
            api: {
              external: true,
              path: ROUTES.check_health
            }
          }
        }
      };

      expect(actionsCreators.applyConfiguration(args)).toEqual(expected);
    });

    it("should check that 'checkConfiguration' action creator returns the correct object", () => {
      const expected = {
        type: actions.CHECK_CONFIGURATION,
        api: {
          external: true,
          path: ROUTES.check_health
        }
      };

      expect(actionsCreators.checkConfiguration(1234)).toEqual(expected);
    });

    it("should check that 'clearSelectedConfiguration' action creator returns the correct object", () => {
      const expected = {
        type: actions.CLEAR_SELECTED_CONFIGURATION
      };

      expect(actionsCreators.clearSelectedConfiguration()).toEqual(expected);
    });

    it("should check that 'deleteConfiguration' action creator returns the correct object", () => {
      jest.spyOn(generate, "messageKey").mockReturnValue(4);

      const args = {
        id: 1,
        message: "Deleted successfully"
      };

      const expected = {
        type: actions.DELETE_CONFIGURATION,
        api: {
          path: `${RECORD_PATH.configurations}/${args.id}`,
          method: METHODS.DELETE,
          successCallback: {
            action: ENQUEUE_SNACKBAR,
            payload: {
              message: args.message,
              options: {
                key: 4,
                variant: "success"
              }
            },
            redirectWithIdFromResponse: false,
            redirect: `/admin/${RECORD_PATH.configurations}`
          }
        }
      };

      expect(actionsCreators.deleteConfiguration(args)).toEqual(expected);
    });

    it("should check that 'fetchConfiguration' action creator returns the correct object", () => {
      const expected = {
        type: actions.FETCH_CONFIGURATION,
        api: {
          path: `${RECORD_PATH.configurations}/1234`
        }
      };

      expect(actionsCreators.fetchConfiguration(1234)).toEqual(expected);
    });

    it("should check that 'applyingConfigMessage' action creator returns the correct object", () => {
      const expected = {
        action: ENQUEUE_SNACKBAR,
        payload: {
          messageKey: "configurations.unavailable_server",
          noDismiss: true,
          options: {
            variant: SNACKBAR_VARIANTS.info,
            key: generate.messageKey(99999)
          }
        }
      };

      expect(actionsCreators.applyingConfigMessage()).toEqual(expected);
    });

    it("should check that 'saveConfiguration' action creator returns the correct object", () => {
      jest.spyOn(generate, "messageKey").mockReturnValue(4);

      const args = {
        id: 1,
        body: {
          data: {
            name: "TEST - 20200903",
            description: "September 2020 baseline"
          }
        },
        saveMethod: SAVE_METHODS.new,
        message: "Saved successfully"
      };

      const expected = {
        type: actions.SAVE_CONFIGURATION,
        api: {
          path: RECORD_PATH.configurations,
          method: METHODS.POST,
          body: args.body,
          successCallback: {
            action: ENQUEUE_SNACKBAR,
            payload: {
              message: args.message,
              options: {
                key: 4,
                variant: "success"
              }
            },
            redirectWithIdFromResponse: true,
            redirect: `/admin/${RECORD_PATH.configurations}`
          }
        }
      };

      expect(actionsCreators.saveConfiguration(args)).toEqual(expected);
    });

    it("should check that 'sentToProduction' action creator returns the correct object", () => {
      const expected = {
        type: actions.SEND_TO_PRODUCTION,
        api: {
          path: `${RECORD_PATH.configurations}/12345`,
          method: METHODS.PATCH,
          body: {
            data: {
              promote: true
            }
          },
          successCallback: {
            action: "notifications/ENQUEUE_SNACKBAR",
            payload: {
              message: "Success",
              options: {
                key: "success",
                variant: "success"
              }
            },
            redirect: "",
            redirectWithIdFromResponse: false
          }
        }
      };

      expect(actionsCreators.sentToProduction("12345", "Success")).toEqual(expected);
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});
