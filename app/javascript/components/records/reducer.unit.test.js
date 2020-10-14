import { Map, List, fromJS, OrderedMap } from "immutable";

import { DEFAULT_METADATA, INCIDENT_CASE_ID_FIELD } from "../../config";

import reducer from "./reducer";

describe("<RecordList /> - Reducers", () => {
  const nsReducer = reducer("TestRecordType");

  it("should handle RECORDS_STARTED", () => {
    const expected = Map({ loading: true, errors: false });
    const action = {
      type: "TestRecordType/RECORDS_STARTED",
      payload: true
    };
    const newState = nsReducer(Map({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle RECORDS_FAILURE", () => {
    const expected = Map({ errors: true });
    const action = {
      type: "TestRecordType/RECORDS_FAILURE",
      payload: ["some error"]
    };
    const newState = nsReducer(Map({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle RECORDS_SUCCESS", () => {
    const expected = fromJS({
      data: [{ id: 3 }],
      metadata: { per: 2 }
    });

    const action = {
      type: "TestRecordType/RECORDS_SUCCESS",
      payload: { data: [{ id: 3 }], metadata: { per: 2 } }
    };

    const newState = nsReducer(Map({ data: List([]) }), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle RECORDS_FINISHED", () => {
    const expected = Map({ loading: false });
    const action = {
      type: "TestRecordType/RECORDS_FINISHED",
      payload: false
    };
    const newState = nsReducer(Map({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle SAVE_RECORD_STARTED", () => {
    const expected = fromJS({ saving: true });
    const defaultState = fromJS({});

    const action = {
      type: "TestRecordType/SAVE_RECORD_STARTED",
      payload: true
    };

    const newState = nsReducer(defaultState, action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle SAVE_RECORD_FINISHED", () => {
    const expected = fromJS({ saving: false });
    const defaultState = fromJS({});

    const action = {
      type: "TestRecordType/SAVE_RECORD_FINISHED",
      payload: false
    };

    const newState = nsReducer(defaultState, action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle SAVE_RECORD_FAILURE", () => {
    const expected = fromJS({ saving: false });
    const defaultState = fromJS({});

    const action = {
      type: "TestRecordType/SAVE_RECORD_FAILURE",
      payload: false
    };

    const newState = nsReducer(defaultState, action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle FETCH_RECORD_ALERTS", () => {
    const defaultState = fromJS({
      selectedForm: null,
      formSections: OrderedMap({}),
      fields: OrderedMap({})
    });
    const data = [
      {
        alert_for: "field_change",
        type: "notes",
        date: "2020-04-02",
        form_unique_id: "notes"
      }
    ];
    const expected = fromJS({
      selectedForm: null,
      formSections: OrderedMap({}),
      fields: OrderedMap({}),
      recordAlerts: fromJS(data)
    });

    const action = {
      type: "TestRecordType/FETCH_RECORD_ALERTS_SUCCESS",
      payload: {
        data
      }
    };

    const newState = nsReducer(defaultState, action);

    expect(newState).to.deep.equals(expected);
  });

  it("should handle CLEAR_METADATA", () => {
    const expected = fromJS({
      metadata: DEFAULT_METADATA
    });

    const action = {
      type: "TestRecordType/CLEAR_METADATA"
    };

    const newState = nsReducer(fromJS({}), action);

    expect(newState).to.deep.equals(expected);
  });

  describe("when record type is cases", () => {
    const casesReducer = reducer("cases");

    it("should handle FETCH_INCIDENT_FROM_CASE_SUCCESS", () => {
      const data = {
        status: "open",
        enabled: true,
        owned_by: "user_1"
      };

      const action = {
        type: "cases/FETCH_INCIDENT_FROM_CASE_SUCCESS",
        payload: { data }
      };

      const newState = casesReducer(fromJS({}), action);

      expect(newState).to.deep.equals(fromJS({ incidentFromCase: data }));
    });

    it("should handle SET_CASE_ID_FOR_INCIDENT", () => {
      const incidentFromCase = {
        status: "open",
        enabled: true,
        owned_by: "user_1"
      };

      const action = {
        type: "cases/SET_CASE_ID_FOR_INCIDENT",
        payload: { caseId: "case-id-1" }
      };

      const newState = casesReducer(fromJS({ incidentFromCase }), action);

      expect(newState).to.deep.equals(
        fromJS({ incidentFromCase: { ...incidentFromCase, [INCIDENT_CASE_ID_FIELD]: "case-id-1" } })
      );
    });

    it("should handle CLEAR_CASE_FROM_INCIDENT", () => {
      const stateWithIncidentFromCase = fromJS({
        incidentFromCase: {
          status: "open",
          enabled: true,
          owned_by: "user_1"
        }
      });

      const action = { type: "cases/CLEAR_CASE_FROM_INCIDENT" };

      const newState = casesReducer(stateWithIncidentFromCase, action);

      expect(newState).to.deep.equals(fromJS({}));
    });
  });
});
