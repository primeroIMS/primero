import { EXPORT_URL } from "./constants";
import actions from "./actions";
import * as actionCreators from "./action-creators";

describe("<ExportList /> - pages/export-list/action-creators", () => {
  it("should have known action creators", () => {
    const creators = { ...actionCreators };

    ["fetchExports"].forEach(property => {
      expect(creators).to.have.property(property);
      delete creators[property];
    });

    expect(creators).to.be.empty;
  });

  it("should check the 'fetchExports' action creator to return the correct object", () => {
    const params = {
      data: { per: 20, page: 1 }
    };
    const returnObject = actionCreators.fetchExports(params);
    const expected = {
      type: actions.FETCH_EXPORTS,
      api: {
        path: EXPORT_URL,
        params: params.data
      }
    };

    expect(returnObject).to.not.be.undefined;
    expect(returnObject).to.deep.equals(expected);
  });
});
