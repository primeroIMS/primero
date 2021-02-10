import { Map, List, fromJS, OrderedMap } from "immutable";

import { DEFAULT_METADATA, INCIDENT_CASE_ID_FIELD, INCIDENT_CASE_ID_DISPLAY_FIELD } from "../../config";

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

  it("should append the selectedRecord when RECORDS_SUCCESS", () => {
    const data = fromJS([
      { id: "abc1", status: "open" },
      { id: "abc2", status: "open" }
    ]);

    const expected = fromJS({ data, metadata: { per: 2 }, selectedRecord: "abc2" });

    const action = {
      type: "TestRecordType/RECORDS_SUCCESS",
      payload: {
        data: [{ id: "abc1", status: "open" }],
        metadata: { per: 2 }
      }
    };

    const newState = nsReducer(Map({ data, selectedRecord: "abc2" }), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should merge the selectedRecord when RECORDS_SUCCESS", () => {
    const record1 = { id: "abc1", status: "open" };
    const record2 = { id: "abc2", status: "open" };
    const data = fromJS([record1, record2]);

    const expected = fromJS({
      data: [{ ...record1, status: "closed" }, record2],
      metadata: { per: 2 },
      selectedRecord: "abc1"
    });

    const action = {
      type: "TestRecordType/RECORDS_SUCCESS",
      payload: {
        data: [{ id: "abc1", status: "closed" }, record2],
        metadata: { per: 2 }
      }
    };

    const newState = nsReducer(Map({ data, selectedRecord: "abc1" }), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should replace data if there is no selectedRecord when RECORDS_SUCCESS", () => {
    const record1 = { id: "abc1", status: "open" };
    const data = fromJS([record1, { id: "abc2", status: "open" }]);

    const expected = fromJS({ data: [record1], metadata: { per: 2 } });

    const action = {
      type: "TestRecordType/RECORDS_SUCCESS",
      payload: {
        data: [record1],
        metadata: { per: 2 }
      }
    };

    const newState = nsReducer(Map({ data }), action);

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

  it("should handle SET_SELECTED_RECORD", () => {
    const expected = fromJS({
      selectedRecord: "123"
    });

    const action = {
      type: "TestRecordType/SET_SELECTED_RECORD",
      payload: { id: "123" }
    };

    const newState = nsReducer(fromJS({}), action);

    expect(newState).to.deep.equals(expected);
  });

  it("should handle CLEAR_SELECTED_RECORD", () => {
    const expected = fromJS({});

    const action = {
      type: "TestRecordType/CLEAR_SELECTED_RECORD"
    };

    const newState = nsReducer(fromJS({ selectedRecord: "123" }), action);

    expect(newState).to.deep.equals(expected);
  });

  it("should handle SET_ATTACHMENT_STATUS", () => {
    const expected = fromJS({
      recordAttachments: { field_1: { fieldName: "field_1", processing: false, error: false } }
    });

    const action = {
      type: "TestRecordType/SET_ATTACHMENT_STATUS",
      payload: { fieldName: "field_1", processing: false, error: false }
    };

    const newState = nsReducer(fromJS({ recordAttachments: {} }), action);

    expect(newState).to.deep.equals(expected);
  });

  it("should handle CLEAR_RECORD_ATTACHMENTS", () => {
    const expected = fromJS({ recordAttachments: {} });

    const action = {
      type: "TestRecordType/CLEAR_RECORD_ATTACHMENTS"
    };

    const newState = nsReducer(fromJS({ recordAttachments: { field_1: { processing: true } } }), action);

    expect(newState).to.deep.equals(expected);
  });

  it("should handle FETCH_TRACE_POTENTIAL_MATCHES_STARTED", () => {
    const expected = fromJS({ potentialMatches: { loading: true, errors: false } });

    const action = {
      type: "TestRecordType/FETCH_TRACE_POTENTIAL_MATCHES_STARTED"
    };

    const newState = nsReducer(fromJS({}), action);

    expect(newState).to.deep.equals(expected);
  });

  it("should handle FETCH_TRACE_POTENTIAL_MATCHES_SUCCESS", () => {
    const potentialMatch = {
      score: 1,
      likelihood: "possible",
      case: { id: "case-123" },
      trace: { id: "trace-789" }
    };
    const record = {
      id: "trace-789",
      type: "trace"
    };

    const expected = fromJS({ potentialMatches: { data: [potentialMatch], record } });

    const action = {
      type: "TestRecordType/FETCH_TRACE_POTENTIAL_MATCHES_SUCCESS",
      payload: { data: { potential_matches: [potentialMatch], record } }
    };

    const newState = nsReducer(fromJS({}), action);

    expect(newState).to.deep.equals(expected);
  });

  it("should handle FETCH_TRACE_POTENTIAL_MATCHES_FAILURE", () => {
    const expected = fromJS({ potentialMatches: { errors: true } });

    const action = {
      type: "TestRecordType/FETCH_TRACE_POTENTIAL_MATCHES_FAILURE"
    };

    const newState = nsReducer(fromJS({}), action);

    expect(newState).to.deep.equals(expected);
  });

  it("should handle FETCH_TRACE_POTENTIAL_MATCHES_FINISHED", () => {
    const expected = fromJS({ potentialMatches: { loading: false } });

    const action = {
      type: "TestRecordType/FETCH_TRACE_POTENTIAL_MATCHES_FINISHED"
    };

    const newState = nsReducer(fromJS({}), action);

    expect(newState).to.deep.equals(expected);
  });

  it("should handle SET_MACHED_CASE_FOR_TRACE_STARTED", () => {
    const expected = fromJS({ loading: true });

    const action = {
      type: "TestRecordType/SET_MACHED_CASE_FOR_TRACE_STARTED"
    };

    const newState = nsReducer(fromJS({}), action);

    expect(newState).to.deep.equals(expected);
  });

  it("should handle SET_MACHED_CASE_FOR_TRACE_STARTED", () => {
    const expected = fromJS({ loading: true });

    const action = {
      type: "TestRecordType/SET_MACHED_CASE_FOR_TRACE_STARTED"
    };

    const newState = nsReducer(fromJS({}), action);

    expect(newState).to.deep.equals(expected);
  });

  it("should handle SET_MACHED_CASE_FOR_TRACE_STARTED", () => {
    const expected = fromJS({ loading: true });

    const action = {
      type: "TestRecordType/SET_MACHED_CASE_FOR_TRACE_STARTED"
    };

    const newState = nsReducer(fromJS({}), action);

    expect(newState).to.deep.equals(expected);
  });

  it("should handle SET_MACHED_CASE_FOR_TRACE_SUCCESS", () => {
    const trace = { unique_id: "tr-001" };

    const expected = fromJS({
      data: [{ id: "12345", tracing_request_subform_section: [{ ...trace, matched_case_id: "cs-001", id: "tr-001" }] }]
    });

    const action = {
      type: "TestRecordType/SET_MACHED_CASE_FOR_TRACE_SUCCESS",
      payload: { data: { id: "tr-001", matched_case_id: "cs-001" } }
    };

    const newState = nsReducer(fromJS({ data: [{ id: "12345", tracing_request_subform_section: [trace] }] }), action);

    expect(newState).to.deep.equals(expected);
  });

  it("should handle SET_MACHED_CASE_FOR_TRACE_FAILURE", () => {
    const expected = fromJS({ errors: true });

    const action = {
      type: "TestRecordType/SET_MACHED_CASE_FOR_TRACE_FAILURE"
    };

    const newState = nsReducer(fromJS({}), action);

    expect(newState).to.deep.equals(expected);
  });

  it("should handle SET_MACHED_CASE_FOR_TRACE_FINISHED", () => {
    const expected = fromJS({ loading: false });

    const action = {
      type: "TestRecordType/SET_MACHED_CASE_FOR_TRACE_FINISHED"
    };

    const newState = nsReducer(fromJS({}), action);

    expect(newState).to.deep.equals(expected);
  });

  it("should handle FETCH_TRACING_REQUEST_TRACES_STARTED", () => {
    const expected = fromJS({ loading: true });

    const action = {
      type: "TestRecordType/FETCH_TRACING_REQUEST_TRACES_STARTED"
    };

    const newState = nsReducer(fromJS({}), action);

    expect(newState).to.deep.equals(expected);
  });

  it("should handle FETCH_TRACING_REQUEST_TRACES_SUCCESS", () => {
    const expected = fromJS({
      data: [
        {
          id: "123",
          tracing_request_subform_section: [
            { unique_id: "567", name: "test", id: "567", tracing_request_id: "123", matched_case_id: "890" }
          ]
        }
      ]
    });

    const action = {
      type: "TestRecordType/FETCH_TRACING_REQUEST_TRACES_SUCCESS",
      payload: {
        data: [
          {
            id: "567",
            tracing_request_id: "123",
            matched_case_id: "890"
          }
        ]
      }
    };

    const newState = nsReducer(
      fromJS({
        data: [
          {
            id: "123",
            tracing_request_subform_section: [{ unique_id: "567", name: "test" }]
          }
        ]
      }),
      action
    );

    expect(newState).to.deep.equals(expected);
  });

  it("should handle ", () => {
    const expected = fromJS({ errors: true });

    const action = {
      type: "TestRecordType/FETCH_TRACING_REQUEST_TRACES_FAILURE"
    };

    const newState = nsReducer(fromJS({}), action);

    expect(newState).to.deep.equals(expected);
  });

  it("should handle FETCH_TRACING_REQUEST_TRACES_FINISHED", () => {
    const expected = fromJS({ loading: false });

    const action = {
      type: "TestRecordType/FETCH_TRACING_REQUEST_TRACES_FINISHED"
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

      expect(newState).to.deep.equals(fromJS({ incidentFromCase: { data } }));
    });

    it("should handle SET_CASE_ID_FOR_INCIDENT", () => {
      const incidentFromCase = {
        status: "open",
        enabled: true,
        owned_by: "user_1"
      };

      const action = {
        type: "cases/SET_CASE_ID_FOR_INCIDENT",
        payload: {
          caseId: "case-unique-id-1",
          caseIdDisplay: "case-display-id-1"
        }
      };

      const newState = casesReducer(fromJS({ incidentFromCase }), action);

      expect(newState).to.deep.equals(
        fromJS({
          incidentFromCase: {
            ...incidentFromCase,
            [INCIDENT_CASE_ID_FIELD]: "case-unique-id-1",
            [INCIDENT_CASE_ID_DISPLAY_FIELD]: "case-display-id-1"
          }
        })
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

    it("should handle SET_CASE_ID_REDIRECT", () => {
      const incidentFromCase = fromJS({});
      const action = { type: "cases/SET_CASE_ID_REDIRECT", payload: { json: { data: { id: "case-id-1" } } } };
      const newState = casesReducer(incidentFromCase, action);

      expect(newState).to.deep.equals(fromJS({ incidentFromCase: { incident_case_id: "case-id-1" } }));
    });

    it("should handle FETCH_CASES_POTENTIAL_MATCHES_STARTED", () => {
      const expected = fromJS({ potentialMatches: { loading: true, errors: false } });
      const defaultState = fromJS({});

      const action = {
        type: "TestRecordType/FETCH_CASES_POTENTIAL_MATCHES_STARTED",
        payload: true
      };

      const newState = nsReducer(defaultState, action);

      expect(newState).to.deep.equal(expected);
    });

    it("should handle FETCH_CASES_POTENTIAL_MATCHES_FINISHED", () => {
      const expected = fromJS({ potentialMatches: { loading: false } });
      const defaultState = fromJS({});

      const action = {
        type: "TestRecordType/FETCH_CASES_POTENTIAL_MATCHES_FINISHED",
        payload: false
      };

      const newState = nsReducer(defaultState, action);

      expect(newState).to.deep.equal(expected);
    });

    it("should handle FETCH_CASES_POTENTIAL_MATCHES_FAILURE", () => {
      const expected = fromJS({ potentialMatches: { errors: true } });
      const defaultState = fromJS({});

      const action = {
        type: "TestRecordType/FETCH_CASES_POTENTIAL_MATCHES_FAILURE",
        payload: true
      };

      const newState = nsReducer(defaultState, action);

      expect(newState).to.deep.equal(expected);
    });
  });

  it("should handle FETCH_CASE_MATCHED_TRACES_STARTED", () => {
    const expected = fromJS({ matchedTraces: { loading: true, errors: false } });
    const defaultState = fromJS({});

    const action = {
      type: "TestRecordType/FETCH_CASE_MATCHED_TRACES_STARTED",
      payload: true
    };

    const newState = nsReducer(defaultState, action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle FETCH_CASE_MATCHED_TRACES_FINISHED", () => {
    const expected = fromJS({ matchedTraces: { loading: false } });
    const defaultState = fromJS({});

    const action = {
      type: "TestRecordType/FETCH_CASE_MATCHED_TRACES_FINISHED",
      payload: false
    };

    const newState = nsReducer(defaultState, action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle FETCH_CASE_MATCHED_TRACES_FAILURE", () => {
    const expected = fromJS({ matchedTraces: { errors: true } });
    const defaultState = fromJS({});

    const action = {
      type: "TestRecordType/FETCH_CASE_MATCHED_TRACES_FAILURE",
      payload: true
    };

    const newState = nsReducer(defaultState, action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle FETCH_CASE_MATCHED_TRACES_SUCCESS", () => {
    const defaultState = fromJS({});
    const data = [
      {
        sex: "male",
        inquiry_date: "2021-01-13",
        tracing_request_id: "f6c3483e-d6e6-482e-bd7a-9c5808e0798c",
        name: "Gustavo Cerati",
        relation_name: null,
        matched_case_id: "b216d9a8-5390-4d20-802b-ae415151ddbf",
        inquirer_id: "dc7a9dde-0b80-4488-b480-35f571c977c3",
        id: "3d930cd0-de41-4c5b-959e-7bb6ca4b3f3e",
        relation: "brother",
        age: 10
      }
    ];

    const action = {
      type: "TestRecordType/FETCH_CASE_MATCHED_TRACES_SUCCESS",
      payload: { data }
    };

    const newState = nsReducer(defaultState, action);

    expect(newState).to.deep.equals(fromJS({ matchedTraces: { data } }));
  });

  it("should handle CLEAR_MATCHED_TRACES", () => {
    const expected = fromJS({});
    const action = { type: "TestRecordType/CLEAR_MATCHED_TRACES" };

    const newState = nsReducer(fromJS({ matchedTraces: { data: [{ id: "12345" }] } }), action);

    expect(newState).to.deep.equals(expected);
  });

  it("should handle CLEAR_POTENTIAL_MATCHES", () => {
    const expected = fromJS({});
    const action = { type: "TestRecordType/CLEAR_POTENTIAL_MATCHES" };

    const newState = nsReducer(fromJS({ potentialMatches: { data: [{ id: "12345" }] } }), action);

    expect(newState).to.deep.equals(expected);
  });

  it("should handle EXTERNAL_SYNC_SUCCESS", () => {
    const expected = fromJS({
      data: [
        {
          id: "123",
          sync_status: "synced"
        }
      ]
    });

    const action = {
      type: "TestRecordType/EXTERNAL_SYNC_SUCCESS",
      payload: {
        data: {
          record_id: "123",
          record_type: "cases",
          sync_status: "synced"
        }
      }
    };

    const newState = nsReducer(
      fromJS({
        data: [
          {
            id: "123",
            sync_status: "failed"
          }
        ]
      }),
      action
    );

    expect(newState).to.deep.equals(expected);
  });
});
