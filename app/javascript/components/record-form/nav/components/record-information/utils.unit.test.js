import { fromJS } from "immutable";

import {
  APPROVALS,
  INCIDENT_FROM_CASE,
  RECORD_OWNER,
  RECORD_TYPES,
  REFERRAL,
  TRANSFERS_ASSIGNMENTS
} from "../../../../../config";

import * as utils from "./utils";

describe("<Nav>/components/<RecordInformation>- utils", () => {
  const i18n = { t: value => value };

  describe("getRecordInformationForms", () => {
    it("should return all the record information forms", () => {
      expect(utils.getRecordInformationForms(i18n).size).to.equal(5);
    });

    it("should return the record information forms for incidents", () => {
      expect(utils.getRecordInformationForms(i18n, RECORD_TYPES.incidents).size).to.equal(4);
    });

    it("should return the record information forms for cases", () => {
      expect(utils.getRecordInformationForms(i18n, RECORD_TYPES.cases).size).to.equal(5);
    });
  });

  describe("getRecordInformationFormIds", () => {
    it("should return all the ids for the record information forms", () => {
      const formIds = fromJS([RECORD_OWNER, APPROVALS, INCIDENT_FROM_CASE, REFERRAL, TRANSFERS_ASSIGNMENTS]);

      expect(utils.getRecordInformationFormIds(i18n)).to.deep.equal(formIds);
    });

    it("should return the form ids for incidents", () => {
      const formIds = fromJS([RECORD_OWNER, APPROVALS, REFERRAL, TRANSFERS_ASSIGNMENTS]);

      expect(utils.getRecordInformationFormIds(i18n, RECORD_TYPES.incidents)).to.deep.equal(formIds);
    });

    it("should return the form ids for cases", () => {
      const formIds = fromJS([RECORD_OWNER, APPROVALS, INCIDENT_FROM_CASE, REFERRAL, TRANSFERS_ASSIGNMENTS]);

      expect(utils.getRecordInformationFormIds(i18n, RECORD_TYPES.cases)).to.deep.equal(formIds);
    });
  });
});
