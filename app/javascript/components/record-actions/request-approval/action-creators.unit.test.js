import { expect } from "chai";

import * as actionCreators from "./action-creators";

describe("<RequestApproval /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = { ...actionCreators };

    expect(creators).to.have.property("approvalRecord");
    delete creators.approvalRecord;

    expect(creators).to.deep.equal({});
  });
});
