import chai, { expect } from "chai";
import { setupMountedComponent } from "test";
import "test/test.setup";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import { Map, fromJS } from "immutable";

import { IndexTable } from "components/index-table";
import RecordList from "./component";

chai.use(sinonChai);

describe("<RecordList />", () => {
  let component;
  const fetchRecords = sinon.spy();

  before(() => {
    const initialState = fromJS({
      records: {
        FiltersTabs: {
          current: 0
        }
      },
      user: {
        modules: ["primeromodule-cp"]
      },
      application: {
        modules: [
          {
            unique_id: "primeromodule-cp",
            name: "CP",
            associated_record_types: ["case"]
          }
        ]
      }
    });
    component = setupMountedComponent(
      RecordList,
      {
        match: {
          params: {
            recordType: "cases"
          }
        }
      },
      initialState
    ).component;
  });

  it("renders record list table", () => {
    expect(fetchRecords).to.have.been.called;
    expect(component.find(IndexTable)).to.have.length(1);
  });
});
