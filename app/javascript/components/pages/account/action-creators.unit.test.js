import { stub } from "../../../test";
import { ENQUEUE_SNACKBAR, generate } from "../../notifier";
import { RECORD_PATH, METHODS } from "../../../config";

import * as actionsCreators from "./action-creators";
import actions from "./actions";

describe("pages/account/action-creators.js", () => {
  beforeEach(() => {
    stub(generate, "messageKey").returns(4);
  });

  afterEach(() => {
    generate.messageKey?.restore();
  });

  describe("properties", () => {
    let clone;

    before(() => {
      clone = { ...actionsCreators };
    });

    after(() => {
      expect(clone).to.be.empty;
    });

    ["fetchCurrentUser", "clearCurrentUser", "updateUserAccount"].forEach(property => {
      it(`exports '${property}'`, () => {
        expect(actionsCreators).to.have.property(property);
        delete clone[property];
      });
    });
  });

  it("should check that 'fetchCurrentUser' action creator returns the correct object", () => {
    const expectedAction = {
      type: actions.FETCH_CURRENT_USER,
      api: {
        path: `${RECORD_PATH.users}/1`
      }
    };

    expect(actionsCreators.fetchCurrentUser(1)).to.deep.equal(expectedAction);
  });

  it("should check that 'clearCurrentUser' action creator returns the correct object", () => {
    const expectedAction = {
      type: actions.CLEAR_CURRENT_USER
    };

    expect(actionsCreators.clearCurrentUser()).to.deep.equal(expectedAction);
  });

  it("should check that 'updateUserAccount' action creator returns the correct object", () => {
    const args = {
      id: 10,
      data: { prop1: "prop-1" },
      message: "Updated successfully"
    };

    const expectedAction = {
      type: actions.UPDATE_CURRENT_USER,
      api: {
        path: `${RECORD_PATH.users}/${args.id}`,
        method: METHODS.PATCH,
        body: { data: args.data },
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
          redirect: `/${RECORD_PATH.account}/${args.id}`
        }
      }
    };

    expect(actionsCreators.updateUserAccount(args)).to.deep.equal(expectedAction);
  });
});
