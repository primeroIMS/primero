import { fromJS } from "immutable";

import { stub } from "../../../../../test";
import { RECORD_PATH, METHODS } from "../../../../../config";
import { ENQUEUE_SNACKBAR, generate } from "../../../../notifier";
import { CLEAR_DIALOG } from "../../../../action-dialog";
import mainActions from "../actions";

import * as actionsCreators from "./action-creators";
import actions from "./actions";

describe("<ImportDialog /> - action-creators", () => {
  describe("exported action-creators", () => {
    let clone;

    before(() => {
      clone = { ...actionsCreators };
    });

    after(() => {
      expect(clone).to.be.empty;
    });

    ["importLocations", "clearImportErrors"].forEach(actionCreator => {
      it(`exports '${actionCreator}'`, () => {
        expect(clone).to.have.property(actionCreator);
        delete clone[actionCreator];
      });
    });
  });

  describe("exported objects by action-creators", () => {
    it("should check that 'clearImportErrors' action creator returns the correct object", () => {
      const expected = {
        type: actions.CLEAR_IMPORT_ERRORS
      };

      expect(actionsCreators.clearImportErrors()).to.deep.equal(expected);
    });

    it("should check that 'importLocations' action creator returns the correct object", () => {
      stub(generate, "messageKey").returns(4);

      const args = {
        body: {
          data: {
            file_name: "test_file_name.csv",
            data_base64: ""
          }
        },
        message: "Saved successfully",
        params: { data: {} }
      };

      const expected = {
        type: actions.IMPORT_LOCATIONS,
        api: {
          path: `${RECORD_PATH.locations}/import`,
          method: METHODS.POST,
          body: args.body,
          successCallback: [
            {
              action: CLEAR_DIALOG
            },
            {
              action: ENQUEUE_SNACKBAR,
              payload: {
                message: args.message,
                options: {
                  key: 4,
                  variant: "success"
                }
              }
            },
            {
              action: mainActions.LOCATIONS,
              api: {
                path: RECORD_PATH.locations,
                params: { hierarchy: true }
              }
            }
          ]
        }
      };
      const result = actionsCreators.importLocations(args);

      expect(fromJS(result)).to.deep.equal(fromJS(expected));
    });
  });

  afterEach(() => {
    if (generate.messageKey.restore) {
      generate.messageKey.restore();
    }
  });
});
