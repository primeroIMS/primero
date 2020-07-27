import { spy } from "../../test";

import * as utils from "./utils";

describe("<Records /> - utils", () => {
  describe("properties", () => {
    let clone;

    before(() => {
      clone = { ...utils };
    });

    after(() => {
      expect(clone).to.be.empty;
    });

    [
      "cleanUpFilters",
      "clearMetadataOnLocationChange",
      "fetchDataIfNotBackButton"
    ].forEach(property => {
      it(`exports '${property}'`, () => {
        expect(utils).to.have.property(property);
        delete clone[property];
      });
    });
  });

  describe("fetchDataIfNotBackButton", () => {
    const metadata = {
      per: 20,
      page: 1
    };
    const location = { pathname: "test_path" };
    const history = { location };
    const onFetch = spy();
    const searchingKey = "data";
    const rest = { dispatch: spy(), defaultFilterFields: { disabled: true } };

    it("should dispatch an action with DEFAULT_METADATA and defaultFilters", () => {
      utils.fetchDataIfNotBackButton(
        metadata,
        location,
        history,
        onFetch,
        searchingKey,
        rest
      );

      expect(rest.dispatch).to.have.been.called;
      expect(onFetch).to.have.been.called;
      expect(onFetch).to.have.been.calledWith({
        data: {
          disabled: true,
          per: 20,
          page: 1
        }
      });
    });

    it("should dispatch an action with metadata values and defaultFilters", () => {
      utils.fetchDataIfNotBackButton(
        { per: 75, page: 2 },
        location,
        history,
        onFetch,
        searchingKey,
        rest
      );

      expect(rest.dispatch).to.have.been.called;
      expect(onFetch).to.have.been.called;
      expect(onFetch).to.have.been.calledWith({
        data: {
          disabled: true,
          per: 75,
          page: 2
        }
      });
    });
  });

  describe("clearMetadataOnLocationChange", () => {
    const location = { pathname: "test_path" };
    const history = { location };
    const recordType = "TestRecordType";
    const rest = { dispatch: spy() };

    it("should not dispatch an action if previous and next route are equals", () => {
      utils.clearMetadataOnLocationChange(
        location,
        history,
        recordType,
        0,
        rest
      );

      expect(rest.dispatch).to.have.not.been.calledOnce;
    });

    it("should dispatch an action if previous and next route are different", () => {
      utils.clearMetadataOnLocationChange(
        { pathname: "test_other_path" },
        history,
        recordType,
        0,
        rest
      );

      const firstCallArg = rest.dispatch.getCall(0).args[0];

      expect(rest.dispatch).to.have.been.calledOnce;
      expect(firstCallArg).to.deep.equals({
        type: "TestRecordType/CLEAR_METADATA"
      });
    });
  });
});
