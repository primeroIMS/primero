import clone from "lodash/clone";
import chai, { expect } from "chai";
import sinonChai from "sinon-chai";
import * as actionCreators from "./action-creators";

chai.use(sinonChai);

describe("<Flagging /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = clone(actionCreators);

    expect(creators).to.have.property("fetchFlags");
    delete creators.fetchFlags;

    expect(creators).to.deep.equal({});
  });
});
