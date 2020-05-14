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
    const data = {
      options: { per: 20, page: 1 }
    };
    const returnObject = actionCreators.fetchExports(data);
    const expected = {
      type: actions.FETCH_EXPORTS,
      api: {
        path: EXPORT_URL,
        params: data.options
      }
    };

    expect(returnObject).to.not.be.undefined;
    expect(returnObject).to.deep.equals(expected);
  });
});
