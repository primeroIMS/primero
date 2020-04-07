import configureStore from "redux-mock-store";
import thunk from "redux-thunk";

import * as actionCreators from "./action-creators";

describe("records - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = { ...actionCreators };

    expect(creators, "DEPRECATED setFilters").to.not.have.property(
      "setFilters"
    );
    expect(creators, "DEPRECATED fetchCases").to.not.have.property(
      "fetchCases"
    );
    expect(creators, "DEPRECATED fetchIncidents").to.not.have.property(
      "fetchIncidents"
    );
    expect(creators, "DEPRECATED fetchTracingRequests").to.not.have.property(
      "fetchTracingRequests"
    );
    expect(creators).to.have.property("fetchRecord");
    expect(creators).to.have.property("saveRecord");
    delete creators.setFilters;
    delete creators.fetchCases;
    delete creators.fetchIncidents;
    delete creators.fetchTracingRequests;
    delete creators.fetchRecord;
    delete creators.saveRecord;

    expect(creators).to.deep.equal({});
  });

  it("should check the 'fetchRecord' action creator to return the correct object", () => {
    const store = configureStore([thunk])({});

    return store
      .dispatch(actionCreators.fetchRecord("cases", "123"))
      .then(() => {
        const actions = store.getActions();

        expect(actions[0].type).to.eql("cases/RECORD");
        expect(actions[0].api.path).to.eql("cases/123");
      });
  });

  describe("should check the 'saveRecord' action creator", () => {
    const body = {
      data: {
        name_first: "Gerald",
        name_last: "Padgett",
        name_given_post_separation: "true",
        registration_date: "2019-08-06",
        sex: "male",
        age: 26,
        date_of_birth: "1993-06-05",
        module_id: "primeromodule-cp"
      }
    };

    it("when path it's 'update' should return the correct object", () => {
      const store = configureStore([thunk])({});

      return store
        .dispatch(
          actionCreators.saveRecord("cases", "update", body, "123", () => {})
        )
        .then(() => {
          const actions = store.getActions();

          expect(actions[0].type).to.eql("cases/SAVE_RECORD");
          expect(actions[0].api.path).to.eql("cases/123");
          expect(actions[0].api.method).to.eql("PATCH");
          expect(actions[0].api.body).to.eql(body);
        });
    });

    it("when path it's not 'update', the path and method should be different", () => {
      const store = configureStore([thunk])({});

      return store
        .dispatch(
          actionCreators.saveRecord("cases", "update", body, "123", () => {})
        )
        .then(() => {
          const actions = store.getActions();

          expect(actions[0].type).to.eql("cases/SAVE_RECORD");
          expect(actions[0].api.path).to.eql("cases/123");
          expect(actions[0].api.method).to.eql("PATCH");
          expect(actions[0].api.body).to.eql(body);
        });
    });
  });
});
