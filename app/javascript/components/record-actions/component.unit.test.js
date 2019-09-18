/* eslint-disable prefer-destructuring */
import "test/test.setup";
import { expect } from "chai";
import { setupMountedComponent } from "test";
import { Map } from "immutable";
import { Reopen } from "components/record-action-handlers/reopen";
import RecordActions from "./component";

describe("<RecordActions /> - Component", () => {
  let component;
  const record = Map({ status: "closed" });
  before(() => {
    component = setupMountedComponent(RecordActions, {
      recordType: "cases",
      mode: { isShow: true },
      record
    }).component;
  });

  it("renders Reopen", () => {
    expect(component.find(Reopen)).to.have.length(1);
  });
});
