import { expect } from "chai";
import { fromJS } from "immutable";

import * as selectors from "./selectors";
import { EXPORT_COLUMNS } from "./constants";
import NAMESPACE from "./namespace";

const bulkExportHeaders = fromJS([
  {
    name: EXPORT_COLUMNS.fileName,
    field_name: EXPORT_COLUMNS.fileName,
    id_search: false
  },
  {
    name: EXPORT_COLUMNS.recordType,
    field_name: EXPORT_COLUMNS.recordType,
    id_search: false
  },
  {
    name: EXPORT_COLUMNS.startedOn,
    field_name: EXPORT_COLUMNS.startedOn,
    id_search: false
  }
]);

const state = fromJS({
  user: {
    listHeaders: {
      bulk_exports: bulkExportHeaders
    }
  }
});

describe("<ExportList /> - pages/export-list/reducers", () => {
  describe("selectListHeaders", () => {
    it("should return list of bulk export headers", () => {
      const records = selectors.selectListHeaders(state, NAMESPACE);

      expect(records).to.deep.equal(bulkExportHeaders);
    });

    it("should not return any header list", () => {
      const records = selectors.selectListHeaders(state, "");

      expect(records).to.be.empty;
    });
  });
});
