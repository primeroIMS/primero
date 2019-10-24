import { expect } from "chai";
import "test/test.setup";
import { List } from "immutable";
import { RECORD_PATH } from "config";
import {
  fetchCases,
  fetchIncidents,
  fetchTracingRequests,
  setCasesFilters,
  setIncidentsFilters,
  setTracingRequestFilters
} from "components/records";
import {
  buildTableColumns,
  getRecordsFetcherByType,
  getFiltersSetterByType
} from "./helpers";

const i18n = {
  t: name => {
    name = name.split(".")[1];
    return name.charAt(0).toUpperCase() + name.slice(1);
  }
};

describe("<RecordList /> - buildTableColumns", () => {
  it("should return list of columns for table", () => {
    const expected = [
      { label: "James", name: "James", id: false, options: {} }
    ];

    const records = List([
      {
        id_search: false,
        name: "james",
        field_name: "James"
      }
    ]);
    const columns = buildTableColumns(records, i18n, "testRecordType");
    columns.forEach((v, k) => {
      expect(v).to.deep.equal(expected[k]);
    });
  });
});

describe("<RecordList /> - getFiltersSetterByType", () => {
  it("should return the correct setFilters for each type", () => {
    expect(getFiltersSetterByType(RECORD_PATH.cases)).to.equal(setCasesFilters);
    expect(getFiltersSetterByType(RECORD_PATH.incidents)).to.equal(
      setIncidentsFilters
    );
    expect(getFiltersSetterByType(RECORD_PATH.tracing_requests)).to.equal(
      setTracingRequestFilters
    );
  });
});

describe("<RecordList /> - getRecordsFetcherByType", () => {
  it("should return the correct fetchRecords for the type", () => {
    expect(getRecordsFetcherByType(RECORD_PATH.cases)).to.equal(fetchCases);
    expect(getRecordsFetcherByType(RECORD_PATH.incidents)).to.equal(
      fetchIncidents
    );
    expect(getRecordsFetcherByType(RECORD_PATH.tracing_requests)).to.equal(
      fetchTracingRequests
    );
  });
});
