import chai, { expect } from "chai";
import { setupMountedComponent } from "test";
import "test/test.setup";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import { Map } from "immutable";

import { IndexTable } from "components/index-table";
import RecordList from "./component";

chai.use(sinonChai);

describe("<RecordList />", () => {
  let component;
  const fetchRecords = sinon.spy();

  before(() => {
    const initialState = Map({
      records: Map({
        FiltersTabs: Map({
          current: 0
        })
      })
    });
    component = setupMountedComponent(
      RecordList, {
      data: {
        meta: Map({ per: 5, page: 1 }),
        records: [Map({ id: "test" })],
        filters: Map({ fields: "short", record_state: true })
      },
      columns: [],
      title: "Record List",
      path: "/records",
      namespace: "TestRecordType",
      getRecords: fetchRecords,
      recordType: "TestRecordType",
      primeroModule: "primeromodule-cp"
    },
    initialState
  ).component;
  });

  it("renders record list table", () => {
    expect(fetchRecords).to.have.been.called;
    expect(component.find(IndexTable)).to.have.length(1);
  });
});
