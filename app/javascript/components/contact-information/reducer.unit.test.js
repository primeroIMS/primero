// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import reducer from "./reducer";
import { ContactInformationRecord } from "./records";

describe("<RecordList /> - Reducers", () => {
  it("should handle FETCH_DATA_SUCCESS", () => {
    const expected = {
      name: "Simon Nehme",
      organization: "UNICEF",
      position: "Child Protection Officer - CPIMS Administrator",
      phone: "+961 70 673 187",
      email: "snehme@unicef.org",
      location: "United Nations Children’s Fund Lebanon",
      support_forum: "https://google.com",
      other_information: "",
      primeroVersion: "1.3.15"
    };
    const action = {
      type: "support/FETCH_DATA_SUCCESS",
      payload: {
        data: {
          name: "Simon Nehme",
          organization: "UNICEF",
          position: "Child Protection Officer - CPIMS Administrator",
          phone: "+961 70 673 187",
          email: "snehme@unicef.org",
          location: "United Nations Children’s Fund Lebanon",
          support_forum: "https://google.com",
          other_information: "",
          primeroVersion: "1.3.15"
        }
      }
    };
    const newState = reducer(fromJS({}), action);

    expect(newState.get("data")).toEqual(ContactInformationRecord(expected));
  });

  it("should handle FETCH_DATA_STARTED", () => {
    const action = {
      type: "support/FETCH_DATA_STARTED",
      payload: true
    };
    const newState = reducer(fromJS({}), action);

    expect(newState.get("loading")).toEqual(true);
    expect(newState.get("errors")).toEqual(false);
  });

  it("should handle FETCH_DATA_FINISHED", () => {
    const action = {
      type: "support/FETCH_DATA_FINISHED",
      payload: false
    };
    const newState = reducer(fromJS({}), action);

    expect(newState.get("loading")).toEqual(false);
  });

  it("should handle FETCH_DATA_FAILURE", () => {
    const action = {
      type: "support/FETCH_DATA_FAILURE",
      payload: false
    };
    const newState = reducer(fromJS({}), action);

    expect(newState.get("errors")).toEqual(true);
  });
});
