import chai, { expect } from "chai";
import { Map } from "immutable";
import chaiImmutable from "chai-immutable";

import { mapEntriesToRecord } from "../../../../../libs";
import { normalizeFormData } from "../../../../../schemas";
import {
  FormSectionRecord,
  FieldRecord
} from "../../../../record-form/records";

import actions from "./actions";
import { reducers } from "./reducers";

chai.use(chaiImmutable);

describe("<FormsList /> - Reducers", () => {
  const initialState = Map({
    formSections: Map({}),
    fields: Map({})
  });

  it.skip("should handle RECORD_FORMS_SUCCESS", () => {
    const fields = [
      {
        id: 1,
        name: "name_first"
      }
    ];

    const formSections = [
      {
        id: 62,
        unique_id: "basic_identity",
        fields
      }
    ];

    const {
      fields: normalizedFields,
      formSections: normalizedFormSections
    } = normalizeFormData(formSections).entities;

    const expectedState = Map({
      formSections: mapEntriesToRecord(
        normalizedFormSections,
        FormSectionRecord,
        true
      ),
      fields: mapEntriesToRecord(normalizedFields, FieldRecord, true)
    });

    const action = {
      type: actions.RECORD_FORMS_SUCCESS,
      payload: {
        data: formSections
      }
    };

    const newState = reducers.forms(initialState, action);

    expect(newState).to.deep.equal(expectedState);
  });

  it("should handle RECORD_FORMS_STARTED", () => {
    const expected = Map({
      formSections: Map({}),
      fields: Map({}),
      errors: false,
      loading: true
    });

    const action = {
      type: actions.RECORD_FORMS_STARTED
    };

    const newState = reducers.forms(initialState, action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle RECORD_FORMS_FINISHED", () => {
    const expected = Map({
      formSections: Map({}),
      fields: Map({}),
      loading: false
    });

    const action = {
      type: actions.RECORD_FORMS_FINISHED
    };

    const newState = reducers.forms(initialState, action);

    expect(newState).to.deep.equal(expected);
  });
});
