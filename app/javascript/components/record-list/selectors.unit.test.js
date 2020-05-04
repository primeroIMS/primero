import { fromJS } from "immutable";

import { FieldRecord } from "../form";

import * as selectors from "./selectors";

const agencies = fromJS([
  { name: "Name", field_name: "agency.name", id_search: false },
  {
    name: "Description",
    field_name: "agency.description",
    id_search: false
  }
]);
const field = FieldRecord({
  display_name: "Test Field 1",
  name: "test_field_1",
  type: "text_field"
});

const metadata = fromJS({
  total: 24,
  per: 20,
  page: 1
});

const stateWithoutRecords = fromJS({});
const stateWithRecords = fromJS({
  user: {
    listHeaders: {
      agencies
    }
  },
  forms: {
    fields: field
  },
  records: {
    cases: {
      metadata
    }
  }
});

describe("<RecordList /> - Selectors", () => {
  describe("getListHeaders", () => {
    it("should return list of headers allowed to the user", () => {
      const expected = agencies;
      const values = selectors.getListHeaders(stateWithRecords, "agencies");

      expect(values).to.deep.equal(agencies);
    });

    it("should return false when there are not users in store", () => {
      const values = selectors.getListHeaders(stateWithoutRecords);

      expect(values).to.be.empty;
    });
  });

  describe("getFields", () => {
    it("should return all fields", () => {
      const values = selectors.getFields(stateWithRecords);

      expect(values).to.deep.equal(field);
    });

    it("should return undefined when there are not messages in store", () => {
      const values = selectors.getFields(stateWithoutRecords);

      expect(values).to.be.empty;
    });
  });

  describe("getMetadata", () => {
    it("should return all metadata", () => {
      const values = selectors.getMetadata(stateWithRecords, "cases");

      expect(values).to.deep.equal(metadata);
    });

    it("should return an empty object when there are not metadata in store", () => {
      const values = selectors.getMetadata(stateWithoutRecords);

      expect(values).to.be.empty;
    });
  });
});
