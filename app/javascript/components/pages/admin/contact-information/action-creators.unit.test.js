import { stub } from "../../../../test";
import { RECORD_PATH } from "../../../../config";
import { ENQUEUE_SNACKBAR, generate } from "../../../notifier";

import * as actionsCreators from "./action-creators";
import actions from "./actions";

describe("<ContactInformation /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = { ...actionsCreators };

    ["saveContactInformation"].forEach(property => {
      expect(creators).to.have.property(property);
      delete creators[property];
    });

    expect(creators).to.be.empty;
  });

  it("should check that 'saveContactInformation' action creator returns the correct object", () => {
    stub(generate, "messageKey").returns(4);

    const args = {
      body: {
        prop1: "prop-1"
      },
      saveMethod: "update",
      message: "Updated successfully"
    };

    const expectedAction = {
      type: actions.SAVE_CONTACT_INFORMATION,
      api: {
        path: RECORD_PATH.contact_information,
        method: "PATCH",
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
          redirectWithIdFromResponse: false,
          redirect: `/admin/${RECORD_PATH.contact_information}`
        }
      }
    };

    expect(actionsCreators.saveContactInformation(args)).to.deep.equal(
      expectedAction
    );

    generate.messageKey.restore();
  });
});
