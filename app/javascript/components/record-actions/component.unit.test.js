/* eslint-disable prefer-destructuring */
import "test/test.setup";
import { expect } from "chai";
import { setupMountedComponent } from "test";
import { Map } from "immutable";
import { Reopen } from "components/record-actions/reopen";
import { CloseCase } from "components/record-actions/close-case";
import RecordActions from "./component";

describe("<RecordActions /> - Component Reopen", () => {
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

describe("<RecordActions /> - Component CloseCase", () => {
  let component;
  const record = Map({ status: "open" });
  before(() => {
    component = setupMountedComponent(RecordActions, {
      recordType: "cases",
      mode: { isShow: true },
      record
    }).component;
  });

  it("renders CloseCase", () => {
    expect(component.find(CloseCase)).to.have.length(1);
  });
});
