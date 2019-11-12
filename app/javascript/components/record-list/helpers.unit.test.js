import { expect } from "chai";
import { fromJS } from "immutable";

import {
  fetchCases,
  fetchIncidents,
  fetchTracingRequests,
  setCasesFilters,
  setIncidentsFilters,
  setTracingRequestFilters
} from "../records";
import { RECORD_PATH } from "../../config";
import { ToggleIconCell } from "../index-table";

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
const css = {
  overdueHeading: "testClass"
}

describe("<RecordList /> - buildTableColumns", () => {
  it("should return list of columns for table", () => {
    const expected = [
      { label: "James", name: "James", id: false, options: {} },
      {
        label: "",
        name: "flag_count",
        id: undefined,
        options: {
          customBodyRender: value => (
            <ToggleIconCell value={value} icon="flag" />
          ),
          customHeadRender: columnMeta => (
            <th key={columnMeta.name} className={css.overdueHeading} />
          )
        }
      }
    ];

    const records = fromJS([
      {
        id_search: false,
        name: "james",
        field_name: "James"
      },
      {
        name: "flag_count",
        field_name: "flag_count"
      }
    ]);
    const columns = buildTableColumns(records, i18n, "testRecordType", css);
    columns.forEach((v, k) => {
      expect(v.id).to.equal(expected[k].id);
      expect(v.name).to.equal(expected[k].name);
      expect(v.label).to.equal(expected[k].label);
      expect(v).to.have.property("options");
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
