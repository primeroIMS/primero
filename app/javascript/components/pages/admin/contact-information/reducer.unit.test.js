import { fromJS } from "immutable";

import { expect } from "../../../../test/unit-test-helpers";
import { ContactInformationRecord } from "../../support/records";

import actions from "./actions";
import reducer from "./reducer";

describe("<ContactInformation /> - Reducers", () => {
  it("should handle SAVE_CONTACT_INFORMATION_STARTED", () => {
    const expected = fromJS({ loading: true });
    const action = {
      type: actions.SAVE_CONTACT_INFORMATION_STARTED,
      payload: true
    };
    const newState = reducer(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle SAVE_CONTACT_INFORMATION_SUCCESS", () => {
    const data = {
      name: "Primero test",
      organization: "PT",
      phone: "123456789",
      other_information: "",
      support_forum: "",
      email: "primero-support@primero.com",
      location: "",
      position: "",
      system_version: "2.0.0.10"
    };
    const expected = fromJS({
      data: ContactInformationRecord(data)
    });

    const action = {
      type: actions.SAVE_CONTACT_INFORMATION_SUCCESS,
      payload: {
        data
      }
    };

    const newState = reducer(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle SAVE_CONTACT_INFORMATION_FINISHED", () => {
    const expected = fromJS({ loading: false });
    const action = {
      type: actions.SAVE_CONTACT_INFORMATION_FINISHED,
      payload: false
    };
    const newState = reducer(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });
});
