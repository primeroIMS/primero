import { fromJS } from "immutable";

import {
  APPROVALS,
  CHANGE_LOGS,
  INCIDENT_FROM_CASE,
  RECORD_OWNER,
  RECORD_TYPES,
  REFERRAL,
  TRANSFERS_ASSIGNMENTS
} from "../../../../../config";

import * as utils from "./utils";

describe("<Nav>/components/<RecordInformation>- utils", () => {
  const i18n = { t: value => value };

  describe("getRecordInformationFormIds", () => {
    it("should return all the ids for the record information forms", () => {
      const formIds = fromJS([
        RECORD_OWNER,
        APPROVALS,
        INCIDENT_FROM_CASE,
        REFERRAL,
        TRANSFERS_ASSIGNMENTS,
        CHANGE_LOGS
      ]);

      expect(utils.getRecordInformationFormIds(i18n)).to.deep.equal(formIds);
    });

    it("should return the form ids for incidents", () => {
      const formIds = fromJS([RECORD_OWNER, APPROVALS, REFERRAL, TRANSFERS_ASSIGNMENTS, CHANGE_LOGS]);

      expect(utils.getRecordInformationFormIds(i18n, RECORD_TYPES.incidents)).to.deep.equal(formIds);
    });

    it("should return the form ids for cases", () => {
      const formIds = fromJS([
        RECORD_OWNER,
        APPROVALS,
        INCIDENT_FROM_CASE,
        REFERRAL,
        TRANSFERS_ASSIGNMENTS,
        CHANGE_LOGS
      ]);

      expect(utils.getRecordInformationFormIds(i18n, RECORD_TYPES.cases)).to.deep.equal(formIds);
    });
  });
});
