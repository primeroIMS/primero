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
    component = setupMountedComponent(RecordList, {
      data: { meta: Map({ per: 5, page: 1 }), records: [Map({ id: "test" })] },
      columns: [],
      title: "Record List",
      path: "/records",
      namespace: "TestRecordType",
      getRecords: fetchRecords
    }).component;
  });

  it("renders record list table", () => {
    expect(fetchRecords).to.have.been.called;
    expect(component.find(IndexTable)).to.have.length(1);
  });
});
